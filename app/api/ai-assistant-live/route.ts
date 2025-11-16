import { GoogleGenAI, LiveServerMessage, MediaResolution, Modality, Session } from "@google/genai";
import { functionDefinitions } from "@/lib/llm/definition";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

if (typeof global.WebSocket === "undefined") {
  (global as any).WebSocket = WebSocket;
}

interface RAGResult {
  umkm_id: string;
  name: string;
  description: string;
  address: string;
  lon: number;
  lat: number;
  no_telp: string;
  category: string;
  avg_rating: number;
  similarity_score: number;
  text_similarity: number;
  image_similarity: number | null;
}

interface StreamSession {
  session: Session;
  responseQueue: LiveServerMessage[];
  isProcessing: boolean;
}

const activeSessions = new Map<string, StreamSession>();
const pendingRequests = new Map<string, {
  query: string;
  imageBase64?: string;
  ragResults?: RAGResult[];
  userLocation?: [number, number];
}>();

// POST - Initialize session
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId") || Math.random().toString(36);
    
    const body = await request.json();
    const { query, imageBase64, ragResults, userLocation } = body;

    pendingRequests.set(sessionId, {
      query,
      imageBase64,
      ragResults,
      userLocation
    });

    console.log(`📝 Stored request for session: ${sessionId}`);

    return Response.json({ 
      success: true, 
      sessionId,
      message: "Request queued for streaming" 
    });

  } catch (error) {
    console.error("❌ POST Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET - Stream response
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return Response.json({ error: "Session ID required" }, { status: 400 });
  }

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
  };

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Wait for request data
        let requestData = pendingRequests.get(sessionId);
        let attempts = 0;
        
        while (!requestData && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          requestData = pendingRequests.get(sessionId);
          attempts++;
        }

        if (!requestData) {
          sendSSE(controller, encoder, { 
            type: "error", 
            error: "Request data not found" 
          });
          controller.close();
          return;
        }

        const { query, imageBase64, ragResults, userLocation } = requestData;
        pendingRequests.delete(sessionId);

        console.log(`🚀 Starting AI session: ${sessionId}`);

        // Initialize AI session
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY || "",
        });

        const model = "models/gemini-2.0-flash-exp";
        const tools = [{ functionDeclarations: functionDefinitions }];

        // ✅ FIX: Enable AUDIO modality
        const sessionConfig = {
          responseModalities: [Modality.AUDIO], // ✅ Changed from TEXT to AUDIO
          mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
          speechConfig: {
            languageCode: "id-ID",
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } }
          },
          tools,
          systemInstruction: buildSystemPrompt(ragResults, userLocation),
        };

        const responseQueue: LiveServerMessage[] = [];

        const session = await ai.live.connect({
          model,
          callbacks: {
            onopen: () => {
              console.log("✅ Session opened");
              sendSSE(controller, encoder, { type: "connected" });
            },
            onmessage: (message: LiveServerMessage) => {
              responseQueue.push(message);
            },
            onerror: (e: ErrorEvent) => {
              console.error("❌ Error:", e.message);
              sendSSE(controller, encoder, { type: "error", error: e.message });
            },
            onclose: (e: CloseEvent) => {
              console.log("🔒 Session closed:", e.reason);
            },
          },
          config: sessionConfig
        });

        activeSessions.set(sessionId, {
          session,
          responseQueue,
          isProcessing: false,
        });

        // Build and send prompt
        const ragContext = buildRAGContext(ragResults);
        const fullPrompt = `${ragContext}\n\nUser Query: ${query}`;
        
        await session.sendClientContent({ turns: [fullPrompt] });

        console.log("📤 Prompt sent");

        // Process messages
        await handleTurn(sessionId, controller, encoder);

        // Cleanup
        sendSSE(controller, encoder, { type: "complete" });
        session.close();
        activeSessions.delete(sessionId);

      } catch (error) {
        console.error("❌ Error:", error);
        sendSSE(controller, encoder, { 
          type: "error", 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      } finally {
        controller.close();
      }
    },

    cancel() {
      console.log(`🧹 Cleanup: ${sessionId}`);
      const sessionData = activeSessions.get(sessionId);
      if (sessionData) {
        sessionData.session.close();
        activeSessions.delete(sessionId);
      }
      pendingRequests.delete(sessionId);
    }
  });

  return new Response(stream, { headers });
}

async function handleTurn(
  sessionId: string, 
  controller: ReadableStreamDefaultController, 
  encoder: TextEncoder
) {
  const sessionData = activeSessions.get(sessionId);
  if (!sessionData) return;

  sessionData.isProcessing = true;
  let done = false;

  while (!done) {
    const message = await waitMessage(sessionId);
    if (!message) break;

    await handleModelTurn(message, sessionId, controller, encoder);

    if (message.serverContent?.turnComplete) {
      done = true;
    }
  }

  sessionData.isProcessing = false;
}

async function waitMessage(sessionId: string): Promise<LiveServerMessage | null> {
  const sessionData = activeSessions.get(sessionId);
  if (!sessionData) return null;

  let message: LiveServerMessage | undefined;
  let attempts = 0;
  
  while (!message && attempts < 100) {
    message = sessionData.responseQueue.shift();
    if (!message) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
  }
  
  return message || null;
}

// ✅ FIX: Handle audio chunks properly
async function handleModelTurn(
  message: LiveServerMessage, 
  sessionId: string, 
  controller: ReadableStreamDefaultController, 
  encoder: TextEncoder
) {
  const sessionData = activeSessions.get(sessionId);
  if (!sessionData) return;

  // ✅ 1. Handle function calls FIRST
  if (message.toolCall?.functionCalls && message.toolCall.functionCalls.length > 0) {
    console.log(`🔧 Function calls: ${message.toolCall.functionCalls.length}`);
    
    const functionCalls = message.toolCall.functionCalls.map(fc => ({
      name: fc.name ?? "",
      args: fc.args,
      id: fc.id ?? ""
    }));

    sendSSE(controller, encoder, {
      type: "functionCalls",
      functionCalls: functionCalls
    });

    // Send response back to Gemini
    await sessionData.session.sendToolResponse({
      functionResponses: message.toolCall.functionCalls.map(fc => ({
        id: fc.id,
        name: fc.name,
        response: { success: true, message: "Function executed on frontend" }
      }))
    });
  }

  // ✅ 2. Handle content (audio and text)
  if (message.serverContent?.modelTurn?.parts) {
    for (const part of message.serverContent.modelTurn.parts) {
      // ✅ Handle audio chunks
      if (part?.inlineData) {
        const audioData = part.inlineData.data ?? "";
        
        if (audioData.length > 0) {
          // console.log('🎵 Streaming audio chunk, size:', audioData.length);
          sendSSE(controller, encoder, {
            type: "audioChunk",
            data: audioData,
            mimeType: part.inlineData.mimeType ?? "audio/pcm"
          });
        }
      }

      // ✅ Handle text (fallback)
      if (part?.text) {
        console.log("💬 Text response:", part.text.substring(0, 100));
        sendSSE(controller, encoder, {
          type: "text",
          text: part.text
        });
      }
    }
  }
}

function sendSSE(controller: ReadableStreamDefaultController, encoder: TextEncoder, data: any) {
  try {
    if (controller.desiredSize === null) return;
    
    const sseData = `data: ${JSON.stringify(data)}\n\n`;
    controller.enqueue(encoder.encode(sseData));
  } catch (error) {
    console.log("⚠️ SSE Error:", error);
  }
}

function buildRAGContext(ragResults?: RAGResult[]): string {
  if (!ragResults || ragResults.length === 0) {
    return "Tidak ada data UMKM yang relevan ditemukan.";
  }
  
  let context = "Data UMKM yang relevan berdasarkan pencarian:\n\n";
  
  ragResults.forEach((result, index) => {
    context += `${index + 1}. **${result.name}**\n`;
    context += `   - ID: ${result.umkm_id}\n`;
    context += `   - Kategori: ${result.category}\n`;
    context += `   - Alamat: ${result.address}\n`;
    context += `   - Rating: ${result.avg_rating.toFixed(1)}/5\n`;
    context += `   - Koordinat: [${result.lon}, ${result.lat}]\n`;
    context += `   - Deskripsi: ${result.description}\n`;
    context += `   - Similarity Score: ${result.similarity_score.toFixed(2)}\n\n`;
  });
  
  return context;
}

function buildSystemPrompt(ragResults?: RAGResult[], userLocation?: [number, number]): string {
  const locationInfo = userLocation 
    ? `Lokasi user: [${userLocation[0]}, ${userLocation[1]}]` 
    : "Lokasi user tidak diketahui";

  return `# Jelajahkita AI Assistant

## Your Identity:
Voice assistant untuk aplikasi Jelajahkita - platform eksplorasi UMKM Indonesia.

## Context:
${locationInfo}

## CRITICAL INSTRUCTIONS:
1. ALWAYS provide conversational audio response in Indonesian first
2. Call appropriate functions DURING or AFTER your explanation
3. Function calls can happen at any time during conversation
4. Explain what you're showing while calling the functions
5. LANGSUNG GUNAKAN DATA RAG - Jangan tanya UMKM apa yang dimaksud
6. WAJIB gunakan function calls untuk interaksi map

## RAG DATA USAGE RULES:
- JIKA ada data RAG dengan similarity_score > 0.4, LANGSUNG gunakan
- PRIORITAS similarity tinggi = jawaban yang tepat
- UNTUK TEXT: Similarity > 0.5 = gunakan
- UNTUK IMAGE: Similarity > 0.4 = gunakan
- Jika ada multiple results, pilih yang similarity tertinggi

## FUNCTION CALL MAPPING:

### show_umkm_details:
Keywords: "detail", "info", "tampilkan", "lihat", "buka"
Example Flow:
  * Audio: "Baik, saya akan menampilkan detail [nama UMKM]..."
  * THEN CALL: show_umkm_details(umkm_id, focus_map: true)
  * Audio continues: "...yang berada di [alamat]."

### navigate_to_umkm:
Keywords: "rute", "navigasi", "arah", "carikan jalan"
Example Flow:
  * Audio: "Saya akan carikan rute ke [nama UMKM]..."
  * THEN CALL: navigate_to_umkm(umkm_id, umkm_name, coordinates)
  * Audio continues: "...di [alamat]. Navigasi sudah dimulai."

### highlight_umkm:
Keywords: "sorot", "highlight", "tunjukkan di peta"
Example Flow:
  * Audio: "Saya akan sorot [jumlah] UMKM..."
  * THEN CALL: highlight_umkm([umkm_ids], zoom_to_bounds: true)
  * Audio continues: "...sekarang terlihat di peta."

## EXAMPLES:

**Input**: "Tampilkan detail Warung Makan Sederhana"
**Response Flow**:
1. Audio starts: "Baik, saya akan menampilkan detail Warung Makan Sederhana..."
2. CALL: show_umkm_details("umkm_id", true)
3. Audio continues: "...lokasi ini berada di [alamat], warung makan sederhana adalah [deskripsi] dengan rating [rating]."

Remember: Talk → Call → Continue talking! Functions execute while you speak!`;
}
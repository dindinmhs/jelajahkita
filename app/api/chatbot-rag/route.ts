import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleAuth } from "google-auth-library";

interface UMKMResult {
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const query = formData.get("query") as string;
    const imageFile = formData.get("image") as File | null;

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Generate embeddings
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      credentials: JSON.parse(
        process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ?? ""
      )
    });

    const authClient = await auth.getClient();
    const accessToken = await authClient.getAccessToken();

    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = "us-central1";
    const model = "multimodalembedding@001";

    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predict`;

    // Prepare image base64 if exists
    let imageBase64: string | undefined;
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageBase64 = buffer.toString("base64");
    }

    // Generate embeddings
    const requestBody = {
      instances: [
        {
          text: query,
          ...(imageBase64 && {
            image: {
              bytesBase64Encoded: imageBase64
            }
          })
        }
      ],
      parameters: {
        dimension: 512
      }
    };

    const embeddingResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!embeddingResponse.ok) {
      throw new Error("Failed to generate embeddings");
    }

    const embeddingData = await embeddingResponse.json();
    const textEmbedding = embeddingData.predictions?.[0]?.textEmbedding;
    const imageEmbedding = embeddingData.predictions?.[0]?.imageEmbedding;

    // Search similar UMKM using RPC function
    const supabase = createClient();
    const searchMode = imageFile ? "multimodal" : "text";

    const { data: ragResults, error: ragError } = await (await supabase).rpc(
      "search_similar_umkm",
      {
        query_text_embedding: textEmbedding,
        query_image_embedding: imageEmbedding || null,
        similarity_threshold: 0.3,
        match_limit: 10,
        search_mode: searchMode
      }
    );

    if (ragError) {
      console.error("RAG search error:", ragError);
      throw ragError;
    }

    console.log(`✅ Found ${ragResults?.length || 0} similar UMKM`);

    return NextResponse.json({
      success: true,
      rag_results: ragResults || [],
      search_mode: searchMode,
      embeddings_info: {
        text_embedding_length: textEmbedding?.length || 0,
        image_embedding_length: imageEmbedding?.length || 0,
      }
    });

  } catch (error) {
    console.error("❌ Chatbot RAG Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
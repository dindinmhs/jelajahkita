"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Loader2, ImageIcon, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { useMapStore } from "@/lib/store/useMapStore";
import { useNavigationStore } from "@/lib/store/useNavigation";
import maplibregl from "maplibre-gl";
import { motion, AnimatePresence } from "framer-motion";

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

interface ChatResponse {
  success: boolean;
  rag_results: RAGResult[];
  search_mode: "text" | "multimodal";
}

interface AIChatbotProps {
  map: React.MutableRefObject<maplibregl.Map | null>;
  umkmMarkers: React.MutableRefObject<Map<string, maplibregl.Marker>>;
}

export default function AIChatbot({ map, umkmMarkers }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const nextStartTimeRef = useRef(0);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { userLocation, setSelectedUmkm, setSidebarView, setSidebarOpen } = useMapStore();
  const { startNavigation } = useNavigationStore();

  const initAudio = async () => {
    if (!audioContextRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      nextStartTimeRef.current = ctx.currentTime;
    }
  };

  const playAudioChunk = async (base64Data: string) => {
    if (!isAudioEnabled) return;

    await initAudio();
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    try {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const samples = bytes.length / 2;
      if (samples === 0) return;
      
      const audioBuffer = audioContext.createBuffer(1, samples, 24000);
      const channelData = audioBuffer.getChannelData(0);

      for (let i = 0; i < samples; i++) {
        const byte1 = bytes[i * 2];
        const byte2 = bytes[i * 2 + 1];
        let sample = byte1 | (byte2 << 8);
        
        if (sample >= 32768) {
          sample -= 65536;
        }
        
        channelData[i] = sample / 32768.0;
      }

      audioQueueRef.current.push(audioBuffer);
      
      if (!isPlayingRef.current) {
        playNextChunk();
      }
    } catch (error) {
      console.error('❌ Error processing audio chunk:', error);
    }
  };

  const playNextChunk = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setIsPlayingAudio(false);
      return;
    }

    const audioContext = audioContextRef.current;
    if (!audioContext) {
      isPlayingRef.current = false;
      setIsPlayingAudio(false);
      return;
    }

    isPlayingRef.current = true;
    setIsPlayingAudio(true);
    
    const audioBuffer = audioQueueRef.current.shift()!;
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    
    const now = audioContext.currentTime;
    const startTime = Math.max(now, nextStartTimeRef.current);
    
    source.start(startTime);
    nextStartTimeRef.current = startTime + audioBuffer.duration;
    
    const duration = audioBuffer.duration * 1000;
    
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
    }
    
    playbackTimeoutRef.current = setTimeout(() => {
      playNextChunk();
    }, duration + 10);
    
    source.onended = () => {
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }
      setTimeout(() => playNextChunk(), 5);
    };
  };

  const resetAudioState = () => {
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsPlayingAudio(false);
    
    if (audioContextRef.current) {
      nextStartTimeRef.current = audioContextRef.current.currentTime + 0.1;
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setConnectionStatus("connecting");
    setAiResponse("");
    resetAudioState();

    try {
      const formData = new FormData();
      formData.append("query", query);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const ragResponse = await fetch("/api/chatbot-rag", {
        method: "POST",
        body: formData,
      });

      if (!ragResponse.ok) {
        throw new Error("Failed to get RAG results");
      }

      const ragData: ChatResponse = await ragResponse.json();
      console.log(`✅ Found ${ragData.rag_results.length} similar UMKM`);

      const sessionId = Math.random().toString(36).substring(2);

      const postResponse = await fetch(`/api/ai-assistant-live?sessionId=${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          ragResults: ragData.rag_results,
          userLocation
        })
      });

      if (!postResponse.ok) {
        throw new Error('Failed to initialize AI session');
      }

      const eventSource = new EventSource(`/api/ai-assistant-live?sessionId=${sessionId}`);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = async (event) => {
        try {
          const streamData = JSON.parse(event.data);

          switch (streamData.type) {
            case 'connected':
              setConnectionStatus("connected");
              break;

            case 'text':
              setAiResponse(prev => prev + streamData.text);
              break;

            case 'audioChunk':
              if (streamData.data && streamData.data.length > 0) {
                await playAudioChunk(streamData.data);
              }
              break;

            case 'functionCalls':
              if (Array.isArray(streamData.functionCalls)) {
                for (const call of streamData.functionCalls) {
                  if (call && call.name) {
                    await executeFunctionCall(call.name, call.args || {}, ragData.rag_results);
                  }
                }
              }
              break;

            case 'complete':
              setIsLoading(false);
              setConnectionStatus("disconnected");
              eventSource.close();
              eventSourceRef.current = null;
              break;

            case 'error':
              setError(streamData.error || 'Unknown error');
              setIsLoading(false);
              setConnectionStatus("disconnected");
              eventSource.close();
              eventSourceRef.current = null;
              break;
          }
        } catch (parseError) {
          console.error('❌ Parse error:', parseError);
        }
      };

      eventSource.onerror = () => {
        setError("Connection error");
        setIsLoading(false);
        setConnectionStatus("disconnected");
        eventSource.close();
        eventSourceRef.current = null;
      };

      resetForm();

    } catch (error) {
      console.error("❌ Error:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      setIsLoading(false);
      setConnectionStatus("disconnected");
    }
  };

  const executeFunctionCall = async (functionName: string, args: any, ragResults: RAGResult[]) => {
    console.log(`🚀 Execute: ${functionName}`, args);

    try {
      switch (functionName) {
        case 'show_umkm_details': {
          const { umkm_id, focus_map = true } = args;
          
          const umkm = ragResults.find(r => r.umkm_id === umkm_id);
          if (!umkm) {
            console.warn('UMKM not found in RAG results');
            return;
          }

          setSelectedUmkm({
            id: umkm.umkm_id,
            name: umkm.name,
            category: umkm.category,
            thumbnail_url: null,
            lon: umkm.lon,
            lat: umkm.lat,
          });

          setSidebarView('detail');
          setSidebarOpen(true);

          if (focus_map && map.current) {
            map.current.flyTo({
              center: [umkm.lon, umkm.lat],
              zoom: 16,
              duration: 1500,
            });
          }
          break;
        }

        case 'navigate_to_umkm': {
          const { umkm_id, umkm_name, coordinates } = args;
          
          if (!coordinates && umkm_id) {
            const umkm = ragResults.find(r => r.umkm_id === umkm_id);
            if (umkm) {
              startNavigation(umkm.name, [umkm.lon, umkm.lat]);
            }
          } else if (umkm_name && coordinates) {
            startNavigation(umkm_name, coordinates as [number, number]);
          }
          break;
        }

        case 'highlight_umkm': {
          const { umkm_ids, zoom_to_bounds = true } = args;
          
          if (!Array.isArray(umkm_ids) || umkm_ids.length === 0) break;

          const bounds = new maplibregl.LngLatBounds();
          
          umkm_ids.forEach((id: string) => {
            const marker = umkmMarkers.current.get(id);
            if (marker) {
              const element = marker.getElement();
              
              element.classList.add('animate-bounce');
              element.style.filter = 'drop-shadow(0 0 10px rgba(255, 107, 53, 0.8))';
              element.style.transform = 'scale(1.2)';
              
              const lngLat = marker.getLngLat();
              bounds.extend([lngLat.lng, lngLat.lat]);
              
              setTimeout(() => {
                element.classList.remove('animate-bounce');
                element.style.filter = '';
                element.style.transform = '';
              }, 5000);
            }
          });

          if (zoom_to_bounds && map.current && !bounds.isEmpty()) {
            map.current.fitBounds(bounds, {
              padding: 100,
              maxZoom: 15,
              duration: 1500,
            });
          }
          break;
        }
      }
    } catch (error) {
      console.error(`Error executing ${functionName}:`, error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setQuery("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (!isAudioEnabled) {
      resetAudioState();
    }
  };

  const stopCurrentAudio = () => {
    resetAudioState();
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsLoading(false);
      setConnectionStatus("disconnected");
    }
  };

  useEffect(() => {
    const handleFirstClick = () => {
      initAudio();
    };
    
    document.addEventListener('click', handleFirstClick, { once: true });
    
    return () => {
      document.removeEventListener('click', handleFirstClick);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <>
      {/* ✅ Chatbot Button - Always visible with scale animation */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen 
            ? "bg-red-500 hover:bg-red-600" 
            : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 animate-pulse"
        } shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all`}
        title={isOpen ? "Tutup AI Assistant" : "Buka AI Assistant"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X size={20} className="text-white" />
        ) : (
          <Sparkles size={20} className="text-white" />
        )}
      </motion.button>

      {/* ✅ Chat Panel with Fade Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-16 right-16 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-white" />
                  <div>
                    <h3 className="font-bold text-white text-sm">AI Assistant</h3>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          connectionStatus === "connected"
                            ? "bg-green-400"
                            : connectionStatus === "connecting"
                            ? "bg-yellow-400 animate-pulse"
                            : "bg-white/50"
                        }`}
                      />
                      <span className="text-xs text-white/90">
                        {connectionStatus === "connected" ? "Connected" : 
                         connectionStatus === "connecting" ? "Connecting..." : "Ready"}
                      </span>
                      {isPlayingAudio && (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                          <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleAudio}
                    className={`p-1 rounded transition-colors ${
                      isAudioEnabled
                        ? "text-white hover:bg-white/20"
                        : "text-white/50 hover:bg-white/20"
                    }`}
                    title={isAudioEnabled ? "Matikan Audio" : "Nyalakan Audio"}
                  >
                    {isAudioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>

                  {isPlayingAudio && (
                    <button
                      onClick={stopCurrentAudio}
                      className="p-1 text-white hover:bg-white/20 rounded transition-colors"
                      title="Stop Audio"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Response */}
            <AnimatePresence>
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 bg-orange-50 border-b max-h-40 overflow-y-auto"
                >
                  <p className="text-sm text-orange-900 whitespace-pre-wrap">{aiResponse}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 bg-red-50 border-b"
                >
                  <p className="text-sm text-red-600">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image Preview */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 border-b"
                >
                  <div className="relative inline-block">
                    <Image
                      width={100}
                      height={100}
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      disabled={isLoading}
                    >
                      <X size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4">
              <textarea
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Contoh:
• Cari tempat makan enak
• Tampilkan detail [nama UMKM]
• Navigasi ke [nama UMKM]"
                className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-3"
                rows={3}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />

              <div className="flex justify-between items-center">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                    disabled={isLoading}
                  >
                    <ImageIcon size={18} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
"use client";

import { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/lib/store/useChatStore";
import { createClient } from "@/lib/supabase/client";
import { X, Send, ArrowLeft } from "lucide-react";
import { useUserStore } from "@/lib/store/user-store";
import ChatList from "./chat-list";

interface Message {
  id: string;
  message: string;
  sender_type: "user" | "umkm";
  created_at: string;
  user_fullname?: string;
}

export default function ChatPopup() {
  const [message, setMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Draggable state
  const [position, setPosition] = useState({ x: 0, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  const { user } = useUserStore();
  const {
    isChatOpen,
    isListView,
    currentChatUmkmId,
    currentChatUmkmName,
    messages,
    isLoadingMessages,
    closeChat,
    showListView,
    setMessages,
    addMessage,
    setLoadingMessages,
  } = useChatStore();

  useEffect(() => {
    setIsMounted(true);
    // Set initial position
    if (typeof window !== "undefined") {
      setPosition({ x: window.innerWidth - 420, y: 100 });
    }
  }, []);

  // Debug log
  useEffect(() => {
    console.log("Chat Popup State:", {
      isChatOpen,
      isListView,
      currentChatUmkmId,
      currentChatUmkmName,
      isMounted,
    });
  }, [isChatOpen, isListView, currentChatUmkmId, currentChatUmkmName, isMounted]);

  // Draggable handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(".drag-handle")) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Boundaries
      const maxX = window.innerWidth - 400;
      const maxY = window.innerHeight - 600;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, dragOffset]);

  // Fetch messages when chat view opens
  useEffect(() => {
    if (!isListView && currentChatUmkmId && user) {
      const fetchMessages = async () => {
        setLoadingMessages(true);
        const supabase = createClient();

        try {
          const { data, error } = await supabase
            .from("chat_full_view")
            .select("id, message, sender_type, created_at, user_fullname, umkm_name")
            .eq("umkm_id", currentChatUmkmId)
            .eq("user_id", user.id)
            .order("created_at", { ascending: true });

          if (error) {
            console.error("Error fetching messages:", error);
            return;
          }

          setMessages(data || []);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoadingMessages(false);
        }
      };

      fetchMessages();
    }
  }, [isListView, currentChatUmkmId, user]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !currentChatUmkmId) return;

    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("chat")
        .insert({
          user_id: user.id,
          umkm_id: currentChatUmkmId,
          message: message.trim(),
          sender_type: "user",
        })
        .select()
        .single();

      if (error) {
        console.error("Error sending message:", error);
        return;
      }

      addMessage({
        ...data,
        user_fullname: user.user_metadata?.full_name || "User",
      });
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isChatOpen || !isMounted) {
    console.log("Chat popup not rendering:", { isChatOpen, isMounted });
    return null;
  }

  console.log("Chat popup rendering!");

  return (
    <>
      <div
        ref={popupRef}
        className="fixed bg-white rounded-2xl shadow-2xl border border-gray-200 transition-opacity duration-200"
        style={{
          width: "400px",
          height: "600px",
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 99999,
          opacity: isChatOpen ? 1 : 0,
          transform: isChatOpen ? "scale(1)" : "scale(0.95)",
          transition: isDragging ? "none" : "opacity 0.2s, transform 0.2s",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header - Draggable Area */}
        <div 
          className="drag-handle bg-gradient-to-r from-[#FF6B35] to-[#ff8c42] p-4 rounded-t-2xl flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0 pointer-events-none">
            {!isListView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showListView();
                }}
                className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer pointer-events-auto"
              >
                <ArrowLeft className="text-white" size={20} />
              </button>
            )}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💬</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white truncate">
                {isListView ? "Chat" : currentChatUmkmName}
              </h3>
              <p className="text-xs text-white/80">
                {isListView ? "Daftar percakapan" : "Chat dengan penjual"}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeChat();
            }}
            className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer flex-shrink-0 pointer-events-auto"
          >
            <X className="text-white" size={18} />
          </button>
        </div>

        {/* Content - Non-draggable */}
        <div className="h-[calc(100%-76px)] overflow-hidden">
          {isListView ? (
            <ChatList />
          ) : (
            <div className="flex flex-col h-full">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-8 h-8 border-3 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-xs text-gray-600">Memuat pesan...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-3xl">💬</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        Belum ada pesan
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Mulai percakapan dengan penjual
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender_type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            msg.sender_type === "user"
                              ? "bg-[#FF6B35] text-white rounded-br-none"
                              : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                          }`}
                        >
                          {msg.sender_type === "umkm" && (
                            <p className="text-xs text-gray-500 font-medium mb-1">
                              {currentChatUmkmName}
                            </p>
                          )}
                          <p className="text-sm break-words">{msg.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender_type === "user"
                                ? "text-white/70"
                                : "text-gray-500"
                            }`}
                          >
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ketik pesan..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-sm"
                    disabled={!user}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || !user}
                    className="p-2 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send size={20} />
                  </button>
                </div>
                {!user && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Login untuk mengirim pesan
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .drag-handle {
          touch-action: none;
        }
      `}</style>
    </>
  );
}
"use client";

import { useEffect } from "react";
import { useChatStore } from "@/lib/store/useChatStore";
import { useUserStore } from "@/lib/store/user-store";
import { createClient } from "@/lib/supabase/client";
import { MessageCircle, ChevronRight } from "lucide-react";
import Image from "next/image";

interface ChatRoom {
  umkm_id: string;
  umkm_name: string;
  umkm_thumbnail: string | null;
  last_message: string;
  last_message_time: string;
}

export default function ChatList() {
  const { user } = useUserStore();
  const {
    chatRooms,
    isLoadingRooms,
    setChatRooms,
    setLoadingRooms,
    showChatView,
  } = useChatStore();

  useEffect(() => {
    if (!user) return;

    const fetchChatRooms = async () => {
      setLoadingRooms(true);
      const supabase = createClient();

      try {
        // Get distinct UMKM that user has chatted with from chat_full_view
        const { data: chats, error } = await supabase
          .from("chat_full_view")
          .select("umkm_id, umkm_name, umkm_thumbnail, message, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching chat rooms:", error);
          return;
        }

        // Group by UMKM and get last message
        const roomsMap = new Map<string, ChatRoom>();
        chats?.forEach((chat) => {
          if (!roomsMap.has(chat.umkm_id)) {
            roomsMap.set(chat.umkm_id, {
              umkm_id: chat.umkm_id,
              umkm_name: chat.umkm_name,
              umkm_thumbnail: chat.umkm_thumbnail,
              last_message: chat.message,
              last_message_time: chat.created_at,
            });
          }
        });

        setChatRooms(Array.from(roomsMap.values()));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchChatRooms();
  }, [user]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}h yang lalu`;
    } else if (hours > 0) {
      return `${hours}j yang lalu`;
    } else {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="text-gray-400" size={32} />
        </div>
        <p className="text-sm text-gray-600 font-medium mb-1">
          Login untuk mulai chat
        </p>
        <p className="text-xs text-gray-500 text-center">
          Chat langsung dengan penjual UMKM
        </p>
      </div>
    );
  }

  if (isLoadingRooms) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-gray-600">Memuat chat...</p>
        </div>
      </div>
    );
  }

  if (chatRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="text-gray-400" size={32} />
        </div>
        <p className="text-sm text-gray-600 font-medium mb-1">
          Belum ada chat
        </p>
        <p className="text-xs text-gray-500 text-center">
          Mulai chat dengan UMKM dari detail UMKM
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900">Chat</h3>
        <p className="text-xs text-gray-500">{chatRooms.length} percakapan</p>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chatRooms.map((room) => (
          <button
            key={room.umkm_id}
            onClick={() => showChatView(room.umkm_id, room.umkm_name)}
            className="w-full p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center gap-3"
          >
            {/* Avatar */}
            <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
              {room.umkm_thumbnail ? (
                <Image
                  src={room.umkm_thumbnail}
                  alt={room.umkm_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MessageCircle className="text-gray-400" size={20} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-sm text-gray-900 truncate">
                  {room.umkm_name}
                </h4>
                {room.last_message_time && (
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatTime(room.last_message_time)}
                  </span>
                )}
              </div>
              {room.last_message && (
                <p className="text-xs text-gray-600 truncate">
                  {room.last_message}
                </p>
              )}
            </div>

            {/* Arrow */}
            <ChevronRight className="text-gray-400 flex-shrink-0" size={18} />
          </button>
        ))}
      </div>
    </div>
  );
}
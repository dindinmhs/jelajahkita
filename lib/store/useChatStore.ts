import { create } from "zustand";

interface Message {
  id: string;
  message: string;
  sender_type: "user" | "umkm";
  created_at: string;
  user_id: string;
  umkm_id: string;
}

interface ChatRoom {
  umkm_id: string;
  umkm_name: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  umkm_thumbnail: string | null;
}

interface ChatStore {
  isChatOpen: boolean;
  isListView: boolean;
  currentChatUmkmId: string | null;
  currentChatUmkmName: string | null;
  chatRooms: ChatRoom[];
  messages: Message[];
  isLoadingMessages: boolean;
  isLoadingRooms: boolean;
  
  openChat: (umkmId: string, umkmName: string) => void;
  closeChat: () => void;
  toggleChatView: () => void;
  showListView: () => void;
  showChatView: (umkmId: string, umkmName: string) => void;
  
  setChatRooms: (rooms: ChatRoom[]) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setLoadingMessages: (loading: boolean) => void;
  setLoadingRooms: (loading: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isChatOpen: false,
  isListView: true,
  currentChatUmkmId: null,
  currentChatUmkmName: null,
  chatRooms: [],
  messages: [],
  isLoadingMessages: false,
  isLoadingRooms: false,
  
  openChat: (umkmId, umkmName) =>
    set({
      isChatOpen: true,
      isListView: false,
      currentChatUmkmId: umkmId,
      currentChatUmkmName: umkmName,
    }),
  
  closeChat: () =>
    set({
      isChatOpen: false,
      isListView: true,
      currentChatUmkmId: null,
      currentChatUmkmName: null,
      messages: [],
    }),
  
  toggleChatView: () => set((state) => ({ 
    isChatOpen: !state.isChatOpen,
    isListView: true // Reset ke list view saat toggle
  })),
  
  showListView: () =>
    set({
      isListView: true,
      currentChatUmkmId: null,
      currentChatUmkmName: null,
      messages: [],
    }),
  
  showChatView: (umkmId, umkmName) =>
    set({
      isListView: false,
      currentChatUmkmId: umkmId,
      currentChatUmkmName: umkmName,
    }),
  
  setChatRooms: (rooms) => set({ chatRooms: rooms }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setLoadingMessages: (loading) => set({ isLoadingMessages: loading }),
  setLoadingRooms: (loading) => set({ isLoadingRooms: loading }),
}));
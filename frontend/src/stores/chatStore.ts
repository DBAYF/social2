import { create } from 'zustand';

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Chat {
  id: string;
  participants: {
    id: string;
    username: string;
    fullname: string;
    profilePicture?: string;
    isOnline: boolean;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  messages: Record<string, Message[]>;
  onlineUsers: Set<string>;
  isConnected: boolean;

  // Actions
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  setActiveChat: (chatId: string | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  markMessagesRead: (chatId: string) => void;
  setOnlineUsers: (users: string[]) => void;
  setConnected: (connected: boolean) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChat: null,
  messages: {},
  onlineUsers: new Set(),
  isConnected: false,

  setChats: (chats) => set({ chats }),

  addChat: (chat) => set((state) => ({
    chats: [chat, ...state.chats.filter(c => c.id !== chat.id)]
  })),

  setActiveChat: (chatId) => set({ activeChat: chatId }),

  addMessage: (chatId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: [...(state.messages[chatId] || []), message]
    },
    chats: state.chats.map(chat =>
      chat.id === chatId
        ? {
            ...chat,
            lastMessage: message,
            unreadCount: chat.id === state.activeChat ? 0 : chat.unreadCount + 1,
            updatedAt: message.createdAt
          }
        : chat
    )
  })),

  setMessages: (chatId, messages) => set((state) => ({
    messages: { ...state.messages, [chatId]: messages }
  })),

  markMessagesRead: (chatId) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: (state.messages[chatId] || []).map(msg => ({ ...msg, isRead: true }))
    },
    chats: state.chats.map(chat =>
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    )
  })),

  setOnlineUsers: (users) => set({ onlineUsers: new Set(users) }),

  setConnected: (connected) => set({ isConnected: connected }),

  updateChat: (chatId, updates) => set((state) => ({
    chats: state.chats.map(chat =>
      chat.id === chatId ? { ...chat, ...updates } : chat
    )
  })),
}));
import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  onlineUsers: [],
  totalUnread: 0,
  isLoadingMessages: false,
  isLoadingConversations: false,

  // Set online users from socket
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  // Set total unread count
  setTotalUnread: (count) => set({ totalUnread: count }),

  // Set active conversation
  setActiveConversation: (conversation) =>
    set({ activeConversation: conversation }),

  // Get all conversations
  getConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const res = await axiosInstance.get("/messages/conversations");
      set({ conversations: res.data });
    } catch (error) {
      toast.error("Failed to load conversations");
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  // Get messages for a conversation
  getMessages: async (receiverId) => {
    set({ isLoadingMessages: true });
    try {
      const res = await axiosInstance.get(`/messages/${receiverId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  // Send message
  sendMessage: async (receiverId, formData) => {
    try {
      const res = await axiosInstance.post(
        `/messages/send/${receiverId}`,
        formData
      );
      set((state) => ({ messages: [...state.messages, res.data] }));
    } catch (error) {
      toast.error("Failed to send message");
    }
  },

  // Add message from socket (real-time)
  addMessage: (message) => {
    set((state) => {
      // Only add if it belongs to active conversation
      const active = state.activeConversation;
      if (
        active &&
        String(message.conversationId) === String(active._id)
      ) {
        return { messages: [...state.messages, message] };
      }
      return {};
    });
  },

  // Update conversation in list (last message + unread)
  updateConversation: (data) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        String(conv._id) === String(data.conversationId)
          ? {
              ...conv,
              lastMessage: data.lastMessage,
              unreadCounts: {
                ...conv.unreadCounts,
              },
            }
          : conv
      ),
    }));
  },
}));

export default useChatStore;
import { create } from "zustand";
import { getSocket } from "../lib/socket.js";
import useChatStore from "./useChatStore.js";
import toast from "react-hot-toast";

const useSocketStore = create((set) => ({
  isConnected: false,

  // Setup all socket listeners
  setupListeners: () => {
    const socket = getSocket();
    if (!socket) return;

    // Online users
    socket.on("getOnlineUsers", (users) => {
      useChatStore.getState().setOnlineUsers(users);
    });

    // New message received
    socket.on("newMessage", (message) => {
      useChatStore.getState().addMessage(message);
    });

    // Conversation list update
    socket.on("conversationUpdated", (data) => {
      useChatStore.getState().updateConversation(data);
    });

    // Total unread badge
    socket.on("totalUnreadCount", ({ totalUnread }) => {
      useChatStore.getState().setTotalUnread(totalUnread);
    });

    // Group events
    socket.on("addedToGroup", (group) => {
      toast.success(`You were added to ${group.groupName}`);
      useChatStore.getState().getConversations();
    });

    socket.on("removedFromGroup", () => {
      toast.error("You were removed from a group");
      useChatStore.getState().getConversations();
    });

    socket.on("groupDeleted", () => {
      toast.error("A group you were in was deleted");
      useChatStore.getState().getConversations();
    });

    socket.on("groupUpdated", () => {
      useChatStore.getState().getConversations();
    });

    set({ isConnected: true });
  },

  // Remove all listeners (cleanup)
  removeListeners: () => {
    const socket = getSocket();
    if (!socket) return;

    socket.off("getOnlineUsers");
    socket.off("newMessage");
    socket.off("conversationUpdated");
    socket.off("totalUnreadCount");
    socket.off("addedToGroup");
    socket.off("removedFromGroup");
    socket.off("groupDeleted");
    socket.off("groupUpdated");

    set({ isConnected: false });
  },
}));

export default useSocketStore;
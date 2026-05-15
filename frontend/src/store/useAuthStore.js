import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import { connectSocket, disconnectSocket } from "../lib/socket.js";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  isLoading: false,
  isCheckingAuth: true,

  // Register
  register: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/auth/register", formData);
      localStorage.setItem("accessToken", res.data.accessToken);
      set({ user: res.data, accessToken: res.data.accessToken });
      connectSocket(res.data._id);
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      set({ isLoading: false });
    }
  },

  // Login
  login: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      localStorage.setItem("accessToken", res.data.accessToken);
      set({ user: res.data, accessToken: res.data.accessToken });
      connectSocket(res.data._id);
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoading: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("accessToken");
      disconnectSocket();
      set({ user: null, accessToken: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed");
    }
  },

  // Check if user is already logged in on page refresh
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/users/me");
      set({ user: res.data });
      connectSocket(res.data._id);
    } catch {
      set({ user: null });
      localStorage.removeItem("accessToken");
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));

export default useAuthStore;
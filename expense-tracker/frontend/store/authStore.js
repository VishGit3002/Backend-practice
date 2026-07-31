import { create } from "zustand";
import api from "@/lib/axios";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Signup
  signup: async ({ name, email, password, balance }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/api/auth/signup", {
        name,
        email,
        password,
        balance: balance || 0,
      });
      set({
        user: res.data.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true };
    } catch (error) {
      const msg =
        error.response?.data?.message || "Signup failed. Please try again.";
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  // Login — note: backend expects "passwords" not "password"
  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/api/auth/login", {
        email,
        passwords: password,
      });
      set({
        user: res.data.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true };
    } catch (error) {
      const msg =
        error.response?.data?.message || "Login failed. Please try again.";
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore
    }
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
  },

  // Get current user (session restore)
  getUser: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/api/auth/getUser");
      set({
        user: res.data.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;

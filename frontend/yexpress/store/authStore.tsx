'use client'
import { create } from "zustand";
import axios from "axios";


interface AuthState {
  isLoggedIn: boolean;
  user: any;
  pendingUser: any;
  role: string | null;
  loading: boolean;

  login: (data: { email: string; password: string }) => Promise<{
    success: boolean;
    message?: string;
  }>;

  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;

  signupUser: (data: {
    username?: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<{
    success: boolean;
    message?: string;
  }>;
}


const api = axios.create({
  baseURL: "http://localhost:5000/api/",
  withCredentials: true,
});


const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  pendingUser: null,
  role: null,
  loading: false,

  login: async ({ email, password }) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      set({
        isLoggedIn: true,
        user: response.data.data,
        role: response.data.data.role,
      });

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message:
          err?.response?.data?.message || err?.message || "Login failed",
      };
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    set({ isLoggedIn: false, user: null, pendingUser: null, role: null });
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/auth/refresh-token");
      set({
        isLoggedIn: true,
        user: res.data.data,
        role: res.data.data.role,
        loading: false,
      });
    } catch {
      set({ isLoggedIn: false, user: null, role: null, loading: false });
    }
  },

  signupUser: async ({ username, email, phone, password }) => {
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        phone,
        password,
      });

      set({
        pendingUser: { id: response.data.data.userid, email, phone },
      });

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message:
          err?.response?.data?.message || err?.message || "Signup failed",
      };
    }
  },
}));

export default useAuthStore;

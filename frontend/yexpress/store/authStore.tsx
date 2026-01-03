"use client";
import { create } from "zustand";
import axios from "axios";

interface AuthState {
  isLoggedIn: boolean;
  user: any;
  pendingUser: any;
  role: string | null;
  email: string | null;
  phone?: string | null;
  username?: string | null;
  avatar: string;
  createdAt?: string;
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

const generateAvatar = (name?: string, email?: string) => {
  const displayName = name || email || "User";

  const background = "6366f1";
  const color = "fff";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=${background}&color=${color}`;
};

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  pendingUser: null,
  role: null,
  email: null,
  phone: null,
  username: null,
  createdAt: undefined,
  avatar: "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff",
  loading: false,

  login: async ({ email, password }) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      const avatar = generateAvatar(
        response.data.data.username,
        response.data.data.email
      );
      set({
        isLoggedIn: true,
        user: response.data.data.userId,
        role: response.data.data.role,
        email: response.data.data.email,
        phone: response.data.data.phone,
        createdAt: response.data.data.createdAt,
        avatar: avatar,
        username: response.data.data.username,
      });

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || err?.message || "Login failed",
      };
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    set({
      isLoggedIn: false,
      user: null,
      pendingUser: null,
      role: null,
      email: null,
      phone: null,
      username: null,
      createdAt: undefined,
      avatar:
        "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff",
    });
  },

  checkAuth: async () => {
    set({ loading: true });

    try {
      const response = await api.get("/auth/refresh-token", {
        withCredentials: true,
      });
      const username = response.data.data.username;
      const email = response.data.data.email;
      const avatar = generateAvatar(username, email);

      set({
        isLoggedIn: true,
        user: response.data.data.userId,
        role: response.data.data.role,
        username,
        email,
        phone: response.data.data.phone,
        createdAt: response.data.data.createdAt,
        avatar,
        loading: false,
      });
    } catch {
      set({
        isLoggedIn: false,
        user: null,
        role: null,
        email: null,
        phone: null,
        username: null,
        createdAt: undefined,
        avatar:
          "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff",
        loading: false,
      });
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
      const avatar = generateAvatar(username, email);
      set({
        pendingUser: {
          id: response.data.data.userid,
          email,
          phone,
          username,
          avatar,
        },
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

"use client";

import { create } from "zustand";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
}

interface UserStore {
  user: UserProfile | null;
  setUser: (data: UserProfile) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (data) => set({ user: data }),
  clearUser: () => set({ user: null }),
}));

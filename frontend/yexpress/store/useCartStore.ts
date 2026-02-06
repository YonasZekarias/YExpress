import { create } from 'zustand';

interface CartState {
  count: number;
  setCount: (count: number) => void;
  fetchCount: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
  fetchCount: async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/cart`, { credentials: 'include' });
      const data = await res.json();
      set({ count: data.data?.items?.length || 0 });
    } catch (err) {
      set({ count: 0 });
    }
  }
}));
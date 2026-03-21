import { create } from "zustand";
import { addToCart, fetchCart, removeFromCart } from "./api";
import type { CartItem } from "./api";

interface CartState {
  items: CartItem[];
  count: number;
  load: () => Promise<string | null>;
  add: (productId: number) => Promise<string | null>;
  remove: (id: number) => Promise<string | null>;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  count: 0,

  load: async () => {
    const result = await fetchCart();
    if (!result.ok) return result.error;
    set({ items: result.data.items, count: result.data.count });
    return null;
  },

  add: async (productId: number) => {
    const result = await addToCart(productId);
    if (!result.ok) return result.error;
    set((state) => ({
      items: [result.data, ...state.items],
      count: state.count + 1,
    }));
    return null;
  },

  remove: async (id: number) => {
    const result = await removeFromCart(id);
    if (!result.ok) return result.error;
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      count: state.count - 1,
    }));
    return null;
  },
}));

// store/cart-store.tsx
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;              // unique line ID (menuItemId + optionId)
  menuItemId: string;
  optionId?: string;
  name: string;
  optionName?: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  clearCart: () => void;

  // Drawer
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Derived (compute on the fly)
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        // Build unique line id
        const lineId = `${newItem.menuItemId}__${newItem.optionId ?? "default"}`;

        set((state) => {
          const existing = state.items.find((i) => i.id === lineId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === lineId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { ...newItem, id: lineId }],
            isOpen: true,
          };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      updateNotes: (id, notes) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, notes } : i)),
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "ginza-cart",
      partialize: (state) => ({ items: state.items }), // don't persist drawer state
    }
  )
);
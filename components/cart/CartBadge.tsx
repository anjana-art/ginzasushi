// components/cart/CartBadge.tsx
"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export function CartBadge() {
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-ginza-black hover:text-ginza-gold transition-colors"
      aria-label={`Cart (${itemCount} items)`}
    >
      <ShoppingBag size={20} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-ginza-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
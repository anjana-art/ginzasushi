// components/menu/QuickAddButton.tsx
"use client";

import { useState } from "react";
import { Plus, Check, Settings2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

interface QuickAddButtonProps {
  menuItemId: string;
  name: string;
  price: number;
  image?: string;
  hasOptions: boolean;
  slug: string;
}

export function QuickAddButton({
  menuItemId,
  name,
  price,
  image,
  hasOptions,
  slug,
}: QuickAddButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();     // stop Link navigation
    e.stopPropagation();

    if (hasOptions) return; // shouldn't happen — button is replaced

    addItem({
      menuItemId,
      name,
      price,
      quantity: 1,
      image,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // If item has options → show "Choose" that navigates to detail page
  if (hasOptions) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = `/menu/${slug}`;
        }}
        className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold border-2 border-ginza-black text-ginza-black hover:bg-ginza-black hover:text-white transition-all tracking-wide"
        aria-label={`Choose options for ${name}`}
      >
        <Settings2 size={13} />
        Choose
      </button>
    );
  }

  // No options → instant add
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold border-2 transition-all tracking-wide ${
        added
          ? "bg-green-600 border-green-600 text-white"
          : "bg-ginza-black border-ginza-black text-white hover:bg-ginza-gold hover:border-ginza-gold hover:text-ginza-black"
      }`}
      aria-label={`Add ${name} to cart`}
    >
      {added ? (
        <>
          <Check size={13} />
          Added
        </>
      ) : (
        <>
          <Plus size={13} />
          Add
        </>
      )}
    </button>
  );
}
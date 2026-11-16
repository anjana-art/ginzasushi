// components/menu/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

interface Option {
  id: string;
  name: string;
  group: string;
  priceAdjustment: unknown;
}

interface AddToCartButtonProps {
  menuItemId: string;
  name: string;
  basePrice: number;
  image?: string;
  options: Option[];
}

export function AddToCartButton({
  menuItemId,
  name,
  basePrice,
  image,
  options,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(
    options.length > 0 ? options[0].id : undefined
  );
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState(false);

  const selectedOption = options.find((o) => o.id === selectedOptionId);
  const optionPrice = selectedOption
    ? Number(selectedOption.priceAdjustment)
    : 0;
  const unitPrice = basePrice + optionPrice;
  const total = unitPrice * quantity;

  const handleAdd = () => {
    addItem({
      menuItemId,
      optionId: selectedOptionId,
      name,
      optionName: selectedOption?.name,
      price: unitPrice,
      quantity,
      image,
      notes: notes.trim() || undefined,
    });

    // Show "Added!" flash
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);

    // Reset (keep quantity so user sees what they ordered)
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      {options.length > 0 && (
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-ginza-grey mb-3">
            Choose option
          </label>
          <div className="space-y-2">
            {options.map((opt) => {
              const active = opt.id === selectedOptionId;
              const adj = Number(opt.priceAdjustment);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 border-2 transition-all text-left ${
                    active
                      ? "border-ginza-gold bg-ginza-gold/5"
                      : "border-ginza-grey-light hover:border-ginza-gold"
                  }`}
                >
                  <span className="text-sm font-medium text-ginza-black">
                    {opt.name}
                  </span>
                  {adj > 0 && (
                    <span className="text-sm text-ginza-gold font-semibold">
                      +{formatPrice(adj)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-ginza-grey mb-3">
          Special instructions (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. no wasabi, extra ginger..."
          rows={2}
          className="w-full px-4 py-3 border-2 border-ginza-grey-light focus:border-ginza-gold outline-none text-sm resize-none"
        />
      </div>

      {/* Quantity + Add */}
      <div className="flex items-stretch gap-4">
        <div className="flex items-center border-2 border-ginza-grey-light">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-12 h-12 flex items-center justify-center text-ginza-black hover:text-ginza-gold transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-semibold text-ginza-black">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="w-12 h-12 flex items-center justify-center text-ginza-black hover:text-ginza-gold transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-3 px-6 h-12 font-semibold tracking-wide border-2 transition-all ${
            added
              ? "bg-green-600 border-green-600 text-white"
              : "bg-ginza-black border-ginza-black text-white hover:bg-ginza-gold hover:border-ginza-gold hover:text-ginza-black"
          }`}
        >
          {added ? (
            <>
              <Check size={18} /> Added
            </>
          ) : (
            <>
              <ShoppingBag size={18} />
              Add — {formatPrice(total)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
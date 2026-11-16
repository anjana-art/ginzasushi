// components/cart/CartDrawer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } =
    useCartStore();

  const sub = subtotal();
 

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[101] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-ginza-gold">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-ginza-gold" />
            <h2 className="font-serif text-xl font-bold text-ginza-black">
              Your Order
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-ginza-grey hover:text-ginza-black transition-colors"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🍣</p>
              <p className="font-serif text-xl text-ginza-black mb-2">
                Your cart is empty
              </p>
              <p className="text-sm text-ginza-grey mb-6">
                Add some sushi to get started
              </p>
              <Link
                href="/menu"
                onClick={closeCart}
                className="btn-primary inline-flex"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Free delivery progress */}
             

              {/* Items */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 pb-4 border-b border-ginza-grey-light last:border-0"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 bg-ginza-cream shrink-0 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl">
                        🍣
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-ginza-black truncate">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-ginza-grey hover:text-ginza-red shrink-0"
                        aria-label="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {item.optionName && (
                      <p className="text-xs text-ginza-grey mb-1">
                        {item.optionName}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-xs text-ginza-grey italic mb-1">
                        "{item.notes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty */}
                      <div className="flex items-center border border-ginza-grey-light">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-ginza-black hover:text-ginza-gold"
                          aria-label="Decrease"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-ginza-black hover:text-ginza-gold"
                          aria-label="Increase"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <p className="font-semibold text-sm text-ginza-black">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-2 border-ginza-gold p-5 space-y-4 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-sm text-ginza-grey">Subtotal</span>
              <span className="font-serif text-2xl font-bold text-ginza-black">
                {formatPrice(sub)}
              </span>
            </div>
            <p className="text-xs text-ginza-grey">
              Delivery fee calculated at checkout
            </p>
            <div className="flex gap-3">
              <Link
                href="/cart"
                onClick={closeCart}
                className="flex-1 py-3 text-center border-2 border-ginza-black text-ginza-black hover:bg-ginza-black hover:text-white transition-all font-semibold text-sm tracking-wide"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex-1 py-3 text-center bg-ginza-black text-white border-2 border-ginza-black hover:bg-ginza-gold hover:border-ginza-gold hover:text-ginza-black transition-all font-semibold text-sm tracking-wide"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
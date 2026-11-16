// app/cart/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } =
    useCartStore();

  const sub = subtotal();
  const deliveryFee = 0; // Always free for delivery within 1.5 km
  const total = sub + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container-ginza py-20 text-center min-h-[60vh]">
        <p className="text-8xl mb-6">🍣</p>
        <h1 className="font-serif text-3xl font-bold text-ginza-black mb-3">
          Your cart is empty
        </h1>
        <p className="text-ginza-grey mb-8">
          Add some delicious sushi to get started.
        </p>
        <Link href="/menu" className="btn-primary inline-flex">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container-ginza py-10">
        {/* Header */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm text-ginza-grey hover:text-ginza-gold transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Continue shopping
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag size={28} className="text-ginza-gold" />
          <h1 className="font-serif text-3xl font-bold text-ginza-black">
            Your Cart
          </h1>
          <span className="text-ginza-grey">
            ({items.reduce((s, i) => s + i.quantity, 0)} items)
          </span>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          {/* Items list */}
          <div>
            <div className="border border-ginza-grey-light">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex gap-4 p-5 ${
                    idx !== items.length - 1
                      ? "border-b border-ginza-grey-light"
                      : ""
                  }`}
                >
                  <div className="relative w-24 h-24 bg-ginza-cream shrink-0 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl">
                        🍣
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-ginza-black">
                          {item.name}
                        </h3>
                        {item.optionName && (
                          <p className="text-sm text-ginza-grey">
                            {item.optionName}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-ginza-grey italic mt-1">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-ginza-grey hover:text-ginza-red transition-colors shrink-0"
                        aria-label="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-ginza-grey-light">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-9 h-9 flex items-center justify-center text-ginza-black hover:text-ginza-gold"
                          aria-label="Decrease"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-semibold text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-9 h-9 flex items-center justify-center text-ginza-black hover:text-ginza-gold"
                          aria-label="Increase"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-ginza-black">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-ginza-grey">
                            {formatPrice(item.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="mt-4 text-sm text-ginza-grey hover:text-ginza-red transition-colors underline"
            >
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="border-2 border-ginza-gold p-6 bg-white">
              <h2 className="font-serif text-xl font-bold text-ginza-black mb-5 pb-4 border-b border-ginza-grey-light">
                Order Summary
              </h2>

              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-ginza-grey">Subtotal</span>
                  <span className="font-medium text-ginza-black">
                    {formatPrice(sub)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ginza-grey">Delivery</span>
                 <span className="font-medium text-green-600">Free delivery within 1.5 km</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t-2 border-ginza-gold">
                <span className="font-semibold text-ginza-black">Total</span>
                <span className="font-serif text-2xl font-bold text-ginza-black">
                  {formatPrice(total)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block w-full mt-4 py-4 text-center bg-ginza-black text-white border-2 border-ginza-black hover:bg-ginza-gold hover:border-ginza-gold hover:text-ginza-black transition-all font-semibold tracking-wide"
              >
                Proceed to Checkout
              </Link>

              <p className="text-xs text-ginza-grey text-center mt-3">
                You can choose pickup or delivery at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

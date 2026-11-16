// app/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Truck,
  Store,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Gift,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { calculateDiscounts, DISCOUNTS } from "@/lib/discounts";

type DeliveryCheck =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "ok"; distanceKm: number }
  | { status: "too-far"; distanceKm: number | null; reason: string };

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, subtotal } = useCartStore();

  const [deliveryType, setDeliveryType] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const [useLoyalty, setUseLoyalty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // User points (fetched from API)
  const [userPoints, setUserPoints] = useState(0);

  // Form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [notes, setNotes] = useState("");

  // Delivery eligibility
  const [deliveryCheck, setDeliveryCheck] = useState<DeliveryCheck>({ status: "idle" });

  // Prefill from session + fetch points
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");

      fetch("/api/user/points")
        .then((r) => r.json())
        .then((d) => setUserPoints(d.points ?? 0))
        .catch(() => {});
    }
  }, [session]);

  // Debounced delivery check when address changes
  useEffect(() => {
    if (deliveryType !== "DELIVERY") {
      setDeliveryCheck({ status: "idle" });
      return;
    }

    const full = `${address}, ${postcode}`.trim();
    if (address.length < 5 || postcode.length < 3) {
      setDeliveryCheck({ status: "idle" });
      return;
    }

    setDeliveryCheck({ status: "checking" });
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/delivery-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: full }),
        });
        const data = await res.json();

        if (data.eligible) {
          setDeliveryCheck({ status: "ok", distanceKm: data.distanceKm });
        } else {
          setDeliveryCheck({
            status: "too-far",
            distanceKm: data.distanceKm,
            reason: data.reason || "Outside delivery radius",
          });
        }
      } catch {
        setDeliveryCheck({ status: "idle" });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [address, postcode, deliveryType]);

  const sub = subtotal();
  const discounts = calculateDiscounts(sub, userPoints, useLoyalty);

  const deliveryFee = 0; // Free within radius — that's the rule
  const grandTotal = discounts.totalAfterDiscount + deliveryFee;

  const canSubmit =
    deliveryType === "PICKUP" ||
    (deliveryType === "DELIVERY" && deliveryCheck.status === "ok");

  if (status === "loading") {
    return (
      <div className="container-ginza py-20 text-center">
        <Loader2 className="animate-spin mx-auto text-ginza-gold" size={32} />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login?callbackUrl=/checkout");
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container-ginza py-20 text-center">
        <p className="text-6xl mb-4">🍣</p>
        <h1 className="font-serif text-2xl font-bold mb-3">Your cart is empty</h1>
        <Link href="/menu" className="btn-primary inline-flex mt-4">
          Browse Menu
        </Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          deliveryType,
          useLoyalty,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          deliveryAddress:
            deliveryType === "DELIVERY"
              ? { address, postcode, fullAddress: `${address}, ${postcode}` }
              : null,
          specialInstructions: notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("No checkout URL returned");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container-ginza py-10">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-ginza-grey hover:text-ginza-gold mb-6"
        >
          <ArrowLeft size={16} /> Back to cart
        </Link>

        <h1 className="font-serif text-3xl font-bold text-ginza-black mb-2">
          Checkout
        </h1>
        <div className="gold-divider w-20 mb-8" />

        <form onSubmit={handleCheckout} className="grid lg:grid-cols-[1fr_420px] gap-10">
          <div className="space-y-8">
            {/* Fulfilment type */}
            <div>
              <h2 className="font-serif text-xl font-bold mb-4">How would you like it?</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryType("PICKUP")}
                  className={`p-5 border-2 text-left transition-all ${
                    deliveryType === "PICKUP"
                      ? "border-ginza-gold bg-ginza-cream"
                      : "border-ginza-grey-light hover:border-ginza-gold"
                  }`}
                >
                  <Store size={22} className="text-ginza-gold mb-2" />
                  <p className="font-semibold text-ginza-black">Pickup</p>
                  <p className="text-xs text-ginza-grey mt-1">
                    Ready in ~{SITE.avgPrepTime} min
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType("DELIVERY")}
                  className={`p-5 border-2 text-left transition-all ${
                    deliveryType === "DELIVERY"
                      ? "border-ginza-gold bg-ginza-cream"
                      : "border-ginza-grey-light hover:border-ginza-gold"
                  }`}
                >
                  <Truck size={22} className="text-ginza-gold mb-2" />
                  <p className="font-semibold text-ginza-black">Delivery</p>
                  <p className="text-xs text-ginza-grey mt-1">
                    Free within {SITE.deliveryRadius}
                  </p>
                </button>
              </div>
            </div>

            {/* Contact details */}
            <div>
              <h2 className="font-serif text-xl font-bold mb-4">Your details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-ginza-grey mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-ginza-grey-light focus:border-ginza-gold outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-ginza-grey mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07..."
                    className="w-full px-4 py-3 border-2 border-ginza-grey-light focus:border-ginza-gold outline-none text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.2em] text-ginza-grey mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-ginza-grey-light focus:border-ginza-gold outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Delivery address (with live check) */}
            {deliveryType === "DELIVERY" && (
              <div>
                <h2 className="font-serif text-xl font-bold mb-4">Delivery address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-[0.2em] text-ginza-grey mb-2">
                      Street address
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Sushi Lane, London"
                      className="w-full px-4 py-3 border-2 border-ginza-grey-light focus:border-ginza-gold outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-ginza-grey mb-2">
                      Postcode
                    </label>
                    <input
                      type="text"
                      required
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      placeholder="E1 6AN"
                      className="w-full px-4 py-3 border-2 border-ginza-grey-light focus:border-ginza-gold outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Live feedback */}
                <div className="mt-4">
                  {deliveryCheck.status === "checking" && (
                    <div className="flex items-center gap-2 text-sm text-ginza-grey">
                      <Loader2 size={14} className="animate-spin" />
                      Checking delivery availability...
                    </div>
                  )}
                  {deliveryCheck.status === "ok" && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 p-3">
                      <CheckCircle2 size={16} />
                      Great! Free delivery available ({deliveryCheck.distanceKm} km away)
                    </div>
                  )}
                  {deliveryCheck.status === "too-far" && (
                    <div className="bg-amber-50 border border-amber-200 p-3">
                      <div className="flex items-start gap-2 text-sm text-amber-800 mb-2">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        {deliveryCheck.reason}
                      </div>
                      <button
                        type="button"
                        onClick={() => setDeliveryType("PICKUP")}
                        className="text-sm font-semibold text-ginza-gold underline"
                      >
                        Switch to pickup instead
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-ginza-grey mb-2">
                Special instructions (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Allergies, preferences, delivery notes..."
                className="w-full px-4 py-3 border-2 border-ginza-grey-light focus:border-ginza-gold outline-none text-sm resize-none"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="border-2 border-ginza-gold p-6 bg-white">
              <h2 className="font-serif text-xl font-bold mb-5 pb-4 border-b border-ginza-grey-light">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="relative w-12 h-12 bg-ginza-cream shrink-0 overflow-hidden">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-lg">🍣</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-ginza-grey">× {item.quantity}</p>
                    </div>
                    <p className="font-medium shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Loyalty */}
              <div className="mb-4 p-4 bg-ginza-cream border border-ginza-gold/30">
                <div className="flex items-start gap-2">
                  <Gift size={16} className="text-ginza-gold mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ginza-black">
                      {userPoints >= DISCOUNTS.LOYALTY_POINTS_REQUIRED
                        ? "You have 10+ loyalty points!"
                        : `${userPoints}/${DISCOUNTS.LOYALTY_POINTS_REQUIRED} points`}
                    </p>
                    <p className="text-xs text-ginza-grey mt-1">
                      {userPoints >= DISCOUNTS.LOYALTY_POINTS_REQUIRED
                        ? "Use 10 points for an extra 20% off"
                        : "Earn 1 point per order"}
                    </p>
                    {userPoints >= DISCOUNTS.LOYALTY_POINTS_REQUIRED && (
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useLoyalty}
                          onChange={(e) => setUseLoyalty(e.target.checked)}
                          className="w-4 h-4 accent-ginza-gold"
                        />
                        <span className="text-sm text-ginza-black">Use 10 points</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-ginza-grey">Subtotal</span>
                  <span>{formatPrice(sub)}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Online discount (−10%)</span>
                  <span>−{formatPrice(discounts.onlineDiscount)}</span>
                </div>
                {discounts.loyaltyApplied && (
                  <div className="flex justify-between text-green-700">
                    <span>Loyalty discount (−20%)</span>
                    <span>−{formatPrice(discounts.loyaltyDiscount)}</span>
                  </div>
                )}
                {deliveryType === "DELIVERY" && (
                  <div className="flex justify-between">
                    <span className="text-ginza-grey">Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center py-4 border-t-2 border-ginza-gold mb-4">
                <span className="font-semibold">Total</span>
                <span className="font-serif text-2xl font-bold">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              {discounts.totalSaved > 0 && (
                <p className="text-center text-sm text-green-700 mb-4">
                  🎉 You save {formatPrice(discounts.totalSaved)} ({discounts.discountPercent}% off)
                </p>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-4">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="w-full flex items-center justify-center gap-2 py-4 bg-ginza-black text-white border-2 border-ginza-black hover:bg-ginza-gold hover:border-ginza-gold hover:text-ginza-black transition-all font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing...
                  </>
                ) : (
                  "Pay & Place Order"
                )}
              </button>

              <p className="text-xs text-ginza-grey text-center mt-3">
                🔒 Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
// app/account/page.tsx
import Link from "next/link";
import { requireUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { Package, Gift, User as UserIcon } from "lucide-react";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: {
      name: true,
      email: true,
      points: true,
      totalOrders: true,
    },
  });

  if (!user) return null;

  const pointsProgress = Math.min(100, (user.points / 10) * 100);
  const hasReward = user.points >= 10;

  return (
    <div className="container-ginza py-12">
      <h1 className="font-serif text-4xl font-bold text-ginza-black mb-2">
        My Account
      </h1>
      <div className="gold-divider w-20 mb-10" />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile card */}
        <div className="border-2 border-ginza-gold/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <UserIcon className="text-ginza-gold" size={22} />
            <h2 className="font-serif text-xl font-bold">Profile</h2>
          </div>
          <p className="text-sm text-ginza-grey mb-1">Name</p>
          <p className="font-medium text-ginza-black mb-3">
            {user.name || "—"}
          </p>
          <p className="text-sm text-ginza-grey mb-1">Email</p>
          <p className="font-medium text-ginza-black">{user.email}</p>
        </div>

        {/* Points card */}
        <div className="border-2 border-ginza-gold p-6 bg-ginza-cream">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="text-ginza-gold" size={22} />
            <h2 className="font-serif text-xl font-bold">Loyalty Points</h2>
          </div>
          <p className="font-serif text-4xl font-bold text-ginza-black mb-2">
            {user.points}
          </p>
          <p className="text-sm text-ginza-grey mb-4">
            {hasReward
              ? "🎉 You have 20% off your next order!"
              : `${10 - user.points} more points to unlock 20% off`}
          </p>
          <div className="h-2 bg-white overflow-hidden">
            <div
              className="h-full bg-ginza-gold transition-all"
              style={{ width: `${pointsProgress}%` }}
            />
          </div>
        </div>

        {/* Orders card */}
        <Link
          href="/account/orders"
          className="border-2 border-ginza-gold/30 p-6 hover:border-ginza-gold transition-all group md:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Package className="text-ginza-gold" size={22} />
                <h2 className="font-serif text-xl font-bold">My Orders</h2>
              </div>
              <p className="text-sm text-ginza-grey">
                {user.totalOrders} {user.totalOrders === 1 ? "order" : "orders"} placed
              </p>
            </div>
            <span className="text-ginza-gold group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
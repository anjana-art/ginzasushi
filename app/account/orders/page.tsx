// app/account/orders/page.tsx
import Link from "next/link";
import { requireUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

export const metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const session = await requireUser();

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-ginza py-12">
      <h1 className="font-serif text-4xl font-bold text-ginza-black mb-2">
        My Orders
      </h1>
      <div className="gold-divider w-20 mb-10" />

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🍣</p>
          <p className="font-serif text-xl text-ginza-black mb-2">
            No orders yet
          </p>
          <p className="text-ginza-grey mb-6">
            Start your first order and earn loyalty points
          </p>
          <Link href="/menu" className="btn-primary inline-flex">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block border border-ginza-grey-light hover:border-ginza-gold transition-all p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ginza-grey mb-1">
                    Order #{order.orderNumber.slice(-8)}
                  </p>
                  <p className="text-sm text-ginza-grey">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-ginza-cream text-ginza-black border border-ginza-gold/30">
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <p className="font-serif font-bold text-ginza-black text-lg mt-1">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-ginza-grey">
                {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "items"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
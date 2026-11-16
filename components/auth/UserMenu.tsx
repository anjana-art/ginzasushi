// components/auth/UserMenu.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { User as UserIcon, LogOut, Package, Shield, ChevronDown } from "lucide-react";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return <div className="w-9 h-9 bg-ginza-grey-light animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="hidden sm:inline-flex items-center justify-center text-sm font-medium text-ginza-black hover:text-ginza-gold transition-colors"
      >
        Sign In
      </Link>
    );
  }

  const isAdmin = (session.user as any).isAdmin;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 p-2 text-ginza-black hover:text-ginza-gold transition-colors"
        aria-label="Account menu"
      >
        <UserIcon size={20} />
        <ChevronDown size={14} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-ginza-gold z-50 shadow-xl">
            <div className="p-4 border-b border-ginza-grey-light">
              <p className="text-sm font-semibold text-ginza-black truncate">
                {session.user.name || "Account"}
              </p>
              <p className="text-xs text-ginza-grey truncate">
                {session.user.email}
              </p>
            </div>

            <div className="py-2">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-ginza-black hover:bg-ginza-cream hover:text-ginza-gold"
              >
                <UserIcon size={16} />
                My Account
              </Link>

              <Link
                href="/account/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-ginza-black hover:bg-ginza-cream hover:text-ginza-gold"
              >
                <Package size={16} />
                My Orders
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-ginza-gold hover:bg-ginza-cream font-semibold"
                >
                  <Shield size={16} />
                  Admin Dashboard
                </Link>
              )}
            </div>

            <div className="border-t border-ginza-grey-light py-2">
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-ginza-black hover:bg-ginza-cream hover:text-ginza-red text-left"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
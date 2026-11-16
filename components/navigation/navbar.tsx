// components/navigation/navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu as MenuIcon, X, Phone } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { CartBadge } from "@/components/cart/CartBadge";
import { UserMenu } from "@/components/auth/UserMenu";


export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-ginza-gold">
      <div className="container-ginza flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-2xl font-serif font-bold tracking-[0.15em] text-ginza-black">
            GINZA
          </span>
          <span className="text-[10px] tracking-[0.35em] text-ginza-gold uppercase mt-0.5">
            Sushi & Bar
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ginza-black hover:text-ginza-gold transition-colors tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${SITE.phone}`}
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-ginza-black hover:text-ginza-gold transition-colors"
          >
            <Phone size={16} />
            {SITE.phoneDisplay}
          </a>

          <CartBadge />
            <UserMenu />


          <Link
            href="/menu"
            className="hidden sm:inline-flex items-center justify-center bg-ginza-black text-white border-2 border-ginza-black hover:bg-ginza-gold hover:border-ginza-gold hover:text-ginza-black transition-all text-sm py-2 px-5 font-semibold tracking-wide"
          >
            Order Now
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-ginza-black"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-ginza-gold/30 bg-white">
          <nav className="container-ginza py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-base font-medium text-ginza-black hover:text-ginza-gold transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/menu"
              className="btn-primary justify-center mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Order Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
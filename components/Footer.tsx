// components/Footer.tsx
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ginza-black text-white mt-20">
      {/* Gold top accent line */}
      <div className="h-[2px] bg-ginza-gold" />

      <div className="container-ginza py-14 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex flex-col leading-none mb-4">
            <span className="text-3xl font-serif font-bold tracking-[0.15em] text-white">
              GINZA
            </span>
            <span className="text-[10px] tracking-[0.35em] text-ginza-gold uppercase mt-1">
              Sushi & Bar
            </span>
          </div>
          <p className="text-sm text-white/60 max-w-md leading-relaxed">
            {SITE.description}
          </p>
        </div>

        {/* Navigate */}
        <div>
          <h4 className="font-semibold mb-5 text-ginza-gold uppercase text-xs tracking-[0.2em]">
            Navigate
          </h4>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/70 hover:text-ginza-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/orders"
                className="text-white/70 hover:text-ginza-gold transition-colors"
              >
                My Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-5 text-ginza-gold uppercase text-xs tracking-[0.2em]">
            Find Us
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-ginza-gold" />
              <span>
                {SITE.address.line1}
                <br />
                {SITE.address.city} {SITE.address.postcode}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-ginza-gold" />
              <a
                href={`tel:${SITE.phone}`}
                className="hover:text-ginza-gold transition-colors"
              >
                {SITE.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-ginza-gold" />
              <a
                href={`mailto:${SITE.email}`}
                className="hover:text-ginza-gold transition-colors"
              >
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5 shrink-0 text-ginza-gold" />
              <span>
                Mon: {SITE.hours.monday}
                <br />
                Tues–Sun: {SITE.hours.friday}
                
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-ginza py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-ginza-gold">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ginza-gold">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-ginza-gold">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
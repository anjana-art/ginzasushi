// app/page.tsx
import Link from "next/link";
import { Clock, MapPin, Truck, Phone, Utensils } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { QuickAddButton } from "@/components/menu/QuickAddButton";
import Image from "next/image";

export default async function HomePage() {
  const featured = await prisma.menuItem.findMany({
    where: { isActive: true, isFeatured: true },
    take: 6,
    include: {
      category: true,
      options: {
        where: { isActive: true },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="bg-white">
      {/* ==================== HERO ==================== */}
      <section className="relative bg-white overflow-hidden border-b border-ginza-gold/30">
        <div className="container-ginza relative py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-ginza-gold uppercase text-xs tracking-[0.35em] mb-4 font-medium">
              銀座 · New Spot in Lisbon
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6 text-ginza-black">
              Fresh &amp; Quality
              <br />
              <span className="text-ginza-gold">Sushi.</span>
            </h1>
            <div className="w-20 h-[2px] bg-ginza-gold mb-6" />
            <p className="text-lg text-ginza-grey mb-8 max-w-lg leading-relaxed">
             {SITE.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={`tel:${SITE.phone}`} className="btn-primary">
                <Phone size={16} />
                Call to Order
              </a>
              <Link href="/menu" className="btn-secondary">
                View Menu
              </Link>
            </div>
          </div>
          {/* ── Feature image: now visible on all screens ── */}
          <div className="relative aspect-square w-full max-w-md mx-auto md:max-w-none">
            <div className="absolute inset-0 border-2 border-ginza-gold translate-x-4 translate-y-4" />
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src="/Menu/combinado/background_ginza.jpeg"
                alt="Fresh sushi platter"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== QUICK INFO ==================== */}
      <section className="bg-ginza-cream border-b border-ginza-gold/20">
        <div className="container-ginza py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-ginza-gold flex items-center justify-center text-ginza-gold shrink-0">
              <Utensils size={22} />
            </div>
            <div>
              <p className="font-semibold text-ginza-black">Dine In</p>
              <p className="text-ginza-grey">8–10 indoors · 8–10 outdoors</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-ginza-gold flex items-center justify-center text-ginza-gold shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <p className="font-semibold text-ginza-black">Takeaway &amp; Pickup</p>
              <p className="text-ginza-grey">Order by phone call</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-ginza-gold flex items-center justify-center text-ginza-gold shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <p className="font-semibold text-ginza-black">Online Delivery</p>
              <p className="text-ginza-grey">Uber Eats · Glovo · Bolt</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-ginza-gold flex items-center justify-center text-ginza-gold shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <p className="font-semibold text-ginza-black">Pickup Point</p>
              <p className="text-ginza-grey">Rua Luciano Cordeiro 23B, 1150-212 Lisbon</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DELIVERY NOTICE ==================== */}
      <section className="container-ginza pt-12">
        <div className="bg-ginza-cream border border-ginza-gold/40 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Clock size={24} className="text-ginza-gold shrink-0" />
            <p className="font-semibold text-ginza-black">
              Own delivery within 1.5 km — launching soon
            </p>
          </div>
          <p className="text-sm text-ginza-grey md:ml-auto">
            Not available yet. In the meantime, order through Uber Eats, Glovo, or Bolt.
          </p>
        </div>
      </section>

      {/* ==================== CATEGORIES ==================== */}
      <section className="container-ginza py-20">
        <div className="text-center mb-12">
          <h2 className="section-title">Browse by Category</h2>
          <div className="gold-divider w-24 mx-auto mt-4" />
          <p className="section-subtitle mt-4">
            From classic nigiri to chef's specials
          </p>
        </div>

        {/* ── Category pills: smaller on mobile, original on desktop ── */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.slug}`}
              className="group px-4 py-2 md:p-6 bg-white border border-ginza-grey-light hover:border-ginza-gold text-center transition-all md:flex-1 md:min-w-[140px]"
            >
              <p className="text-sm md:text-lg font-serif text-ginza-black group-hover:text-ginza-gold transition-colors whitespace-nowrap md:whitespace-normal">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================== FEATURED ITEMS ==================== */}
      {featured.length > 0 && (
        <section className="bg-ginza-cream py-20 border-y border-ginza-gold/20">
          <div className="container-ginza">
            <div className="text-center mb-12">
              <h2 className="section-title">Chef's Picks</h2>
              <div className="gold-divider w-24 mx-auto mt-4" />
              <p className="section-subtitle mt-4">
                Hand-selected favourites from our kitchen
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((item) => (
                <Link
                  key={item.id}
                  href={`/menu/${item.slug}`}
                  className="group bg-white border border-ginza-grey-light hover:border-ginza-gold transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-ginza-cream overflow-hidden">
                    {item.images[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl">
                        🍣
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-ginza-gold mb-2">
                      {item.category.name}
                    </p>
                    <h3 className="font-serif text-xl font-bold mb-2 text-ginza-black group-hover:text-ginza-gold transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-ginza-grey line-clamp-2 mb-4 leading-relaxed flex-1">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-ginza-grey-light">
                      <p className="font-serif font-bold text-ginza-black text-lg leading-none">
                        {formatPrice(item.price)}
                      </p>
                      <QuickAddButton
                        menuItemId={item.id}
                        name={item.name}
                        price={Number(item.price)}
                        image={item.images[0]}
                        hasOptions={(item.options?.length ?? 0) > 0}
                        slug={item.slug}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/menu" className="btn-primary">
                View Full Menu
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ==================== CTA ==================== */}
      <section className="container-ginza py-20">
        <div className="bg-ginza-black text-white p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-ginza-gold" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-ginza-gold" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-ginza-gold" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-ginza-gold" />

          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Hungry? <span className="text-ginza-gold">Order now.</span>
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Call to order for takeaway and pickup at Rua Luciano Cordeiro 23B,
            1150-212 Lisbon. Or find us on Uber Eats, Glovo, and Bolt.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center gap-2 justify-center bg-ginza-gold text-ginza-black border-2 border-ginza-gold hover:bg-transparent hover:text-ginza-gold transition-all py-3 px-8 font-semibold tracking-wide"
            >
              <Phone size={16} />
              {SITE.phoneDisplay}
            </a>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center border-2 border-white text-white hover:border-ginza-gold hover:text-ginza-gold transition-all py-3 px-8 font-semibold tracking-wide"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
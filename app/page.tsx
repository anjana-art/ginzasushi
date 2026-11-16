// app/page.tsx
import Link from "next/link";
import { Clock, MapPin, Truck, Phone } from "lucide-react";
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
              銀座 · Authentic Japanese
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6 text-ginza-black">
              Fresh Sushi,
              <br />
              <span className="text-ginza-gold">Made to Order.</span>
            </h1>
            <div className="w-20 h-[2px] bg-ginza-gold mb-6" />
            <p className="text-lg text-ginza-grey mb-8 max-w-lg leading-relaxed">
              Handcrafted nigiri, maki, and ramen prepared by our chefs. Ready
              for pickup or delivered to your door in {SITE.avgPrepTime} minutes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu" className="btn-primary">
                View Menu
              </Link>
              <a href={`tel:${SITE.phone}`} className="btn-secondary">
                <Phone size={16} />
                Call to Order
              </a>
            </div>
          </div>
          <div className="hidden md:block relative aspect-square">
            <div className="absolute inset-0 border-2 border-ginza-gold translate-x-4 translate-y-4" />
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800"
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
        <div className="container-ginza py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-ginza-gold flex items-center justify-center text-ginza-gold">
              <Clock size={22} />
            </div>
            <div>
              <p className="font-semibold text-ginza-black">
                Ready in {SITE.avgPrepTime} min
              </p>
              <p className="text-ginza-grey">Fast preparation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-ginza-gold flex items-center justify-center text-ginza-gold">
              <Truck size={22} />
            </div>
            <div>
              <p className="font-semibold text-ginza-black">
                     Free within {SITE.deliveryRadius}              </p>
              <p className="text-ginza-grey">Min order {formatPrice(SITE.minOrder)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-ginza-gold flex items-center justify-center text-ginza-gold">
              <MapPin size={22} />
            </div>
            <div>
              <p className="font-semibold text-ginza-black">
                {SITE.address.city} {SITE.address.postcode}
              </p>
              <p className="text-ginza-grey">Pickup available</p>
            </div>
          </div>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.slug}`}
              className="group p-6 bg-white border border-ginza-grey-light hover:border-ginza-gold text-center transition-all"
            >
              <p className="font-serif text-lg text-ginza-black group-hover:text-ginza-gold transition-colors">
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
            Ready in {SITE.avgPrepTime} minutes. Delivered fresh to your door or
            ready for pickup.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center bg-ginza-gold text-ginza-black border-2 border-ginza-gold hover:bg-transparent hover:text-ginza-gold transition-all py-3 px-8 font-semibold tracking-wide"
            >
              Order Online
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center gap-2 justify-center border-2 border-white text-white hover:border-ginza-gold hover:text-ginza-gold transition-all py-3 px-8 font-semibold tracking-wide"
            >
              <Phone size={16} />
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
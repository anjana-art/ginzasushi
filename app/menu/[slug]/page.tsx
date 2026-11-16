// app/menu/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Flame, Leaf, Fish } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/menu/AddToCartButton";
import {
  ALLERGEN_LABELS,
  SPICE_LEVEL_LABELS,
} from "@/lib/constants";

interface DishPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DishPageProps) {
  const { slug } = await params;
  const item = await prisma.menuItem.findUnique({ where: { slug } });
  if (!item) return { title: "Not found" };
  return {
    title: item.name,
    description: item.description || undefined,
  };
}

export default async function DishPage({ params }: DishPageProps) {
  const { slug } = await params;

  const item = await prisma.menuItem.findUnique({
    where: { slug },
    include: {
      category: true,
      options: {
        where: { isActive: true },
        orderBy: [{ group: "asc" }, { sortOrder: "asc" }],
      },
    },
  });

  if (!item || !item.isActive) notFound();

  // Related items from same category (excluding this one)
  const related = await prisma.menuItem.findMany({
    where: {
      categoryId: item.categoryId,
      isActive: true,
      id: { not: item.id },
    },
    take: 3,
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="container-ginza pt-8">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm text-ginza-grey hover:text-ginza-gold transition-colors"
        >
          <ArrowLeft size={16} />
          Back to menu
        </Link>
      </div>

      <div className="container-ginza py-8 grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div>
          <div className="relative aspect-square bg-ginza-cream border-2 border-ginza-gold/30 overflow-hidden">
            {item.images[0] ? (
              <Image
                src={item.images[0]}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                🍣
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-ginza-gold uppercase text-xs tracking-[0.3em] mb-2 font-medium">
            {item.category.name}
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-ginza-black mb-4">
            {item.name}
          </h1>

          <div className="w-20 h-[2px] bg-ginza-gold mb-5" />

          <p className="text-ginza-grey leading-relaxed mb-6">
            {item.description}
          </p>

          {/* Info badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            {item.isVegetarian && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-green-50 text-green-700 px-3 py-1.5 border border-green-200">
                <Leaf size={12} /> Vegetarian
              </span>
            )}
            {item.isVegan && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-green-50 text-green-800 px-3 py-1.5 border border-green-200">
                Vegan
              </span>
            )}
            {item.isGlutenFree && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 px-3 py-1.5 border border-amber-200">
                Gluten Free
              </span>
            )}
            {item.isContainsRawFish && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1.5 border border-blue-200">
                <Fish size={12} /> Raw Fish
              </span>
            )}
            {item.spiceLevel !== "NONE" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-red-50 text-ginza-red px-3 py-1.5 border border-red-200">
                <Flame size={12} /> {SPICE_LEVEL_LABELS[item.spiceLevel as keyof typeof SPICE_LEVEL_LABELS]}
              </span>
            )}
            {item.prepTime && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-gray-50 text-ginza-grey px-3 py-1.5 border border-ginza-grey-light">
                <Clock size={12} /> {item.prepTime} min
              </span>
            )}
          </div>

          {/* Allergens */}
          {item.allergens.length > 0 && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-ginza-grey mb-2">
                Contains
              </p>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((a) => (
                  <span
                    key={a}
                    className="text-xs bg-ginza-cream text-ginza-black px-2.5 py-1 border border-ginza-grey-light"
                  >
                    {ALLERGEN_LABELS[a as keyof typeof ALLERGEN_LABELS] || a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="mb-6 pb-6 border-b border-ginza-grey-light">
            <p className="font-serif text-3xl font-bold text-ginza-black">
              {formatPrice(item.price)}
            </p>
            {item.serves && (
              <p className="text-sm text-ginza-grey mt-1">
                Serves {item.serves}
              </p>
            )}
          </div>

          {/* Add to cart */}
          <AddToCartButton
            menuItemId={item.id}
            name={item.name}
            basePrice={Number(item.price)}
            image={item.images[0]}
            options={item.options.map((o) => ({
              id: o.id,
              name: o.name,
              group: o.group,
              priceAdjustment: o.priceAdjustment,
            }))}
          />
        </div>
      </div>

      {/* Related items */}
      {related.length > 0 && (
        <section className="container-ginza py-16 border-t border-ginza-gold/20">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl font-bold text-ginza-black mb-3">
              You might also like
            </h2>
            <div className="gold-divider w-20 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/menu/${r.slug}`}
                className="group bg-white border border-ginza-grey-light hover:border-ginza-gold transition-all overflow-hidden"
              >
                <div className="relative aspect-[4/3] bg-ginza-cream">
                  {r.images[0] ? (
                    <Image
                      src={r.images[0]}
                      alt={r.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl">
                      🍣
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-ginza-black group-hover:text-ginza-gold transition-colors mb-1">
                    {r.name}
                  </h3>
                  <p className="text-sm text-ginza-grey line-clamp-2 mb-3">
                    {r.description}
                  </p>
                  <p className="font-bold text-ginza-black">
                    {formatPrice(r.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
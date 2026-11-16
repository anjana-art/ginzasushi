// app/menu/page.tsx
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MenuCard } from "@/components/menu/MenuCard";
import { CategoryTabs } from "@/components/menu/CategoryTabs";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse our full menu of fresh nigiri, maki rolls, sashimi, ramen, bento boxes, and more.",
};

interface MenuPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const activeCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : null;

  const items = await prisma.menuItem.findMany({
  where: {
    isActive: true,
    ...(activeCategory ? { categoryId: activeCategory.id } : {}),
  },
  include: {
    category: true,
    options: {
      where: { isActive: true },
      select: { id: true },
    },
  },
  orderBy: [{ categoryId: "asc" }, { name: "asc" }],
});

  return (
    <div className="bg-white min-h-screen">
      {/* ============ HEADER ============ */}
      <section className="border-b border-ginza-gold/30">
        <div className="container-ginza py-14 text-center">
          <p className="text-ginza-gold uppercase text-xs tracking-[0.35em] mb-3 font-medium">
            Our Menu
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-ginza-black mb-4">
            {activeCategory ? activeCategory.name : "Everything We Make"}
          </h1>
          <div className="gold-divider w-24 mx-auto mb-4" />
          <p className="text-ginza-grey max-w-2xl mx-auto">
            {activeCategory?.description ||
              "Fresh, handcrafted Japanese dishes prepared to order."}
          </p>
        </div>
      </section>

      {/* ============ FILTERS ============ */}
      <section className="container-ginza py-10">
        <CategoryTabs categories={categories} activeSlug={categorySlug} />

        {/* ============ ITEMS GRID ============ */}
        {items.length > 0 ? (
          <>
            <p className="text-center text-sm text-ginza-grey mb-6">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🍣</p>
            <p className="font-serif text-xl text-ginza-black mb-2">
              Nothing here yet
            </p>
            <p className="text-ginza-grey">
              Try a different category or check back soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
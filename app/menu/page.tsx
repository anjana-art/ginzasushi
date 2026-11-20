// app/menu/page.tsx
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MenuCard } from "@/components/menu/MenuCard";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

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

  // Group items by category for the "All" view
  const groupedItems = items.reduce((acc, item) => {
    const catName = item.category.name;
    if (!acc[catName]) {
      acc[catName] = [];
    }
    acc[catName].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

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
        
        {/* MOBILE DROPDOWN (Visible only on small screens) */}
        <div className="md:hidden w-full mb-8">
          <details className="group border border-ginza-gold/40 bg-white shadow-sm">
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-serif font-semibold text-ginza-black bg-ginza-cream/50">
              <span>{activeCategory ? activeCategory.name : "All Categories"}</span>
              <ChevronDown className="w-5 h-5 text-ginza-gold group-open:rotate-180 transition-transform duration-300" />
            </summary>
            <div className="flex flex-col border-t border-ginza-grey-light max-h-[60vh] overflow-y-auto">
              <Link
                href="/menu"
                className={`px-4 py-3 border-b border-ginza-grey-light hover:bg-ginza-cream text-sm transition-colors ${
                  !categorySlug ? "font-bold text-ginza-gold bg-ginza-cream/30" : "text-ginza-black"
                }`}
              >
                All Categories
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/menu?category=${cat.slug}`}
                  className={`px-4 py-3 border-b border-ginza-grey-light hover:bg-ginza-cream text-sm transition-colors ${
                    categorySlug === cat.slug ? "font-bold text-ginza-gold bg-ginza-cream/30" : "text-ginza-black"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </details>
        </div>

        {/* DESKTOP CATEGORY TABS (Hidden on mobile) */}
        <div className="hidden md:block">
          <CategoryTabs categories={categories} activeSlug={categorySlug} />
        </div>

        {/* ============ ITEMS GRID ============ */}
        {items.length > 0 ? (
          <div className="mt-2 md:mt-8">
            <p className="text-center text-sm text-ginza-grey mb-6">
              {items.length} {items.length === 1 ? "item" : "items"} found
            </p>

            {!activeCategory ? (
              // Grouped View (All Categories)
              <div className="space-y-12 md:space-y-16">
                {Object.entries(groupedItems).map(([catName, catItems]) => (
                  <div key={catName}>
                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-ginza-black whitespace-nowrap">
                        {catName}
                      </h2>
                      <div className="h-[1px] w-full bg-ginza-gold/30" />
                    </div>
                    {/* 3 Columns on Mobile, Tablet, and Desktop */}
                    <div className="grid grid-cols-3 gap-2 md:gap-6">
                      {catItems.map((item) => (
                        <MenuCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Flat View (Specific Category Selected)
              <div className="grid grid-cols-3 gap-2 md:gap-6">
                {items.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
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
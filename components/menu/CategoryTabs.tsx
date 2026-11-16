// components/menu/CategoryTabs.tsx
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryTabsProps {
  categories: Category[];
  activeSlug?: string;
}

export function CategoryTabs({ categories, activeSlug }: CategoryTabsProps) {
  const allActive = !activeSlug;

  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      <Link
        href="/menu"
        className={`px-5 py-2.5 text-sm font-medium tracking-wide transition-all border-2 ${
          allActive
            ? "bg-ginza-black text-white border-ginza-black"
            : "bg-white text-ginza-black border-ginza-grey-light hover:border-ginza-gold"
        }`}
      >
        All
      </Link>
      {categories.map((cat) => {
        const active = cat.slug === activeSlug;
        return (
          <Link
            key={cat.id}
            href={`/menu?category=${cat.slug}`}
            className={`px-5 py-2.5 text-sm font-medium tracking-wide transition-all border-2 ${
              active
                ? "bg-ginza-black text-white border-ginza-black"
                : "bg-white text-ginza-black border-ginza-grey-light hover:border-ginza-gold"
            }`}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
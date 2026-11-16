// components/menu/MenuCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Leaf, Flame, Fish } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { QuickAddButton } from "./QuickAddButton";

interface MenuCardProps {
  item: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: unknown;
    images: string[];
    spiceLevel: string;
    isVegetarian: boolean;
    isVegan: boolean;
    isContainsRawFish: boolean;
    prepTime: number | null;
    category: { name: string; slug: string };
    options?: { id: string }[];
  };
}

export function MenuCard({ item }: MenuCardProps) {
  const price = Number(item.price);
  const hasOptions = (item.options?.length ?? 0) > 0;

  return (
    <Link
      href={`/menu/${item.slug}`}
      className="group bg-white border border-ginza-grey-light hover:border-ginza-gold transition-all overflow-hidden flex flex-col"
    >
      {/* Image */}
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

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.isVegetarian && (
            <span className="bg-white/95 text-green-700 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 flex items-center gap-1">
              <Leaf size={10} /> Veg
            </span>
          )}
          {item.isVegan && (
            <span className="bg-white/95 text-green-800 text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
              Vegan
            </span>
          )}
          {(item.spiceLevel === "HOT" || item.spiceLevel === "EXTRA_HOT") && (
            <span className="bg-ginza-red text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 flex items-center gap-1">
              <Flame size={10} /> Spicy
            </span>
          )}
        </div>

        {/* Raw fish indicator */}
        {item.isContainsRawFish && (
          <div className="absolute top-3 right-3 bg-ginza-black/80 text-white p-1.5 rounded-full">
            <Fish size={14} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-ginza-gold mb-1.5">
          {item.category.name}
        </p>
        <h3 className="font-serif text-lg font-bold mb-2 text-ginza-black group-hover:text-ginza-gold transition-colors leading-tight">
          {item.name}
        </h3>
        <p className="text-sm text-ginza-grey line-clamp-2 mb-4 flex-1 leading-relaxed">
          {item.description}
        </p>

        {/* Price + Add */}
        <div className="flex items-center justify-between pt-3 border-t border-ginza-grey-light">
          <div>
            <p className="font-serif font-bold text-ginza-black text-lg leading-none">
              {formatPrice(price)}
            </p>
            {item.prepTime && (
              <p className="text-[11px] text-ginza-grey mt-1">
                {item.prepTime} min
              </p>
            )}
          </div>

          <QuickAddButton
            menuItemId={item.id}
            name={item.name}
            price={price}
            image={item.images[0]}
            hasOptions={hasOptions}
            slug={item.slug}
          />
        </div>
      </div>
    </Link>
  );
}
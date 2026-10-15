import type { Category } from "@/lib/api/types";
import {
  ArrowUpRight,
  Atom,
  Box,
  Clock,
  Eye,
  Home as HomeIcon,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const DEFAULT_EXPLORE_CARDS = [
  {
    name: "Weird Stuff",
    description: "Anomalies that passed quality control under curious circumstances.",
    href: "/products?category=Weird+Stuff",
    icon: "sparkles",
  },
  {
    name: "Home",
    description: "Things that technically belong in your home.",
    href: "/products?category=Home",
    icon: "home",
  },
  {
    name: "Science",
    description: "Science-adjacent objects of varying legitimacy.",
    href: "/products?category=Science",
    icon: "atom",
  },
  {
    name: "Collectibles",
    description: "Things worth keeping for reasons we cannot explain.",
    href: "/products?category=Collectibles",
    icon: "sparkles",
  },
  {
    name: "Everyday Things",
    description: "Ordinary objects with extraordinary problems.",
    href: "/products?category=Everyday+Things",
    icon: "clock",
  },
  {
    name: "Mysterious",
    description: "You won't know what it is until you buy it.",
    href: "/products?category=Mysterious",
    icon: "eye",
  },
];

interface CategoryGridProps {
  categories?: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const cards =
    categories && categories.length > 0
      ? categories.map((c) => ({
          name: c.name,
          description: c.description || "Questionable taxonomy and items.",
          href: c.path || `/products?category=${encodeURIComponent(c.name)}`,
          icon: c.icon || "box",
        }))
      : DEFAULT_EXPLORE_CARDS;

  return (
    <section className="border-b border-neutral-200/80 bg-neutral-50/60 py-12 md:py-16">
      <div className="mx-auto max-w-[1360px] px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
              Explore the questionable catalog
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Browse by taxonomic ambiguity.
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            View all categories →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((cat) => {
            const Icon = getCategoryIcon(cat.icon);
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-200/90 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="grid size-10 place-items-center rounded-lg bg-neutral-100 text-neutral-800 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <h3 className="font-sans text-lg font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-neutral-800 group-hover:text-indigo-600">
                  <span>Browse catalog</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getCategoryIcon(type: string) {
  switch (type) {
    case "home":
      return HomeIcon;
    case "atom":
      return Atom;
    case "sparkles":
      return Sparkles;
    case "clock":
      return Clock;
    case "eye":
      return Eye;
    case "box":
      return Box;
    default:
      return Box;
  }
}

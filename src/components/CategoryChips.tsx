"use client";

import type { Category } from "@/lib/api";

interface CategoryChipsProps {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  sport: { bg: "bg-green-100", text: "text-green-700" },
  politikk: { bg: "bg-red-100", text: "text-red-700" },
  teknologi: { bg: "bg-blue-100", text: "text-blue-700" },
  kultur: { bg: "bg-purple-100", text: "text-purple-700" },
  okonomi: { bg: "bg-orange-100", text: "text-orange-700" },
  nyheter: { bg: "bg-gray-100", text: "text-gray-700" },
};

export default function CategoryChips({
  categories,
  selected,
  onSelect,
}: CategoryChipsProps) {
  const getCategoryColor = (slug: string) => {
    return CATEGORY_COLORS[slug] || { bg: "bg-gray-100", text: "text-gray-700" };
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
          selected === null
            ? "bg-[#1a1a2e] text-white"
            : "border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800"
        }`}
      >
        Alle
      </button>
      {categories.map((cat) => {
        const colors = getCategoryColor(cat.slug);
        const isActive = selected === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.slug === selected ? null : cat.slug)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              isActive
                ? `${colors.bg} ${colors.text}`
                : "border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800"
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}

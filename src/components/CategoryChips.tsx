"use client";

import type { Category } from "@/lib/api";

interface CategoryChipsProps {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export default function CategoryChips({
  categories,
  selected,
  onSelect,
}: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          selected === null
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Alle
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug === selected ? null : cat.slug)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            selected === cat.slug
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

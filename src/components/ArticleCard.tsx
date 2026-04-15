"use client";

import Link from "next/link";
import type { Article } from "@/lib/api";
import BookmarkButton from "./BookmarkButton";

interface ArticleCardProps {
  article: Article & { duplicateCount?: number };
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Sport: { bg: "bg-green-100", text: "text-green-700" },
  Politikk: { bg: "bg-red-100", text: "text-red-700" },
  Teknologi: { bg: "bg-blue-100", text: "text-blue-700" },
  Kultur: { bg: "bg-purple-100", text: "text-purple-700" },
  Økonomi: { bg: "bg-orange-100", text: "text-orange-700" },
  Nyheter: { bg: "bg-gray-100", text: "text-gray-700" },
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const categoryColor = CATEGORY_COLORS[article.category] || { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-lg">
      {/* Image Container with Overlay */}
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Link href={`/article/${article.id}`}>
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </Link>
          {/* Bookmark button overlay */}
          <div className="absolute right-2 top-2">
            <BookmarkButton articleId={article.id} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category Badge */}
        <div className="mb-2 flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
            {article.category}
          </span>
        </div>

        {/* Title */}
        <Link href={`/article/${article.id}`}>
          <h2 className="mb-2 text-base font-semibold leading-snug text-gray-900 transition group-hover:text-[#e63946] line-clamp-3">
            {article.title}
          </h2>
        </Link>

        {/* Summary */}
        <p className="mb-3 flex-1 text-sm text-gray-600 line-clamp-2">
          {article.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
          <span className="font-medium">{article.source}</span>
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString("nb-NO", {
              day: "numeric",
              month: "short",
            })}
          </time>
        </div>

        {/* Duplicate indicator */}
        {article.duplicateCount && article.duplicateCount > 1 && article.duplicateGroupId && (
          <Link href={`/synsvinkler/${article.duplicateGroupId}`}>
            <button className="mt-2 inline-block rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100">
              Se {article.duplicateCount} avisers dekning →
            </button>
          </Link>
        )}
      </div>
    </article>
  );
}

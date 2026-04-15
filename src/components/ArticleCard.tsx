"use client";

import Link from "next/link";
import type { Article } from "@/lib/api";
import BookmarkButton from "./BookmarkButton";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group overflow-hidden rounded-[12px] border border-neutral-200 bg-white transition-shadow duration-200 hover:shadow-md">
      {article.imageUrl && (
        <Link href={`/article/${article.id}`}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-48 w-full object-cover"
          />
        </Link>
      )}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
            {article.category}
          </span>
          <BookmarkButton articleId={article.id} />
        </div>
        <Link href={`/article/${article.id}`}>
          <h2 className="mb-1 text-lg font-semibold text-foreground group-hover:text-brand-600 transition-colors duration-150">
            {article.title}
          </h2>
        </Link>
        <p className="mb-3 line-clamp-2 text-sm text-neutral-500">
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-medium">{article.source}</span>
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString("nb-NO")}
          </time>
        </div>
      </div>
    </article>
  );
}

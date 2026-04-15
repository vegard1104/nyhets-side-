"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, type Article, type Category } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import CategoryChips from "@/components/CategoryChips";

const PAGE_SIZE = 12;

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Sport: { bg: "bg-green-100", text: "text-green-700" },
  Politikk: { bg: "bg-red-100", text: "text-red-700" },
  Teknologi: { bg: "bg-blue-100", text: "text-blue-700" },
  Kultur: { bg: "bg-purple-100", text: "text-purple-700" },
  Økonomi: { bg: "bg-orange-100", text: "text-orange-700" },
  Nyheter: { bg: "bg-gray-100", text: "text-gray-700" },
};

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.articles.list({
        q: query || undefined,
        category: category || undefined,
        limit: PAGE_SIZE,
        offset,
      });
      setArticles(data.articles);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [query, category, offset]);

  useEffect(() => {
    api.categories.list().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    setOffset(0);
  }, [query, category]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const otherArticles = articles.slice(1);
  const categoryColor = featuredArticle
    ? CATEGORY_COLORS[featuredArticle.category] || { bg: "bg-gray-100", text: "text-gray-700" }
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        <SearchBar value={query} onChange={setQuery} />
        <CategoryChips
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">Laster siste nytt...</div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center text-gray-500">Ingen artikler funnet</div>
      ) : (
        <>
          {/* Hero Section - Featured Article */}
          {featuredArticle && offset === 0 && (
            <div className="mb-8">
              <div className="mb-2 inline-block">
                <h2 className="relative text-xs font-bold uppercase tracking-widest text-gray-600">
                  Siste nytt
                  <span className="absolute bottom-0 left-0 h-1 w-8 bg-[#e63946]"></span>
                </h2>
              </div>
              <Link href={`/article/${featuredArticle.id}`}>
                <div className="group overflow-hidden rounded-lg bg-white shadow-lg transition hover:shadow-xl">
                  <div className="grid gap-0 sm:grid-cols-2">
                    {/* Image */}
                    {featuredArticle.imageUrl && (
                      <div className="relative h-72 overflow-hidden bg-gray-100 sm:h-full">
                        <img
                          src={featuredArticle.imageUrl}
                          alt={featuredArticle.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    {/* Content */}
                    <div className="flex flex-col justify-center p-6 sm:p-8">
                      <span className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium w-fit ${categoryColor?.bg} ${categoryColor?.text}`}>
                        {featuredArticle.category}
                      </span>
                      <h1 className="mb-4 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl transition group-hover:text-[#e63946]">
                        {featuredArticle.title}
                      </h1>
                      <p className="mb-6 text-base text-gray-600 line-clamp-3">
                        {featuredArticle.summary}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium">{featuredArticle.source}</span>
                        <time dateTime={featuredArticle.publishedAt}>
                          {new Date(featuredArticle.publishedAt).toLocaleDateString("nb-NO")}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid of Articles */}
          {otherArticles.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="relative text-sm font-bold uppercase tracking-widest text-gray-600">
                  Mer å lese
                  <span className="absolute bottom-0 left-0 h-1 w-8 bg-[#e63946]"></span>
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
                disabled={offset === 0}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
              >
                ← Forrige
              </button>
              <span className="text-sm font-medium text-gray-600">
                Side {currentPage} av {totalPages}
              </span>
              <button
                onClick={() => setOffset((o) => o + PAGE_SIZE)}
                disabled={currentPage >= totalPages}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
              >
                Neste →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

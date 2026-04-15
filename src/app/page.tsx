"use client";

import { useEffect, useState, useCallback } from "react";
import { api, type Article, type Category } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import CategoryChips from "@/components/CategoryChips";

const PAGE_SIZE = 12;

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 space-y-4">
        <SearchBar value={query} onChange={setQuery} />
        <CategoryChips
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Laster...</div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          Ingen artikler funnet
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
                disabled={offset === 0}
                className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-30"
              >
                Forrige
              </button>
              <span className="text-sm text-gray-600">
                Side {currentPage} av {totalPages}
              </span>
              <button
                onClick={() => setOffset((o) => o + PAGE_SIZE)}
                disabled={currentPage >= totalPages}
                className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-30"
              >
                Neste
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

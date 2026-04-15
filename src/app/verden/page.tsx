"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Continent =
  | "Europa"
  | "Nord-Amerika"
  | "Sør-Amerika"
  | "Afrika"
  | "Asia"
  | "Midtøsten"
  | "Oseania"
  | "Verden";

interface IntlArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl: string | null;
  continent: Continent;
  source: string;
  publishedAt: string;
}

const CONTINENTS: Continent[] = [
  "Europa",
  "Nord-Amerika",
  "Sør-Amerika",
  "Afrika",
  "Asia",
  "Midtøsten",
  "Oseania",
];

const CONTINENT_FLAGS: Record<Continent, string> = {
  Europa: "🌍",
  "Nord-Amerika": "🌎",
  "Sør-Amerika": "🌎",
  Afrika: "🌍",
  Asia: "🌏",
  Midtøsten: "🌏",
  Oseania: "🌏",
  Verden: "🌐",
};

const PAGE_SIZE = 12;

function IntlArticleCard({ article }: { article: IntlArticle }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      {article.imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-gray-100">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {CONTINENT_FLAGS[article.continent]} {article.continent}
          </span>
          <span className="text-xs text-gray-400">{article.source}</span>
        </div>
        <h3 className="mb-2 font-semibold text-gray-900 leading-snug line-clamp-3 group-hover:text-blue-700">
          {article.title}
        </h3>
        {article.summary && (
          <p className="mt-auto text-sm text-gray-500 line-clamp-2">
            {article.summary}
          </p>
        )}
        <time className="mt-2 text-xs text-gray-400">
          {new Date(article.publishedAt).toLocaleDateString("nb-NO", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
      </div>
    </a>
  );
}

export default function VerdenPage() {
  const [articles, setArticles] = useState<IntlArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [continent, setContinent] = useState<Continent | null>(null);
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (continent) sp.set("continent", continent);
      if (query) sp.set("q", query);
      sp.set("limit", String(PAGE_SIZE));
      sp.set("offset", String(offset));
      const res = await fetch(`/api/v1/international?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setArticles(data.articles);
      setTotal(data.total);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [continent, query, offset]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    setOffset(0);
  }, [continent, query]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">🌍 Ute i verden</h1>
        <p className="text-sm text-gray-500">Internasjonale nyheter fra BBC, Deutsche Welle, Al Jazeera og mer</p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Søk i internasjonale nyheter…"
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Continent chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setContinent(null)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            continent === null
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          🌐 Alle
        </button>
        {CONTINENTS.map((c) => (
          <button
            key={c}
            onClick={() => setContinent(c === continent ? null : c)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              continent === c
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {CONTINENT_FLAGS[c]} {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Laster internasjonale nyheter…</div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center text-gray-400">Ingen artikler funnet</div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <IntlArticleCard key={article.id} article={article} />
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

      <div className="mt-8 border-t pt-4">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
          ← Tilbake til norske nyheter
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Continent } from "@/lib/international-fetcher";

interface IntlArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  url: string;
  imageUrl: string | null;
  continent: Continent;
  source: string;
  publishedAt: string;
}

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

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s>][\s\S]*?<\/script>/gi, "")
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\s*on\w+\s*=\s*\S+/gi, "")
    .replace(/<iframe[\s>][\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s>][\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s>][\s\S]*?<\/embed>/gi, "");
}

export default function IntlArticleDetailPage() {
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<IntlArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullContent, setFullContent] = useState<string | null>(null);
  const [fullContentLoading, setFullContentLoading] = useState(false);
  const [fullContentStatus, setFullContentStatus] = useState<"idle" | "full" | "partial" | "failed">("idle");

  const loadFullContent = async (articleId: string) => {
    setFullContentLoading(true);
    try {
      const res = await fetch(`/api/v1/international/${articleId}/full`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data.content && data.content.length > 100) {
        setFullContent(data.content);
        setFullContentStatus(data.source);
      } else {
        setFullContentStatus("failed");
      }
    } catch {
      setFullContentStatus("failed");
    } finally {
      setFullContentLoading(false);
    }
  };

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    fetch(`/api/v1/international/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setArticle(data))
      .catch(() => setError("Kunne ikke laste artikkelen"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">Laster artikkel...</div>
    );
  }

  if (error || !article) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-gray-500">{error || "Artikkel ikke funnet"}</p>
        <Link href="/verden" className="text-blue-600 hover:underline">
          Tilbake til verden
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/verden"
        className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700"
      >
        &larr; Tilbake til verden
      </Link>

      <article>
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="mb-6 w-full rounded-lg object-cover"
          />
        )}

        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            {CONTINENT_FLAGS[article.continent]} {article.continent}
          </span>
          <span className="text-sm text-gray-400">{article.source}</span>
          <time className="text-sm text-gray-400" dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString("nb-NO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          {article.title}
        </h1>

        <p className="mb-6 text-lg text-gray-600">{article.summary}</p>

        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(fullContent || article.content),
          }}
        />

        {fullContentStatus === "idle" && !fullContent && (
          <div className="mt-6 rounded-lg border border-dashed border-gray-200 p-4 text-center">
            <p className="mb-2 text-sm text-gray-500">
              Artikkelen vises kun delvis. Prøv å laste hele teksten.
            </p>
            <button
              onClick={() => loadFullContent(article.id)}
              disabled={fullContentLoading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {fullContentLoading ? "Laster…" : "Last hele artikkelen"}
            </button>
          </div>
        )}

        {fullContentStatus === "full" && (
          <p className="mt-4 text-xs text-green-600">✓ Hele artikkelen er lastet</p>
        )}
        {fullContentStatus === "partial" && (
          <p className="mt-4 text-xs text-yellow-600">
            Delvis innhold hentet.{" "}
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="underline">
              Les originalen for full tekst
            </a>
          </p>
        )}
        {fullContentStatus === "failed" && (
          <p className="mt-4 text-xs text-gray-500">
            Kunne ikke hente hele artikkelen automatisk.{" "}
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Les originalen →
            </a>
          </p>
        )}

        {article.url && fullContentStatus === "idle" && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            Les originalen &rarr;
          </a>
        )}
      </article>
    </div>
  );
}

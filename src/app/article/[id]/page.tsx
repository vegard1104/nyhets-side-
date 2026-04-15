"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, type Article } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import BookmarkButton from "@/components/BookmarkButton";

export default function ArticleDetailPage() {
  const params = useParams<{ id: string }>();
  const { token } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;

    setLoading(true);
    api.articles
      .get(params.id)
      .then((a) => {
        setArticle(a);
        if (token) {
          api.readingHistory.record(a.id, token).catch(() => {});
        }
        return api.articles.list({ category: a.category, limit: 4 });
      })
      .then((data) => {
        setRelated(data.articles.filter((a) => a.id !== params.id));
      })
      .catch(() => setError("Kunne ikke laste artikkelen"))
      .finally(() => setLoading(false));
  }, [params.id, token]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">Laster artikkel...</div>
    );
  }

  if (error || !article) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-gray-500">{error || "Artikkel ikke funnet"}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Tilbake til forsiden
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700"
      >
        &larr; Tilbake
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
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {article.category}
          </span>
          <span className="text-sm text-gray-400">{article.source}</span>
          <time className="text-sm text-gray-400" dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString("nb-NO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <BookmarkButton articleId={article.id} />
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          {article.title}
        </h1>

        <p className="mb-6 text-lg text-gray-600">{article.summary}</p>

        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm text-blue-600 hover:underline"
          >
            Les originalen &rarr;
          </a>
        )}
      </article>

      {related.length > 0 && (
        <section className="mt-12 border-t pt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Relaterte artikler
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.id}
                href={`/article/${a.id}`}
                className="rounded-lg border p-4 transition-shadow hover:shadow-md"
              >
                <span className="mb-1 block text-xs text-gray-400">
                  {a.source}
                </span>
                <h3 className="text-sm font-medium text-gray-900">
                  {a.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Bookmark } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function BookmarksPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?redirect=/bookmarks");
      return;
    }
    api.bookmarks
      .list(token!)
      .then(setBookmarks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, token, authLoading, router]);

  const removeBookmark = async (id: string) => {
    await api.bookmarks.remove(id, token!);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  if (authLoading || loading) {
    return <div className="py-20 text-center text-gray-400">Laster...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Dine bokmerker
      </h1>

      {bookmarks.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-500">
            Du har ingen lagrede artikler ennå.
          </p>
          <Link href="/" className="text-blue-600 hover:underline">
            Utforsk artikler
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="flex items-start justify-between gap-4 rounded-lg border bg-white p-4"
            >
              <Link
                href={`/article/${bm.article?.id || bm.articleId}`}
                className="flex-1"
              >
                <h2 className="font-medium text-gray-900 hover:text-blue-600">
                  {bm.article?.title || "Artikkel"}
                </h2>
                {bm.article && (
                  <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                    {bm.article.summary}
                  </p>
                )}
                <span className="mt-1 block text-xs text-gray-400">
                  Lagret{" "}
                  {new Date(bm.createdAt).toLocaleDateString("nb-NO")}
                </span>
              </Link>
              <button
                onClick={() => removeBookmark(bm.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Fjern
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Bookmark, type ReadingHistoryEntry } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<ReadingHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?redirect=/profile");
      return;
    }
    Promise.all([
      api.bookmarks.list(token!),
      api.readingHistory.list(token!, { limit: 20 }),
    ])
      .then(([bm, rh]) => {
        setBookmarks(bm);
        setHistory(rh);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, token, authLoading, router]);

  if (authLoading || loading) {
    return <div className="py-20 text-center text-gray-400">Laster...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Min profil</h1>

      <section className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Kontoinformasjon
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="font-medium text-gray-500">E-post:</dt>
            <dd className="text-gray-900">{user?.email}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-gray-500">Medlem siden:</dt>
            <dd className="text-gray-900">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("nb-NO")
                : "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Lesestatistikk
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{history.length}</p>
            <p className="text-sm text-blue-600">Artikler lest</p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4 text-center">
            <p className="text-2xl font-bold text-purple-700">
              {bookmarks.length}
            </p>
            <p className="text-sm text-purple-600">Bokmerker</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Lesehistorikk
        </h2>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">
            Ingen artikler lest ennå.{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              Utforsk artikler
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <Link
                key={entry.id}
                href={`/article/${entry.article?.id || entry.articleId}`}
                className="block rounded border p-3 transition-colors hover:bg-gray-50"
              >
                <p className="text-sm font-medium text-gray-900">
                  {entry.article?.title || "Artikkel"}
                </p>
                <span className="text-xs text-gray-400">
                  Lest{" "}
                  {new Date(entry.readAt).toLocaleDateString("nb-NO", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

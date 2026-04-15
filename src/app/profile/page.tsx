"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Bookmark, type ReadingHistoryEntry, type UserProfile, type XPResponse } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface CategoryCount {
  category: string;
  count: number;
}

interface DayActivity {
  date: Date;
  count: number;
}

export default function ProfilePage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [xpData, setXpData] = useState<XPResponse | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<ReadingHistoryEntry[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<CategoryCount[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?redirect=/profile");
      return;
    }

    Promise.all([
      api.profile.get(token!),
      api.xp.get(token!),
      api.bookmarks.list(token!),
      api.readingHistory.list(token!, { limit: 100 }),
    ])
      .then(([prof, xp, bm, rh]) => {
        setProfile(prof);
        setXpData(xp);
        setBookmarks(bm);
        setHistory(rh);
        setDisplayName(prof.display_name || user.email?.split("@")[0] || "");

        // Calculate category distribution
        const categoryMap = new Map<string, number>();
        rh.forEach(entry => {
          if (entry.article?.category) {
            categoryMap.set(
              entry.article.category,
              (categoryMap.get(entry.article.category) || 0) + 1
            );
          }
        });

        const categories = Array.from(categoryMap.entries())
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count);

        setCategoryData(categories);
      })
      .catch(err => {
        console.error("Error loading profile:", err);
      })
      .finally(() => setLoading(false));
  }, [user, token, authLoading, router]);

  const handleSaveName = async () => {
    if (!token || !displayName.trim()) return;

    try {
      const updated = await api.profile.update(
        { display_name: displayName },
        token
      );
      setProfile(updated);
      setEditingName(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const getActivityHeatmap = () => {
    const today = new Date();
    const days: DayActivity[] = [];

    // Generate 12 weeks of days
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const count = history.filter(entry => {
        const entryDate = new Date(entry.readAt);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      }).length;

      days.push({ date, count });
    }

    return days;
  };

  const getIntensityColor = (count: number) => {
    if (count === 0) return "bg-gray-200";
    if (count === 1) return "bg-green-200";
    if (count <= 3) return "bg-green-400";
    if (count <= 5) return "bg-green-600";
    return "bg-green-800";
  };

  const nextLevelXp = xpData?.nextLevelXp || 0;
  const currentLevelXp = nextLevelXp > 0 ? xpData?.xp || 0 : 0;
  const progressPercent = nextLevelXp > 0 ? (currentLevelXp / nextLevelXp) * 100 : 100;

  const heatmapDays = getActivityHeatmap();
  const weeks: DayActivity[][] = [];
  for (let i = 0; i < heatmapDays.length; i += 7) {
    weeks.push(heatmapDays.slice(i, i + 7));
  }

  if (authLoading || loading) {
    return <div className="py-20 text-center text-gray-400">Laster...</div>;
  }

  const maxCategoryCount = categoryData.length > 0 ? Math.max(...categoryData.map(c => c.count)) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Profile Header */}
      <section className="mb-8 rounded-lg border bg-white p-6 shadow">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
              {(displayName[0] || user?.email?.[0] || "U").toUpperCase()}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="mb-4">
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="rounded border border-gray-300 px-3 py-2 text-lg font-bold"
                    placeholder="Ditt navn"
                  />
                  <button
                    onClick={handleSaveName}
                    className="rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700"
                  >
                    Lagre
                  </button>
                  <button
                    onClick={() => {
                      setEditingName(false);
                      setDisplayName(profile?.display_name || "");
                    }}
                    className="rounded bg-gray-300 px-4 py-2 text-sm hover:bg-gray-400"
                  >
                    Avbryt
                  </button>
                </div>
              ) : (
                <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                  {displayName}
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Rediger
                  </button>
                </h1>
              )}
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            {/* Level Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2">
              <span className="text-xl">⭐</span>
              <div>
                <p className="font-semibold text-gray-900">{xpData?.title}</p>
                <p className="text-xs text-gray-600">Nivå {xpData?.level}</p>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mb-2">
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-medium text-gray-700">{xpData?.xp || 0} XP</span>
                <span className="text-gray-500">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {xpData?.xpToNextLevel || 0} XP til neste nivå
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{history.length}</p>
          <p className="text-xs font-medium text-blue-600">Artikler lest</p>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">{bookmarks.length}</p>
          <p className="text-xs font-medium text-purple-600">Bokmerker</p>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center">
          <p className="text-2xl font-bold text-orange-700">{profile?.streak_days || 0}</p>
          <p className="text-xs font-medium text-orange-600">Dag streak</p>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{xpData?.level || 1}</p>
          <p className="text-xs font-medium text-green-600">Nivå</p>
        </div>
      </section>

      {/* Activity Heatmap */}
      <section className="mb-8 rounded-lg border bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Lesaktivitet
        </h2>
        <div className="overflow-x-auto">
          <div className="inline-block">
            <div className="flex gap-1">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      title={`${day.date.toLocaleDateString("nb-NO")}: ${day.count} artikler`}
                      className={`h-3 w-3 rounded-sm ${getIntensityColor(day.count)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3 text-xs">
          <span className="text-gray-600">Mindre</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-gray-200" />
            <div className="h-3 w-3 rounded-sm bg-green-200" />
            <div className="h-3 w-3 rounded-sm bg-green-400" />
            <div className="h-3 w-3 rounded-sm bg-green-600" />
            <div className="h-3 w-3 rounded-sm bg-green-800" />
          </div>
          <span className="text-gray-600">Mer</span>
        </div>
      </section>

      {/* Category Distribution */}
      {categoryData.length > 0 && (
        <section className="mb-8 rounded-lg border bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Favorittkategorier
          </h2>
          <div className="space-y-3">
            {categoryData.slice(0, 6).map((cat, idx) => {
              const colors = [
                "bg-blue-500",
                "bg-purple-500",
                "bg-pink-500",
                "bg-orange-500",
                "bg-green-500",
                "bg-cyan-500",
              ];
              return (
                <div key={cat.category}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{cat.category}</span>
                    <span className="text-gray-600">{cat.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full ${colors[idx % colors.length]}`}
                      style={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Reading History */}
      <section className="rounded-lg border bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
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
            {history.slice(0, 20).map((entry) => (
              <Link
                key={entry.id}
                href={`/article/${entry.article?.id || entry.articleId}`}
                className="block rounded border border-gray-200 p-3 transition-colors hover:bg-gray-50"
              >
                <p className="text-sm font-medium text-gray-900">
                  {entry.article?.title || "Artikkel"}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {entry.article?.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(entry.readAt).toLocaleDateString("nb-NO", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </Link>
            ))}
            {history.length > 20 && (
              <p className="mt-4 text-center text-xs text-gray-500">
                Viser 20 av {history.length} artikler
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

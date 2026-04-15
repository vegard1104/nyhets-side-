"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Bookmark, type ReadingHistoryEntry } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

// XP thresholds per level
const LEVELS = [
  { level: 1, title: "Nybegynner", xpRequired: 0, badge: "📰" },
  { level: 2, title: "Nysgjerrig", xpRequired: 100, badge: "📰" },
  { level: 3, title: "Leser", xpRequired: 300, badge: "📰" },
  { level: 4, title: "Nyhetsfan", xpRequired: 600, badge: "📖" },
  { level: 5, title: "Nyhetsjeger", xpRequired: 1000, badge: "📖" },
  { level: 6, title: "Nyhetsekspert", xpRequired: 1500, badge: "📖" },
  { level: 7, title: "Ekspert", xpRequired: 2500, badge: "🏆" },
  { level: 8, title: "Mester", xpRequired: 4000, badge: "🏆" },
  { level: 9, title: "Guru", xpRequired: 6000, badge: "🏆" },
  { level: 10, title: "Legende", xpRequired: 10000, badge: "⭐" },
];

function getLevelInfo(totalXp: number) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalXp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? null!;
    }
  }
  const xpInLevel = next ? totalXp - current.xpRequired : 0;
  const xpNeeded = next ? next.xpRequired - current.xpRequired : 1;
  const progress = next ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;
  return { current, next, xpInLevel, xpNeeded, progress };
}

// Simple heatmap: generates 84 days of data from reading history
function buildHeatmapData(history: ReadingHistoryEntry[]) {
  const counts: Record<string, number> = {};
  history.forEach((entry) => {
    const day = new Date(entry.readAt).toISOString().slice(0, 10);
    counts[day] = (counts[day] ?? 0) + 1;
  });

  const cells: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    cells.push({ date: key, count: counts[key] ?? 0 });
  }
  return cells;
}

function heatmapColor(count: number) {
  if (count === 0) return "bg-neutral-100";
  if (count <= 2) return "bg-brand-100";
  if (count <= 5) return "bg-brand-300";
  return "bg-brand-600";
}

function groupHistoryByDay(history: ReadingHistoryEntry[]) {
  const groups: Record<string, ReadingHistoryEntry[]> = {};
  history.forEach((entry) => {
    const day = new Date(entry.readAt).toISOString().slice(0, 10);
    if (!groups[day]) groups[day] = [];
    groups[day].push(entry);
  });
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 5);
}

function dayLabel(dateStr: string) {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dateStr === today) return "I dag";
  if (dateStr === yesterday) return "I går";
  return new Date(dateStr).toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export default function ProfilePage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<ReadingHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock XP data — will be replaced by real XP API from Full-Stack Engineer
  const totalXp = history.length * 10;
  const streak = Math.min(history.length, 12);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?redirect=/profile");
      return;
    }
    Promise.all([
      api.bookmarks.list(token!),
      api.readingHistory.list(token!, { limit: 100 }),
    ])
      .then(([bm, rh]) => {
        setBookmarks(bm);
        setHistory(rh);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, token, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-[12px] animate-shimmer" />
        ))}
      </div>
    );
  }

  const { current, next, xpInLevel, xpNeeded, progress } = getLevelInfo(totalXp);
  const heatmap = buildHeatmapData(history);
  const historyGroups = groupHistoryByDay(history);
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "NN";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6 animate-fade-in">

      {/* ── Hero: Avatar + XP Card ── */}
      <section className="rounded-[16px] border border-neutral-200 bg-white p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white shadow-md ring-3 ring-white"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #2563eb)" }}
          >
            {initials}
          </div>
          {/* User info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold text-foreground">{user?.email}</p>
            <p className="text-sm text-neutral-400">
              Medlem siden{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("nb-NO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>

        {/* XP Card */}
        <div
          className="mt-5 rounded-[16px] p-5 text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #2563eb)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">
                {current.badge} Nivå {current.level}
              </p>
              <p className="text-xl font-bold">{current.title}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Total XP</p>
              <p className="text-xl font-bold">{totalXp.toLocaleString("nb-NO")}</p>
            </div>
          </div>

          {next && (
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs font-medium opacity-80">
                <span>{xpInLevel} / {xpNeeded} XP til nivå {next.level}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/30">
                <div
                  className="h-2 rounded-full bg-white animate-progress"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center gap-4 text-sm font-medium">
            <span>🔥 {streak} dager streak</span>
            <span>⚡ {totalXp} total XP</span>
          </div>
        </div>
      </section>

      {/* ── Stats Grid ── */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Lesestatistikk
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: "📰", value: history.length, label: "Artikler lest", bg: "bg-brand-50", text: "text-brand-700" },
            { icon: "🔖", value: bookmarks.length, label: "Bokmerker", bg: "bg-xp-50", text: "text-xp-600" },
            { icon: "⚡", value: totalXp.toLocaleString("nb-NO"), label: "Total XP", bg: "bg-gold-50", text: "text-gold-500", customBg: "bg-[#fffbeb]" },
            { icon: "🔥", value: streak, label: "Streak dager", bg: "bg-[#fff7ed]", text: "text-[#ea580c]" },
          ].map(({ icon, value, label, bg, text, customBg }) => (
            <div
              key={label}
              className={`rounded-[12px] p-4 text-center ${customBg ?? bg}`}
            >
              <p className="text-2xl">{icon}</p>
              <p className={`text-2xl font-bold ${text}`}>{value}</p>
              <p className={`text-xs ${text} opacity-80`}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Leseheatmap ── */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Leseheatmap — siste 12 uker
        </h2>
        <div className="rounded-[12px] border border-neutral-200 bg-white p-4 overflow-x-auto">
          <div
            className="grid gap-[3px]"
            style={{
              gridTemplateColumns: `repeat(${Math.ceil(heatmap.length / 7)}, 12px)`,
              gridTemplateRows: "repeat(7, 12px)",
              gridAutoFlow: "column",
            }}
          >
            {heatmap.map(({ date, count }) => (
              <div
                key={date}
                title={`${date}: ${count} artikler`}
                className={`h-3 w-3 rounded-[2px] ${heatmapColor(count)} cursor-default`}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs text-neutral-400">
            <span>Mindre</span>
            <div className="h-3 w-3 rounded-[2px] bg-neutral-100" />
            <div className="h-3 w-3 rounded-[2px] bg-brand-100" />
            <div className="h-3 w-3 rounded-[2px] bg-brand-300" />
            <div className="h-3 w-3 rounded-[2px] bg-brand-600" />
            <span>Mer</span>
          </div>
        </div>
      </section>

      {/* ── Nivå-fremgang ── */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Nivå-fremgang
        </h2>
        <div className="rounded-[12px] border border-neutral-200 bg-white p-5">
          <div className="relative overflow-x-auto">
            <div className="flex min-w-max items-center gap-0">
              {LEVELS.map((lvl, i) => {
                const isDone = totalXp >= lvl.xpRequired;
                const isActive = lvl.level === current.level;
                return (
                  <div key={lvl.level} className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-base">{lvl.badge}</span>
                      <div
                        className={`h-4 w-4 rounded-full border-2 transition-all ${
                          isActive
                            ? "border-brand-600 bg-brand-600 ring-4 ring-brand-100"
                            : isDone
                            ? "border-brand-600 bg-brand-600"
                            : "border-neutral-300 bg-white"
                        }`}
                      />
                      <span className={`text-[10px] font-medium ${isDone ? "text-brand-600" : "text-neutral-400"}`}>
                        Nivå {lvl.level}
                      </span>
                      <span className={`text-[9px] ${isDone ? "text-neutral-500" : "text-neutral-300"}`}>
                        {lvl.title}
                      </span>
                    </div>
                    {i < LEVELS.length - 1 && (
                      <div
                        className={`mt-[-18px] h-0.5 w-8 ${
                          totalXp >= LEVELS[i + 1].xpRequired ? "bg-brand-600" : "bg-neutral-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {next && (
            <p className="mt-4 text-sm text-neutral-500">
              Neste nivå: <span className="font-semibold text-foreground">{next.title}</span> — mangler{" "}
              <span className="font-semibold text-brand-600">{next.xpRequired - totalXp} XP</span>{" "}
              (ca. {Math.ceil((next.xpRequired - totalXp) / 10)} artikler)
            </p>
          )}
        </div>
      </section>

      {/* ── Lesehistorikk ── */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Lesehistorikk
        </h2>
        <div className="rounded-[12px] border border-neutral-200 bg-white divide-y divide-neutral-100">
          {historyGroups.length === 0 ? (
            <p className="p-5 text-sm text-neutral-400">
              Ingen artikler lest ennå.{" "}
              <Link href="/" className="text-brand-600 hover:underline">
                Utforsk artikler
              </Link>
            </p>
          ) : (
            historyGroups.map(([day, entries]) => (
              <div key={day} className="p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {dayLabel(day)}
                </p>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/article/${entry.article?.id ?? entry.articleId}`}
                      className="flex items-center justify-between rounded-[8px] px-3 py-2 transition-colors hover:bg-neutral-50"
                    >
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {entry.article?.title ?? "Artikkel"}
                      </p>
                      <time className="ml-3 shrink-0 text-xs text-neutral-400">
                        {new Date(entry.readAt).toLocaleTimeString("nb-NO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

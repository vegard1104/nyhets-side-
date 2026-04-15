"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PerspectiveSource {
  name: string;
  articleId: string;
  title: string;
  summary: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  uniqueAngle: string[];
}

interface PerspectiveAnalysis {
  groupId: string;
  topic: string;
  commonFacts: string[];
  sources: PerspectiveSource[];
  articleCount: number;
}

const SOURCE_COLORS: Record<string, { bg: string; text: string; ring: string; accent: string }> = {
  "NRK": { bg: "bg-blue-50", text: "text-blue-900", ring: "ring-blue-200", accent: "bg-blue-100" },
  "VG": { bg: "bg-red-50", text: "text-red-900", ring: "ring-red-200", accent: "bg-red-100" },
  "Dagbladet": { bg: "bg-orange-50", text: "text-orange-900", ring: "ring-orange-200", accent: "bg-orange-100" },
  "Aftenposten": { bg: "bg-green-50", text: "text-green-900", ring: "ring-green-200", accent: "bg-green-100" },
  "TV 2": { bg: "bg-purple-50", text: "text-purple-900", ring: "ring-purple-200", accent: "bg-purple-100" },
  "E24": { bg: "bg-yellow-50", text: "text-yellow-900", ring: "ring-yellow-200", accent: "bg-yellow-100" },
  "Aftenbladet": { bg: "bg-pink-50", text: "text-pink-900", ring: "ring-pink-200", accent: "bg-pink-100" },
};

function getSourceInitial(sourceName: string): string {
  return sourceName.charAt(0).toUpperCase();
}

function getSourceColors(sourceName: string) {
  return SOURCE_COLORS[sourceName] || {
    bg: "bg-gray-50",
    text: "text-gray-900",
    ring: "ring-gray-200",
    accent: "bg-gray-100",
  };
}

interface PageProps {
  params: Promise<{ groupId: string }>;
}

export default function SynsvinklerPage({ params: paramsPromise }: PageProps) {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PerspectiveAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    paramsPromise.then(p => setGroupId(p.groupId));
  }, [paramsPromise]);

  useEffect(() => {
    if (!groupId) return;

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/perspectives/${groupId}`);
        if (!response.ok) {
          throw new Error("Failed to load perspective data");
        }
        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [groupId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="py-20 text-center text-gray-500">Laster sammenligning...</div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="py-20 text-center text-gray-500">
          {error || "Kunne ikke laste sammenligningen"}
        </div>
        <div className="text-center">
          <Link href="/">
            <button className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700">
              Tilbake til hjemmesiden
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="mb-4 inline-block text-sm font-medium text-blue-600 hover:underline">
          ← Tilbake
        </Link>

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl">
            {analysis.topic}
          </h1>
          <p className="mt-2 text-gray-600">
            {analysis.articleCount} nyhetskilder dekker denne saken
          </p>
        </div>

        {/* Common Facts Section */}
        {analysis.commonFacts.length > 0 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 sm:p-6">
            <h2 className="mb-3 font-semibold text-blue-900">
              <span className="inline-block mr-2">🎯</span> Fellestrekk
            </h2>
            <div className="flex flex-wrap gap-2">
              {analysis.commonFacts.map((fact, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                >
                  {fact}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Perspective Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {analysis.sources.map((source, idx) => {
          const colors = getSourceColors(source.name);
          const initial = getSourceInitial(source.name);

          return (
            <div
              key={source.articleId}
              className={`overflow-hidden rounded-lg border-2 ${colors.ring} ${colors.bg}`}
            >
              {/* Source Header */}
              <div className={`${colors.accent} px-6 py-4`}>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${colors.accent} ring-2 ${colors.ring}`}
                  >
                    <span className={`text-lg font-bold ${colors.text}`}>
                      {initial}
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${colors.text}`}>
                      {source.name}
                    </h3>
                    <time dateTime={source.publishedAt} className={`text-sm ${colors.text} opacity-75`}>
                      {new Date(source.publishedAt).toLocaleDateString("nb-NO", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
              </div>

              {/* Article Image */}
              {source.imageUrl && (
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={source.imageUrl}
                    alt={source.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  <h2 className={`mb-3 text-lg font-semibold leading-tight transition hover:text-blue-600 ${colors.text}`}>
                    {source.title}
                  </h2>
                </a>

                {/* Summary */}
                <p className="mb-4 text-sm text-gray-700 leading-relaxed">
                  {source.summary}
                </p>

                {/* Unique Angle */}
                {source.uniqueAngle.length > 0 && (
                  <div className="mb-4">
                    <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${colors.text} opacity-75`}>
                      Unikt perspektiv
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {source.uniqueAngle.map((angle, idx) => (
                        <span
                          key={idx}
                          className={`rounded px-2 py-1 text-xs font-medium ${colors.accent} ${colors.text}`}
                        >
                          {angle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Read Button */}
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  <button className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition hover:opacity-90 ${colors.accent} ${colors.text}`}>
                    Les hele artikkelen →
                  </button>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Summary */}
      <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          <span className="inline-block mr-2">📊</span> Sammenligning
        </h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            {analysis.sources.length} nyhetskilder dekker denne saken med {analysis.commonFacts.length} fellesnevnere.
          </p>
          <p>
            Hver kilde fokuserer på ulike aspekter av historien. Sammenlign de ulike perspektivene ovenfor for å få et helhetsbilde.
          </p>
        </div>
      </div>

      {/* CTA Back to Home */}
      <div className="mt-8 text-center">
        <Link href="/">
          <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
            Se flere artikler
          </button>
        </Link>
      </div>
    </div>
  );
}

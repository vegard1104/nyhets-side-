"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface BookmarkButtonProps {
  articleId: string;
}

export default function BookmarkButton({ articleId }: BookmarkButtonProps) {
  const { token } = useAuth();
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.bookmarks.list(token).then((bookmarks) => {
      const match = bookmarks.find((b) => b.articleId === articleId);
      if (match) setBookmarkId(match.id);
    });
  }, [token, articleId]);

  if (!token) return null;

  const toggle = async () => {
    setLoading(true);
    try {
      if (bookmarkId) {
        await api.bookmarks.remove(bookmarkId, token);
        setBookmarkId(null);
      } else {
        const bm = await api.bookmarks.add(articleId, token);
        setBookmarkId(bm.id);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="text-gray-400 transition-colors hover:text-blue-600 disabled:opacity-50"
      aria-label={bookmarkId ? "Fjern bokmerke" : "Legg til bokmerke"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={bookmarkId ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className={`h-5 w-5 ${bookmarkId ? "text-blue-600" : ""}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
    </button>
  );
}

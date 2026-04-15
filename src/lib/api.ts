const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

async function fetchAPI<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...init } = options || {};
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  url: string;
  imageUrl: string | null;
  category: string;
  source: string;
  publishedAt: string;
  createdAt: string;
}

export interface ArticlesResponse {
  articles: Article[];
  total: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Source {
  id: string;
  name: string;
  url: string;
}

export interface Bookmark {
  id: string;
  articleId: string;
  article?: Article;
  createdAt: string;
}

export interface ReadingHistoryEntry {
  id: string;
  articleId: string;
  article?: Article;
  readAt: string;
}

export const api = {
  articles: {
    list(params?: {
      category?: string;
      source?: string;
      q?: string;
      limit?: number;
      offset?: number;
    }) {
      const sp = new URLSearchParams();
      if (params?.category) sp.set("category", params.category);
      if (params?.source) sp.set("source", params.source);
      if (params?.q) sp.set("q", params.q);
      if (params?.limit) sp.set("limit", String(params.limit));
      if (params?.offset) sp.set("offset", String(params.offset));
      const qs = sp.toString();
      return fetchAPI<ArticlesResponse>(`/articles${qs ? `?${qs}` : ""}`);
    },
    get(id: string) {
      return fetchAPI<Article>(`/articles/${id}`);
    },
  },
  categories: {
    list() {
      return fetchAPI<Category[]>("/categories");
    },
  },
  sources: {
    list() {
      return fetchAPI<Source[]>("/sources");
    },
  },
  bookmarks: {
    list(token: string) {
      return fetchAPI<Bookmark[]>("/bookmarks", { token });
    },
    add(articleId: string, token: string) {
      return fetchAPI<Bookmark>("/bookmarks", {
        method: "POST",
        body: JSON.stringify({ articleId }),
        token,
      });
    },
    remove(id: string, token: string) {
      return fetchAPI<void>(`/bookmarks/${id}`, { method: "DELETE", token });
    },
  },
  readingHistory: {
    list(token: string, params?: { limit?: number; offset?: number }) {
      const sp = new URLSearchParams();
      if (params?.limit) sp.set("limit", String(params.limit));
      if (params?.offset) sp.set("offset", String(params.offset));
      const qs = sp.toString();
      return fetchAPI<ReadingHistoryEntry[]>(
        `/reading-history${qs ? `?${qs}` : ""}`,
        { token }
      );
    },
    record(articleId: string, token: string) {
      return fetchAPI<ReadingHistoryEntry>("/reading-history", {
        method: "POST",
        body: JSON.stringify({ articleId }),
        token,
      });
    },
  },
};

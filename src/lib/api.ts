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
  duplicateGroupId?: string;
  duplicateCount?: number;
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

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  xp: number;
  level: number;
  streak_days: number;
  created_at: string;
  updated_at: string;
}

export interface XPResponse {
  xp: number;
  xpEarned?: number;
  level: number;
  title: string;
  nextLevelXp?: number;
  xpToNextLevel?: number;
  streakDays?: number;
  leveledUp?: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  quizType: "daily" | "weekly";
  questions?: Question[];
  question?: Question;
  questionCount: number;
  publishedAt: string;
  expiresAt: string | null;
  completed: boolean;
  score?: number;
  xpEarned?: number;
  userAnswers?: number[];
}

export interface QuizSubmitResponse {
  score: number;
  xpEarned: number;
  correctCount: number;
  totalQuestions: number;
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
  profile: {
    get(token: string) {
      return fetchAPI<UserProfile>("/profile", { token });
    },
    update(
      data: {
        display_name?: string;
        avatar_url?: string;
        bio?: string;
      },
      token: string
    ) {
      return fetchAPI<UserProfile>("/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
        token,
      });
    },
  },
  xp: {
    get(token: string) {
      return fetchAPI<XPResponse>("/xp", { token });
    },
    award(
      action: string,
      metadata?: Record<string, unknown>,
      token?: string
    ) {
      return fetchAPI<XPResponse>("/xp", {
        method: "POST",
        body: JSON.stringify({ action, metadata }),
        token,
      });
    },
  },
  quiz: {
    list(token: string) {
      return fetchAPI<Quiz[]>("/quiz", { token });
    },
    getDaily(token: string) {
      return fetchAPI<Quiz>("/quiz/daily", { token });
    },
    get(id: string, token: string) {
      return fetchAPI<Quiz>(`/quiz/${id}`, { token });
    },
    submit(id: string, answers: number[], token: string) {
      return fetchAPI<QuizSubmitResponse>(`/quiz/${id}`, {
        method: "POST",
        body: JSON.stringify({ answers }),
        token,
      });
    },
  },
};

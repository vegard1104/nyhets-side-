import {
  fetchAllArticles,
  getCachedArticles,
  type FetchedArticle,
} from "@/lib/rss-fetcher";

export type Article = FetchedArticle;

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

export const categories: Category[] = [
  { id: "cat-1", name: "Nyheter", slug: "nyheter" },
  { id: "cat-2", name: "Sport", slug: "sport" },
  { id: "cat-3", name: "Teknologi", slug: "teknologi" },
  { id: "cat-4", name: "Økonomi", slug: "okonomi" },
  { id: "cat-5", name: "Kultur", slug: "kultur" },
  { id: "cat-6", name: "Politikk", slug: "politikk" },
];

export const sources: Source[] = [
  { id: "src-1", name: "NRK", url: "https://www.nrk.no" },
  { id: "src-2", name: "VG", url: "https://www.vg.no" },
  { id: "src-3", name: "Dagbladet", url: "https://www.dagbladet.no" },
];

export async function getArticles(): Promise<Article[]> {
  const cached = getCachedArticles();
  if (cached) return cached;

  try {
    return await fetchAllArticles();
  } catch (err) {
    console.error("Failed to fetch articles from RSS:", err);
    return [];
  }
}

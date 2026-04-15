import type { FetchedArticle } from "./rss-fetcher";

const NORWEGIAN_STOP_WORDS = new Set([
  "og", "i", "for", "til", "av", "med", "er", "på", "det", "en", "et",
  "som", "den", "var", "har", "fra", "de", "at", "være", "han", "hun",
  "ikke", "eller", "da", "hvis", "så", "han", "hun", "me", "vi", "om",
  "da", "fordi", "mens", "der", "her", "som", "hvis", "hvem", "hva",
  "hvor", "når", "hvordan", "uten", "over", "under", "inn", "ut", "opp",
  "ned", "før", "etter", "over", "før", "siden", "via", "mot", "omkring",
  "ned", "opp", "rundt", "inn", "ut", "gjennom", "omkring", "mellom",
  "blandt", "både", "eller", "men", "samme", "nye", "gamle", "hver",
  "annen", "neste", "denne", "alle", "ingen", "noen", "mange", "få"
]);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractWords(text: string): Set<string> {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/).filter(word => {
    return word.length > 2 && !NORWEGIAN_STOP_WORDS.has(word);
  });
  return new Set(words);
}

function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

export interface PerspectiveSource {
  name: string;
  articleId: string;
  title: string;
  summary: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  uniqueAngle: string[];
}

export interface PerspectiveAnalysis {
  groupId: string;
  topic: string;
  commonFacts: string[];
  sources: PerspectiveSource[];
}

export function analyzePerspectives(articles: FetchedArticle[]): PerspectiveAnalysis {
  if (articles.length === 0) {
    throw new Error("No articles provided");
  }

  // Extract words from all articles
  const articleWords = articles.map(article => ({
    article,
    words: extractWords(article.title + " " + article.summary),
  }));

  // Find common words (in all articles)
  let commonWords = articleWords[0].words;
  for (let i = 1; i < articleWords.length; i++) {
    commonWords = new Set([...commonWords].filter(x => articleWords[i].words.has(x)));
  }

  // Generate topic from common words + primary article title
  const commonWordsArray = Array.from(commonWords).sort();
  const topicWords = [...commonWordsArray].slice(0, 3);
  const topic = topicWords.length > 0
    ? topicWords.join(" ")
    : articles[0].title.split(" ").slice(0, 5).join(" ");

  // Analyze unique angles
  const sources = articles.map(article => {
    const articleWordSet = extractWords(article.title + " " + article.summary);
    const uniqueWords = [...articleWordSet]
      .filter(w => !commonWords.has(w))
      .sort();

    return {
      name: article.source,
      articleId: article.id,
      title: article.title,
      summary: article.summary,
      url: article.url,
      imageUrl: article.imageUrl,
      publishedAt: article.publishedAt,
      uniqueAngle: uniqueWords.slice(0, 5),
    };
  });

  return {
    groupId: generateGroupId(articles),
    topic,
    commonFacts: Array.from(commonWords).slice(0, 8),
    sources,
  };
}

export function generateGroupId(articles: FetchedArticle[]): string {
  const ids = articles.map(a => a.id).sort().join("|");
  // Simple hash function for generating a consistent ID
  let hash = 0;
  for (let i = 0; i < ids.length; i++) {
    const char = ids.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export function groupSimilarArticles(
  articles: FetchedArticle[],
  similarityThreshold = 0.4
): Map<string, FetchedArticle[]> {
  const groups = new Map<string, FetchedArticle[]>();
  const processed = new Set<string>();

  for (const article of articles) {
    if (processed.has(article.id)) continue;

    const group: FetchedArticle[] = [article];
    processed.add(article.id);
    const articleWords = extractWords(article.title + " " + article.summary);

    // Find all similar articles
    for (const otherArticle of articles) {
      if (processed.has(otherArticle.id) || otherArticle.id === article.id) continue;

      const otherWords = extractWords(otherArticle.title + " " + otherArticle.summary);
      const similarity = jaccardSimilarity(articleWords, otherWords);

      if (similarity > similarityThreshold) {
        group.push(otherArticle);
        processed.add(otherArticle.id);
      }
    }

    // Only keep groups with 2+ articles
    if (group.length > 1) {
      // Sort by source priority and publication date
      const SOURCE_PRIORITY: Record<string, number> = {
        "NRK": 0,
        "VG": 1,
        "Dagbladet": 2,
        "Aftenposten": 3,
        "TV 2": 4,
        "E24": 5,
        "Aftenbladet": 6,
      };

      group.sort((a, b) => {
        const aPriority = SOURCE_PRIORITY[a.source] ?? 999;
        const bPriority = SOURCE_PRIORITY[b.source] ?? 999;
        if (aPriority !== bPriority) return aPriority - bPriority;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });

      const groupId = generateGroupId(group);
      groups.set(groupId, group);
    }
  }

  return groups;
}

// Store duplicate groups in memory with expiration
let cachedDuplicateGroups: Map<string, FetchedArticle[]> | null = null;
let duplicateCacheTimestamp = 0;
const DUPLICATE_CACHE_TTL_MS = 15 * 60 * 1000;

export function setCachedDuplicateGroups(groups: Map<string, FetchedArticle[]>): void {
  cachedDuplicateGroups = groups;
  duplicateCacheTimestamp = Date.now();
}

export function getCachedDuplicateGroups(): Map<string, FetchedArticle[]> | null {
  if (cachedDuplicateGroups && Date.now() - duplicateCacheTimestamp < DUPLICATE_CACHE_TTL_MS) {
    return cachedDuplicateGroups;
  }
  return null;
}

import Parser from "rss-parser";
import crypto from "crypto";

interface FeedConfig {
  name: string;
  url: string;
  sourceUrl: string;
  defaultCategory: string;
}

export interface FetchedArticle {
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

const FEEDS: FeedConfig[] = [
  {
    name: "NRK",
    url: "https://www.nrk.no/toppsaker.rss",
    sourceUrl: "https://www.nrk.no",
    defaultCategory: "Nyheter",
  },
  {
    name: "NRK Sport",
    url: "https://www.nrk.no/sport/toppsaker.rss",
    sourceUrl: "https://www.nrk.no",
    defaultCategory: "Sport",
  },
  {
    name: "VG",
    url: "https://www.vg.no/rss/feed/",
    sourceUrl: "https://www.vg.no",
    defaultCategory: "Nyheter",
  },
  {
    name: "Dagbladet",
    url: "https://www.dagbladet.no/nyheter/rss",
    sourceUrl: "https://www.dagbladet.no",
    defaultCategory: "Nyheter",
  },
  {
    name: "Dagbladet Sport",
    url: "https://www.dagbladet.no/sport/rss",
    sourceUrl: "https://www.dagbladet.no",
    defaultCategory: "Sport",
  },
  {
    name: "NRK Kultur",
    url: "https://www.nrk.no/kultur/toppsaker.rss",
    sourceUrl: "https://www.nrk.no",
    defaultCategory: "Kultur",
  },
  {
    name: "NRK Teknologi",
    url: "https://www.nrk.no/teknologi/toppsaker.rss",
    sourceUrl: "https://www.nrk.no",
    defaultCategory: "Teknologi",
  },
];

const CATEGORY_MAP: Record<string, string> = {
  sport: "Sport",
  fotball: "Sport",
  kultur: "Kultur",
  teknologi: "Teknologi",
  økonomi: "Økonomi",
  okonomi: "Økonomi",
  politikk: "Politikk",
  nyheter: "Nyheter",
  innenriks: "Politikk",
  utenriks: "Nyheter",
  underholdning: "Kultur",
  vitenskap: "Teknologi",
};

function classifyCategory(
  item: Parser.Item,
  feedDefault: string
): string {
  const cats = item.categories || [];
  for (const cat of cats) {
    const catStr = typeof cat === "string" ? cat : String(cat);
    const mapped = CATEGORY_MAP[catStr.toLowerCase()];
    if (mapped) return mapped;
  }

  const link = item.link || "";
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (link.toLowerCase().includes(`/${key}/`)) return val;
  }

  return feedDefault;
}

function extractImageFromItem(item: Parser.Item & Record<string, unknown>): string | null {
  const media = item["media:content"] as { $?: { url?: string } } | undefined;
  if (media?.$?.url) return media.$.url;

  const mediaGroup = item["media:group"] as {
    "media:content"?: { $?: { url?: string } }[];
  } | undefined;
  if (mediaGroup?.["media:content"]?.[0]?.$?.url) {
    return mediaGroup["media:content"][0].$.url;
  }

  const thumbnail = item["media:thumbnail"] as { $?: { url?: string } } | undefined;
  if (thumbnail?.$?.url) return thumbnail.$.url;

  const enclosure = item.enclosure;
  if (enclosure?.url && enclosure.type?.startsWith("image/")) {
    return enclosure.url;
  }

  const content = item["content:encoded"] || item.content || "";
  if (typeof content === "string") {
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) return imgMatch[1];
  }

  return null;
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; NyhetsappenBot/1.0)",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const html = await res.text();
    const ogMatch = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );
    if (ogMatch?.[1]) return ogMatch[1];

    const ogMatch2 = html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
    );
    if (ogMatch2?.[1]) return ogMatch2[1];

    return null;
  } catch {
    return null;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function makeArticleId(url: string): string {
  return crypto.createHash("md5").update(url).digest("hex").slice(0, 12);
}

let cachedArticles: FetchedArticle[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 15 * 60 * 1000;

export async function fetchAllArticles(
  forceRefresh = false
): Promise<FetchedArticle[]> {
  if (!forceRefresh && cachedArticles && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedArticles;
  }

  const parser = new Parser({
    customFields: {
      item: [
        ["media:content", "media:content"],
        ["media:thumbnail", "media:thumbnail"],
        ["media:group", "media:group"],
        ["content:encoded", "content:encoded"],
      ],
    },
    timeout: 10000,
  });

  const allArticles: FetchedArticle[] = [];
  const fetchPromises = FEEDS.map(async (feedConfig) => {
    try {
      const feed = await parser.parseURL(feedConfig.url);
      const articles: FetchedArticle[] = [];

      for (const item of feed.items.slice(0, 20)) {
        if (!item.title || !item.link) continue;

        let imageUrl = extractImageFromItem(item as unknown as Parser.Item & Record<string, unknown>);

        if (!imageUrl && item.link) {
          imageUrl = await fetchOgImage(item.link);
        }

        const anyItem = item as unknown as Record<string, unknown>;
        const rawContent = (anyItem["content:encoded"] as string) || item.content || item.contentSnippet || "";
        const summary =
          item.contentSnippet ||
          stripHtml(typeof rawContent === "string" ? rawContent : "").slice(0, 300);

        const sourceName = feedConfig.name.replace(/ (Sport|Kultur|Teknologi)$/, "");

        articles.push({
          id: makeArticleId(item.link),
          title: item.title,
          summary: summary.slice(0, 300) + (summary.length > 300 ? "..." : ""),
          content:
            typeof rawContent === "string" && rawContent.includes("<")
              ? rawContent
              : `<p>${summary}</p>`,
          url: item.link,
          imageUrl,
          category: classifyCategory(item as Parser.Item, feedConfig.defaultCategory),
          source: sourceName,
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
      }

      return articles;
    } catch (err) {
      console.error(`Failed to fetch feed ${feedConfig.name}:`, err);
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);
  for (const articles of results) {
    allArticles.push(...articles);
  }

  allArticles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const seen = new Set<string>();
  const deduped = allArticles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  cachedArticles = deduped;
  cacheTimestamp = Date.now();

  return deduped;
}

export function getCachedArticles(): FetchedArticle[] | null {
  if (cachedArticles && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedArticles;
  }
  return null;
}

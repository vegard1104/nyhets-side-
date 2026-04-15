import Parser from "rss-parser";
import crypto from "crypto";

export type Continent =
  | "Europa"
  | "Nord-Amerika"
  | "Sør-Amerika"
  | "Afrika"
  | "Asia"
  | "Midtøsten"
  | "Oseania"
  | "Verden";

export const CONTINENTS: Continent[] = [
  "Europa",
  "Nord-Amerika",
  "Sør-Amerika",
  "Afrika",
  "Asia",
  "Midtøsten",
  "Oseania",
];

interface IntlFeedConfig {
  name: string;
  url: string;
  sourceUrl: string;
  defaultContinent: Continent;
  language: string;
}

export interface InternationalArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  url: string;
  imageUrl: string | null;
  continent: Continent;
  source: string;
  publishedAt: string;
  createdAt: string;
}

const INTL_FEEDS: IntlFeedConfig[] = [
  // BBC regional feeds — already continent-tagged
  {
    name: "BBC Europa",
    url: "http://feeds.bbci.co.uk/news/world/europe/rss.xml",
    sourceUrl: "https://www.bbc.com",
    defaultContinent: "Europa",
    language: "en",
  },
  {
    name: "BBC Nord-Amerika",
    url: "http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
    sourceUrl: "https://www.bbc.com",
    defaultContinent: "Nord-Amerika",
    language: "en",
  },
  {
    name: "BBC Asia",
    url: "http://feeds.bbci.co.uk/news/world/asia/rss.xml",
    sourceUrl: "https://www.bbc.com",
    defaultContinent: "Asia",
    language: "en",
  },
  {
    name: "BBC Afrika",
    url: "http://feeds.bbci.co.uk/news/world/africa/rss.xml",
    sourceUrl: "https://www.bbc.com",
    defaultContinent: "Afrika",
    language: "en",
  },
  {
    name: "BBC Latin-Amerika",
    url: "http://feeds.bbci.co.uk/news/world/latin_america/rss.xml",
    sourceUrl: "https://www.bbc.com",
    defaultContinent: "Sør-Amerika",
    language: "en",
  },
  {
    name: "BBC Midtøsten",
    url: "http://feeds.bbci.co.uk/news/world/middle_east/rss.xml",
    sourceUrl: "https://www.bbc.com",
    defaultContinent: "Midtøsten",
    language: "en",
  },
  // Deutsche Welle — world coverage
  {
    name: "Deutsche Welle",
    url: "https://rss.dw.com/rdf/rss-en-all",
    sourceUrl: "https://www.dw.com",
    defaultContinent: "Verden",
    language: "en",
  },
  // Al Jazeera — Middle East focus but world coverage
  {
    name: "Al Jazeera",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    sourceUrl: "https://www.aljazeera.com",
    defaultContinent: "Midtøsten",
    language: "en",
  },
  // France 24 — world coverage
  {
    name: "France 24",
    url: "https://www.france24.com/en/rss",
    sourceUrl: "https://www.france24.com",
    defaultContinent: "Europa",
    language: "en",
  },
  // Euronews — European focus
  {
    name: "Euronews",
    url: "https://www.euronews.com/rss",
    sourceUrl: "https://www.euronews.com",
    defaultContinent: "Europa",
    language: "en",
  },
  // CNN — world coverage
  {
    name: "CNN",
    url: "http://rss.cnn.com/rss/edition.rss",
    sourceUrl: "https://www.cnn.com",
    defaultContinent: "Verden",
    language: "en",
  },
  // Reuters — world coverage
  {
    name: "Reuters",
    url: "https://feeds.reuters.com/reuters/topNews",
    sourceUrl: "https://www.reuters.com",
    defaultContinent: "Verden",
    language: "en",
  },
];

// Keywords mapped to continents for auto-classification of general feeds
const CONTINENT_KEYWORDS: Record<Continent, string[]> = {
  Europa: [
    "europe", "european", "germany", "german", "france", "french", "spain", "spanish",
    "italy", "italian", "poland", "ukraine", "ukrain", "eu ", "brexit", "nato",
    "sweden", "norway", "denmark", "finland", "netherlands", "belgium", "austria",
    "switzerland", "portugal", "greece", "czech", "hungary", "romania", "bulgaria",
    "serbia", "croatia", "slovakia", "slovenia", "estonia", "latvia", "lithuania",
    "luxembourg", "ireland", "iceland", "scotland", "england", "britain", "british",
  ],
  "Nord-Amerika": [
    "united states", "u.s.", "us ", "usa", "american", "america", "washington",
    "white house", "congress", "senate", "trump", "biden", "harris", "canada",
    "canadian", "mexico", "mexican", "ottawa", "toronto", "california", "new york",
    "texas", "florida",
  ],
  "Sør-Amerika": [
    "brazil", "brazilian", "argentina", "argentine", "colombia", "venezuela",
    "peru", "chile", "ecuador", "bolivia", "paraguay", "uruguay", "guyana",
    "suriname", "amazon", "latin america", "south america",
  ],
  Afrika: [
    "africa", "african", "nigeria", "nigerian", "ethiopia", "south africa",
    "kenya", "ghana", "tanzania", "egypt", "egyptian", "morocco", "algeria",
    "sudan", "somalia", "zimbabwe", "mozambique", "angola", "ivory coast",
    "senegal", "mali", "niger", "chad", "cameroon", "uganda", "rwanda",
    "sahara", "sahel",
  ],
  Asia: [
    "china", "chinese", "beijing", "india", "indian", "japan", "japanese",
    "south korea", "north korea", "korean", "taiwan", "hong kong", "vietnam",
    "thailand", "indonesia", "malaysia", "philippines", "singapore", "myanmar",
    "bangladesh", "pakistan", "sri lanka", "nepal", "mongolia", "kazakhstan",
    "uzbekistan", "cambodia", "laos", "brunei", "east asia", "southeast asia",
    "south asia",
  ],
  Midtøsten: [
    "middle east", "israel", "israeli", "palestine", "palestinian", "gaza",
    "west bank", "iran", "iranian", "iraq", "iraqi", "syria", "syrian",
    "saudi arabia", "saudi", "yemen", "yemeni", "jordan", "lebanon", "lebanese",
    "turkey", "turkish", "qatar", "kuwait", "uae", "emirates", "bahrain", "oman",
    "hezbollah", "hamas", "jihad", "beirut", "damascus", "tehran",
  ],
  Oseania: [
    "australia", "australian", "new zealand", "pacific", "fiji", "papua",
    "samoa", "tonga", "vanuatu", "solomon", "micronesia", "melanesia",
    "polynesia", "canberra", "sydney", "melbourne", "wellington", "auckland",
  ],
  Verden: [],
};

function classifyContinent(
  text: string,
  feedDefault: Continent
): Continent {
  if (feedDefault !== "Verden") return feedDefault;

  const lower = text.toLowerCase();
  for (const [continent, keywords] of Object.entries(CONTINENT_KEYWORDS)) {
    if (continent === "Verden") continue;
    if (keywords.some((kw) => lower.includes(kw))) {
      return continent as Continent;
    }
  }
  return "Verden";
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
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NyhetsappenBot/1.0)" },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const html = await res.text();
    const m1 = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (m1?.[1]) return m1[1];
    const m2 = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (m2?.[1]) return m2[1];
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

let cachedIntlArticles: InternationalArticle[] | null = null;
let intlCacheTimestamp = 0;
const CACHE_TTL_MS = 15 * 60 * 1000;

export async function fetchAllInternationalArticles(
  forceRefresh = false
): Promise<InternationalArticle[]> {
  if (
    !forceRefresh &&
    cachedIntlArticles &&
    Date.now() - intlCacheTimestamp < CACHE_TTL_MS
  ) {
    return cachedIntlArticles;
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

  const allArticles: InternationalArticle[] = [];

  const fetchPromises = INTL_FEEDS.map(async (feedConfig) => {
    try {
      const feed = await parser.parseURL(feedConfig.url);
      const articles: InternationalArticle[] = [];

      for (const item of feed.items.slice(0, 15)) {
        if (!item.title || !item.link) continue;

        let imageUrl = extractImageFromItem(item as unknown as Parser.Item & Record<string, unknown>);
        if (!imageUrl && item.link) {
          imageUrl = await fetchOgImage(item.link);
        }

        const anyItem = item as unknown as Record<string, unknown>;
        const rawContent =
          (anyItem["content:encoded"] as string) ||
          item.content ||
          item.contentSnippet ||
          "";
        const summary =
          item.contentSnippet ||
          stripHtml(typeof rawContent === "string" ? rawContent : "").slice(0, 300);

        // Classify continent from title + description text
        const classifyText = `${item.title} ${summary}`;
        const continent = classifyContinent(classifyText, feedConfig.defaultContinent);

        // Strip trailing source name like " BBC Sport" or " BBC Europa" → "BBC"
        const sourceName = feedConfig.name.replace(
          / (Europa|Nord-Amerika|Sør-Amerika|Afrika|Asia|Midtøsten|Oseania|Latin-Amerika)$/,
          ""
        );

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
          continent,
          source: sourceName,
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
      }

      return articles;
    } catch (err) {
      console.error(`Failed to fetch intl feed ${feedConfig.name}:`, err);
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);
  for (const articles of results) allArticles.push(...articles);

  allArticles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const seen = new Set<string>();
  const deduped = allArticles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  cachedIntlArticles = deduped;
  intlCacheTimestamp = Date.now();
  return deduped;
}

export function getCachedInternationalArticles(): InternationalArticle[] | null {
  if (cachedIntlArticles && Date.now() - intlCacheTimestamp < CACHE_TTL_MS) {
    return cachedIntlArticles;
  }
  return null;
}

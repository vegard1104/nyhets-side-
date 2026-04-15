import type { NextRequest } from "next/server";
import {
  fetchAllInternationalArticles,
  getCachedInternationalArticles,
  CONTINENTS,
  type Continent,
} from "@/lib/international-fetcher";

async function getIntlArticles() {
  const cached = getCachedInternationalArticles();
  if (cached) return cached;
  try {
    return await fetchAllInternationalArticles();
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const continent = searchParams.get("continent") as Continent | null;
  const q = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const articles = await getIntlArticles();
  let filtered = [...articles];

  if (continent && CONTINENTS.includes(continent)) {
    filtered = filtered.filter(
      (a) => a.continent === continent
    );
  }

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query) ||
        a.source.toLowerCase().includes(query) ||
        a.continent.toLowerCase().includes(query)
    );
  }

  const total = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return Response.json({ articles: paged, total, continents: CONTINENTS });
}

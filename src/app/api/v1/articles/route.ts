import type { NextRequest } from "next/server";
import { getArticles } from "../_data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const source = searchParams.get("source");
  const q = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const includeAllDuplicates = searchParams.get("includeAllDuplicates") === "true";

  const articles = await getArticles();
  let filtered = [...articles];

  // By default, only show primary articles from each duplicate group
  if (!includeAllDuplicates) {
    const seen = new Set<string>();
    filtered = filtered.filter((a) => {
      const groupId = a.duplicateGroupId;
      if (!groupId) {
        seen.add(a.id);
        return true;
      }
      if (seen.has(groupId)) return false;
      seen.add(groupId);
      return true;
    });
  }

  if (category) {
    filtered = filtered.filter(
      (a) => a.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (source) {
    filtered = filtered.filter(
      (a) => a.source.toLowerCase() === source.toLowerCase()
    );
  }

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query) ||
        a.source.toLowerCase().includes(query)
    );
  }

  const total = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return Response.json({ articles: paged, total });
}

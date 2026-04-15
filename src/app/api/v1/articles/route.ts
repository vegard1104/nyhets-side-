import type { NextRequest } from "next/server";
import { articles } from "../_data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const source = searchParams.get("source");
  const q = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  let filtered = [...articles];

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
        a.summary.toLowerCase().includes(query)
    );
  }

  const total = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return Response.json({ articles: paged, total });
}

import type { NextRequest } from "next/server";
import { getArticles } from "../../_data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return Response.json({ error: "Article not found" }, { status: 404 });
  }

  return Response.json(article);
}

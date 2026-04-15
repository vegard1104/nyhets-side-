import type { NextRequest } from "next/server";
import { getArticles } from "../../../_data";
import { extractFullArticle } from "@/lib/article-extractor";

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

  const extracted = await extractFullArticle(article.url);

  return Response.json({
    articleId: id,
    content: extracted.content,
    source: extracted.source,
    extractedAt: extracted.extractedAt,
  });
}

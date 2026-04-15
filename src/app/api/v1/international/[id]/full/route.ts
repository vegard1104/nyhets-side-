import type { NextRequest } from "next/server";
import {
  fetchAllInternationalArticles,
  getCachedInternationalArticles,
} from "@/lib/international-fetcher";
import { extractFullArticle } from "@/lib/article-extractor";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let articles = getCachedInternationalArticles();
  if (!articles) {
    articles = await fetchAllInternationalArticles();
  }

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

import { fetchAllArticles } from "@/lib/rss-fetcher";

export async function POST() {
  try {
    const articles = await fetchAllArticles(true);
    return Response.json({
      success: true,
      articlesCount: articles.length,
      withImages: articles.filter((a) => a.imageUrl).length,
      sources: [...new Set(articles.map((a) => a.source))],
      categories: [...new Set(articles.map((a) => a.category))],
    });
  } catch (err) {
    return Response.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

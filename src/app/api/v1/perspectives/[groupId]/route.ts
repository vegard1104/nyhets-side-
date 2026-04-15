import type { NextRequest } from "next/server";
import { getDuplicateGroups } from "../../_data";
import { analyzePerspectives } from "@/lib/perspective-analyzer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;

  const duplicateGroups = getDuplicateGroups();
  if (!duplicateGroups) {
    return Response.json(
      { error: "No duplicate groups available" },
      { status: 404 }
    );
  }

  const articles = duplicateGroups.get(groupId);
  if (!articles || articles.length === 0) {
    return Response.json(
      { error: "Group not found" },
      { status: 404 }
    );
  }

  try {
    const analysis = analyzePerspectives(articles);
    return Response.json({
      groupId,
      topic: analysis.topic,
      commonFacts: analysis.commonFacts,
      sources: analysis.sources.map(source => ({
        name: source.name,
        articleId: source.articleId,
        title: source.title,
        summary: source.summary,
        url: source.url,
        imageUrl: source.imageUrl,
        publishedAt: source.publishedAt,
        uniqueAngle: source.uniqueAngle,
      })),
      articleCount: articles.length,
    });
  } catch (err) {
    console.error("Failed to analyze perspectives:", err);
    return Response.json(
      { error: "Failed to analyze perspectives" },
      { status: 500 }
    );
  }
}

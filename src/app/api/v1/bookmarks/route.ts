import type { NextRequest } from "next/server";
import type { Bookmark } from "../_data";

export async function GET(_request: NextRequest) {
  const bookmarks: Bookmark[] = [];
  return Response.json(bookmarks);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const bookmark: Bookmark = {
    id: `bm-${Date.now()}`,
    articleId: body.articleId,
    createdAt: new Date().toISOString(),
  };
  return Response.json(bookmark, { status: 201 });
}

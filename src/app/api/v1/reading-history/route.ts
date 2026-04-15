import type { NextRequest } from "next/server";
import type { ReadingHistoryEntry } from "../_data";

export async function GET(_request: NextRequest) {
  const history: ReadingHistoryEntry[] = [];
  return Response.json(history);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const entry: ReadingHistoryEntry = {
    id: `rh-${Date.now()}`,
    articleId: body.articleId,
    readAt: new Date().toISOString(),
  };
  return Response.json(entry, { status: 201 });
}

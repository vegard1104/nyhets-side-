import type { NextRequest } from "next/server";
import { getAuthenticatedClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedClient(request);
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  const { data, error } = await auth.client
    .from("reading_history")
    .select("id, article_id, read_at")
    .order("read_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(
    data.map((h) => ({
      id: h.id,
      articleId: h.article_id,
      readAt: h.read_at,
    }))
  );
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedClient(request);
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await auth.client
    .from("reading_history")
    .insert({ user_id: auth.user.id, article_id: body.articleId })
    .select("id, article_id, read_at")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(
    { id: data.id, articleId: data.article_id, readAt: data.read_at },
    { status: 201 }
  );
}

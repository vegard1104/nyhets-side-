import type { NextRequest } from "next/server";
import { getAuthenticatedClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedClient(request);
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await auth.client
    .from("bookmarks")
    .select("id, article_id, created_at")
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(
    data.map((b) => ({
      id: b.id,
      articleId: b.article_id,
      createdAt: b.created_at,
    }))
  );
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedClient(request);
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await auth.client
    .from("bookmarks")
    .insert({ user_id: auth.user.id, article_id: body.articleId })
    .select("id, article_id, created_at")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(
    { id: data.id, articleId: data.article_id, createdAt: data.created_at },
    { status: 201 }
  );
}

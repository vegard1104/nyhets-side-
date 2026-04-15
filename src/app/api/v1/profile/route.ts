import type { NextRequest } from "next/server";
import { getAuthenticatedClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedClient(request);
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Try to get existing profile
  const { data: profile, error: getError } = await auth.client
    .from("user_profiles")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  if (getError?.code === "PGRST116") {
    // Profile doesn't exist, create it
    const { data: newProfile, error: insertError } = await auth.client
      .from("user_profiles")
      .insert({ id: auth.user.id })
      .select()
      .single();

    if (insertError) {
      return Response.json({ error: insertError.message }, { status: 500 });
    }
    return Response.json(newProfile);
  }

  if (getError) {
    return Response.json({ error: getError.message }, { status: 500 });
  }

  return Response.json(profile);
}

export async function PATCH(request: NextRequest) {
  const auth = await getAuthenticatedClient(request);
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { display_name, avatar_url, bio } = body;

  const { data: profile, error: updateError } = await auth.client
    .from("user_profiles")
    .update({
      ...(display_name !== undefined && { display_name }),
      ...(avatar_url !== undefined && { avatar_url }),
      ...(bio !== undefined && { bio }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", auth.user.id)
    .select()
    .single();

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  return Response.json(profile);
}

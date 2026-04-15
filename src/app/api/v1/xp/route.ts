import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const XP_VALUES: Record<string, number> = {
  read_article: 5,
  complete_quiz: 50,
  daily_question: 20,
  streak_7: 100,
  streak_30: 500,
  speed_improvement: 25,
  bookmark: 2,
  category_explorer: 15,
  complete_profile: 30,
};

const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: "Nybegynner" },
  { level: 2, xp: 500, title: "Leser" },
  { level: 3, xp: 1500, title: "Nyhetssniffer" },
  { level: 4, xp: 3500, title: "Analytiker" },
  { level: 5, xp: 7000, title: "Redaktør" },
  { level: 6, xp: 13000, title: "Innsiktsfull" },
  { level: 7, xp: 22000, title: "Kunnskapsmeister" },
];

function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}

function calculateLevel(xp: number) {
  let level = 1;
  let title = "Nybegynner";

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      level = LEVEL_THRESHOLDS[i].level;
      title = LEVEL_THRESHOLDS[i].title;
      break;
    }
  }

  return { level, title };
}

function getNextLevelXp(level: number) {
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === level + 1);
  return nextThreshold?.xp || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].xp;
}

export async function GET(request: NextRequest) {
  const token = getAuthUser(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("xp, level, streak_days")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const xp = profile?.xp || 0;
    const { level, title } = calculateLevel(xp);
    const nextLevelXp = getNextLevelXp(level);
    const xpToNextLevel = Math.max(0, nextLevelXp - xp);

    return NextResponse.json({
      xp,
      level,
      title,
      nextLevelXp,
      xpToNextLevel,
      streakDays: profile?.streak_days || 0,
    });
  } catch (error) {
    console.error("Error in GET /api/v1/xp:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = getAuthUser(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, metadata } = body;

    if (!action || !XP_VALUES[action]) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const xpEarned = XP_VALUES[action];

    // Log the XP action
    await supabase
      .from("xp_log")
      .insert({
        user_id: user.id,
        action,
        xp_earned: xpEarned,
        metadata: metadata || null,
      });

    // Update user profile
    const { data: profile, error: getError } = await supabase
      .from("user_profiles")
      .select("xp, level")
      .eq("id", user.id)
      .single();

    if (getError) {
      return NextResponse.json({ error: getError.message }, { status: 500 });
    }

    const newXp = (profile?.xp || 0) + xpEarned;
    const { level: oldLevel } = calculateLevel(profile?.xp || 0);
    const { level: newLevel, title } = calculateLevel(newXp);

    const { data: updatedProfile, error: updateError } = await supabase
      .from("user_profiles")
      .update({ xp: newXp, level: newLevel })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const nextLevelXp = getNextLevelXp(newLevel);

    return NextResponse.json({
      xp: newXp,
      xpEarned,
      level: newLevel,
      title,
      leveledUp: oldLevel < newLevel,
      nextLevelXp,
      xpToNextLevel: Math.max(0, nextLevelXp - newXp),
    });
  } catch (error) {
    console.error("Error in POST /api/v1/xp:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

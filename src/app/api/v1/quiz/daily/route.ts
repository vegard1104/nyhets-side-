import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
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

    // Get today's daily question (most recent daily quiz published today)
    const today = new Date().toISOString().split("T")[0];
    const tomorrowStart = new Date();
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const tomorrowIso = tomorrowStart.toISOString().split("T")[0];

    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("*")
      .eq("quiz_type", "daily")
      .gte("published_at", `${today}T00:00:00Z`)
      .lt("published_at", `${tomorrowIso}T00:00:00Z`)
      .order("published_at", { ascending: false })
      .limit(1)
      .single();

    if (quizError?.code === "PGRST116") {
      return NextResponse.json(
        { error: "No daily question available today" },
        { status: 404 }
      );
    }

    if (quizError) {
      return NextResponse.json({ error: quizError.message }, { status: 500 });
    }

    // Check if user already answered today
    const { data: attempt } = await supabase
      .from("quiz_attempts")
      .select("*")
      .eq("user_id", user.id)
      .eq("quiz_id", quiz.id)
      .single();

    const questions = Array.isArray(quiz.questions) ? quiz.questions : [];

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      quizType: "daily",
      question: questions[0], // Return only the first question for daily
      questionCount: 1,
      publishedAt: quiz.published_at,
      expiresAt: quiz.expires_at,
      completed: !!attempt,
      score: attempt?.score,
      xpEarned: attempt?.xp_earned,
      userAnswers: attempt?.answers,
    });
  } catch (error) {
    console.error("Error in GET /api/v1/quiz/daily:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

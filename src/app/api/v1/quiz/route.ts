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

    // Get available quizzes
    const { data: quizzes, error: quizzesError } = await supabase
      .from("quizzes")
      .select("id, title, quiz_type, questions, published_at, expires_at")
      .order("published_at", { ascending: false });

    if (quizzesError) {
      return NextResponse.json({ error: quizzesError.message }, { status: 500 });
    }

    // Get user's completed quizzes
    const { data: attempts } = await supabase
      .from("quiz_attempts")
      .select("quiz_id, score, xp_earned")
      .eq("user_id", user.id);

    const completedQuizzes = new Map(attempts?.map(a => [a.quiz_id, a]) || []);

    const enrichedQuizzes = quizzes.map(quiz => {
      const attempt = completedQuizzes.get(quiz.id);
      const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;

      return {
        id: quiz.id,
        title: quiz.title,
        quizType: quiz.quiz_type,
        questionCount,
        publishedAt: quiz.published_at,
        expiresAt: quiz.expires_at,
        completed: !!attempt,
        score: attempt?.score,
        xpEarned: attempt?.xp_earned,
      };
    });

    return NextResponse.json(enrichedQuizzes);
  } catch (error) {
    console.error("Error in GET /api/v1/quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

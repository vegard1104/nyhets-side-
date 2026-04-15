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

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .single();

    if (quizError) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const { data: attempt } = await supabase
      .from("quiz_attempts")
      .select("*")
      .eq("user_id", user.id)
      .eq("quiz_id", id)
      .single();

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      quizType: quiz.quiz_type,
      questions: quiz.questions,
      publishedAt: quiz.published_at,
      expiresAt: quiz.expires_at,
      completed: !!attempt,
      score: attempt?.score,
      xpEarned: attempt?.xp_earned,
      userAnswers: attempt?.answers,
    });
  } catch (error) {
    console.error("Error in GET /api/v1/quiz/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = getAuthUser(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { answers } = body;

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Answers must be an array" },
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

    // Get quiz
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .single();

    if (quizError) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Check if already completed
    const { data: existingAttempt } = await supabase
      .from("quiz_attempts")
      .select("id")
      .eq("user_id", user.id)
      .eq("quiz_id", id)
      .single();

    if (existingAttempt) {
      return NextResponse.json(
        { error: "Quiz already completed" },
        { status: 400 }
      );
    }

    // Calculate score
    const questions: Question[] = quiz.questions;
    let correctCount = 0;

    for (let i = 0; i < Math.min(answers.length, questions.length); i++) {
      if (answers[i] === questions[i].correctAnswer) {
        correctCount++;
      }
    }

    const score = Math.round((correctCount / questions.length) * 100);
    const xpEarned = correctCount * 50;

    // Record attempt
    const { data: attempt, error: insertError } = await supabase
      .from("quiz_attempts")
      .insert({
        user_id: user.id,
        quiz_id: id,
        answers,
        score,
        xp_earned: xpEarned,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Update user XP
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("xp")
      .eq("id", user.id)
      .single();

    const newXp = (profile?.xp || 0) + xpEarned;
    await supabase
      .from("user_profiles")
      .update({ xp: newXp })
      .eq("id", user.id);

    // Log XP action
    await supabase
      .from("xp_log")
      .insert({
        user_id: user.id,
        action: "complete_quiz",
        xp_earned: xpEarned,
        metadata: { quiz_id: id, score, correct_count: correctCount },
      });

    return NextResponse.json({
      score,
      xpEarned,
      correctCount,
      totalQuestions: questions.length,
      attempt,
    });
  } catch (error) {
    console.error("Error in POST /api/v1/quiz/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

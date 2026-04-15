"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Quiz } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface DailyQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface DailyQuiz extends Quiz {
  question?: DailyQuestion;
}

export default function QuizPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [daily, setDaily] = useState<DailyQuiz | null>(null);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyAnswered, setDailyAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answerResult, setAnswerResult] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?redirect=/quiz");
      return;
    }

    Promise.all([api.quiz.getDaily(token!), api.quiz.list(token!)])
      .then(([dailyData, quizzes]) => {
        setDaily(dailyData as DailyQuiz);
        setDailyAnswered(dailyData.completed || false);
        setAllQuizzes(quizzes);
      })
      .catch(err => {
        console.error("Error loading quizzes:", err);
      })
      .finally(() => setLoading(false));
  }, [user, token, authLoading, router]);

  const handleAnswerDaily = async () => {
    if (selectedAnswer === null || !daily || !token) return;

    try {
      const result = await api.quiz.submit(daily.id, [selectedAnswer], token);

      const isCorrect = selectedAnswer === daily.question?.correctAnswer;
      setAnswerResult({
        correct: isCorrect,
        message: isCorrect ? "Riktig svar!" : "Feil svar",
      });
      setShowExplanation(true);
      setDailyAnswered(true);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const weeklyQuizzes = allQuizzes.filter(q => q.quizType === "weekly");
  const maxQuizzes = Math.max(...allQuizzes.map(q => q.questionCount || 1), 1);

  if (authLoading || loading) {
    return <div className="py-20 text-center text-gray-400">Laster...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Quiz og spørsmål</h1>

      {/* Daily Question Section */}
      {daily && (
        <section className="mb-12 rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8 shadow-lg">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
            <span className="text-lg">📅</span>
            <span className="font-semibold text-gray-800">Dagens spørsmål</span>
          </div>

          {daily.question ? (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                {daily.question.question}
              </h2>

              {!dailyAnswered ? (
                <div>
                  <div className="mb-6 space-y-3">
                    {daily.question.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedAnswer(idx)}
                        className={`w-full rounded-lg border-2 p-4 text-left font-medium transition-all ${
                          selectedAnswer === idx
                            ? "border-blue-600 bg-blue-100 text-blue-900"
                            : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
                        }`}
                      >
                        <span className="mr-3 inline-block h-6 w-6 rounded-full border-2 border-current text-center text-sm leading-5">
                          {selectedAnswer === idx ? "✓" : ""}
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleAnswerDaily}
                    disabled={selectedAnswer === null}
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Svar
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    className={`rounded-lg p-4 ${
                      answerResult?.correct
                        ? "bg-green-100 text-green-900"
                        : "bg-red-100 text-red-900"
                    }`}
                  >
                    <p className="font-bold">
                      {answerResult?.correct ? "✓ Riktig!" : "✗ Feil svar"}
                    </p>
                  </div>

                  {showExplanation && daily.question.explanation && (
                    <div className="rounded-lg bg-white p-4 border-l-4 border-blue-500">
                      <p className="font-semibold text-gray-900 mb-2">Forklaring</p>
                      <p className="text-gray-700">{daily.question.explanation}</p>
                    </div>
                  )}

                  <div className="rounded-lg bg-white p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">+20 XP</p>
                    <p className="text-sm text-gray-600">Tjent fra dagens spørsmål</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">Ingen dagens spørsmål tilgjengelig</p>
          )}
        </section>
      )}

      {/* Weekly Quizzes Section */}
      {weeklyQuizzes.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Ukentlige quizer</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {weeklyQuizzes.map(quiz => (
              <Link
                key={quiz.id}
                href={`/quiz/${quiz.id}`}
                className="group rounded-lg border border-gray-200 bg-white p-6 shadow transition-all hover:shadow-lg hover:border-gray-300"
              >
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1">
                  <span className="text-sm font-medium text-purple-700">
                    {quiz.questionCount} spørsmål
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-purple-600">
                  {quiz.title}
                </h3>

                <div className="mb-4 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                    style={{ width: `${(quiz.questionCount / maxQuizzes) * 100}%` }}
                  />
                </div>

                {quiz.completed ? (
                  <div className="rounded-lg bg-green-50 p-3 text-center">
                    <p className="text-sm font-semibold text-green-700">
                      ✓ Fullført
                    </p>
                    <p className="text-xs text-green-600">
                      Poengsum: {quiz.score}%
                    </p>
                    <p className="text-xs text-green-600">
                      XP: +{quiz.xpEarned}
                    </p>
                  </div>
                ) : (
                  <button className="w-full rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700">
                    Start quiz
                  </button>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {weeklyQuizzes.length === 0 && allQuizzes.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="mb-4 text-lg font-semibold text-gray-900">
            Ingen quizer tilgjengelig
          </p>
          <p className="text-gray-600">
            Kom tilbake senere for nye spørsmål og quizer!
          </p>
        </div>
      )}
    </div>
  );
}

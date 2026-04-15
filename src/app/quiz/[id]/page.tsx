"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api, type Quiz, type Question } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function QuizDetailPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    xpEarned: number;
    correctCount: number;
    totalQuestions: number;
  } | null>(null);
  const [feedbackAnswer, setFeedbackAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace(`/login?redirect=/quiz/${quizId}`);
      return;
    }

    api.quiz
      .get(quizId, token!)
      .then(quizData => {
        if (quizData.completed) {
          setSubmitted(true);
        }
        setQuiz(quizData);
      })
      .catch(err => {
        console.error("Error loading quiz:", err);
        router.push("/quiz");
      })
      .finally(() => setLoading(false));
  }, [user, token, authLoading, router, quizId]);

  const handleSelectAnswer = (answerIdx: number) => {
    setSelectedAnswer(answerIdx);
  };

  const handleAnswerQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIdx] = selectedAnswer!;
    setAnswers(newAnswers);

    const questions = quiz?.questions || [];
    const currentQuestion = questions[currentQuestionIdx] as Question;

    // Show feedback
    setFeedbackAnswer(selectedAnswer);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    const questions = quiz?.questions || [];
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(answers[currentQuestionIdx + 1] ?? null);
      setShowFeedback(false);
    }
  };

  const handleFinishQuiz = async () => {
    if (!quiz || !token || answers.length !== (quiz.questions?.length || 0)) {
      return;
    }

    try {
      const quizResult = await api.quiz.submit(quizId, answers, token);
      setResult(quizResult);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (authLoading || loading) {
    return <div className="py-20 text-center text-gray-400">Laster...</div>;
  }

  if (!quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-gray-600">Quiz ikke funnet</p>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIdx] as Question;
  const progress = ((currentQuestionIdx + 1) / questions.length) * 100;
  const allAnswered = answers.length === questions.length;

  if (submitted && result) {
    const percentage = Math.round((result.correctCount / result.totalQuestions) * 100);
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;

    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow text-center">
          <div className="mb-6">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <span className="text-4xl">🎉</span>
            </div>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Quiz fullført!
          </h1>

          <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-6">
            <p className="mb-4 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {percentage}%
            </p>
            <p className="mb-4 text-lg font-semibold text-gray-900">
              {isExcellent
                ? "Utmerket resultat!"
                : isGood
                ? "Bra jobbet!"
                : "Fortsett å øve!"}
            </p>
            <p className="text-gray-700">
              Du fikk {result.correctCount} av {result.totalQuestions} spørsmål riktig
            </p>
          </div>

          <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-6">
            <p className="mb-2 text-sm font-medium text-green-700">XP TJENT</p>
            <p className="text-4xl font-bold text-green-600">+{result.xpEarned}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push("/quiz")}
              className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              Tilbake til quizer
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="rounded-lg border border-purple-600 px-6 py-3 font-semibold text-purple-600 transition hover:bg-purple-50"
            >
              Gå til profil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-gray-900">
            Spørsmål {currentQuestionIdx + 1} av {questions.length}
          </span>
          <span className="text-gray-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8 shadow">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">
          {currentQuestion?.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion?.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === currentQuestion.correctAnswer;
            const showResult = showFeedback;

            let bgColor = "bg-white border-gray-300";
            if (isSelected && showResult) {
              bgColor = isCorrect ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500";
            } else if (isSelected) {
              bgColor = "bg-blue-100 border-blue-500";
            } else if (showResult && isCorrect) {
              bgColor = "bg-green-50 border-green-300";
            }

            return (
              <button
                key={idx}
                onClick={() => !showFeedback && handleSelectAnswer(idx)}
                disabled={showFeedback}
                className={`w-full rounded-lg border-2 p-4 text-left font-medium transition-all ${bgColor} ${
                  !showFeedback && "cursor-pointer hover:border-gray-400"
                }`}
              >
                <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-current text-center text-sm leading-5 flex-shrink-0">
                  {showResult && isCorrect && "✓"}
                  {showResult && isSelected && !isCorrect && "✗"}
                  {!showResult && isSelected && "●"}
                </span>
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>

        {showFeedback && currentQuestion?.explanation && (
          <div className="mt-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
            <p className="mb-2 font-semibold text-blue-900">Forklaring</p>
            <p className="text-blue-800">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!showFeedback ? (
          <button
            onClick={handleAnswerQuestion}
            disabled={selectedAnswer === null}
            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Svar
          </button>
        ) : (
          <>
            {currentQuestionIdx < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="flex-1 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                Neste spørsmål
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                disabled={!allAnswered}
                className="flex-1 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Fullfør quiz
              </button>
            )}
          </>
        )}
      </div>

      {/* Question Indicators */}
      <div className="mt-8 flex flex-wrap gap-2">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (answers[idx] !== undefined) {
                setCurrentQuestionIdx(idx);
                setSelectedAnswer(answers[idx]);
                setShowFeedback(true);
              }
            }}
            className={`h-8 w-8 rounded-full font-semibold transition-all ${
              answers[idx] !== undefined
                ? "bg-green-100 text-green-700 border border-green-300"
                : idx === currentQuestionIdx
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

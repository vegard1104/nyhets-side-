"use client";

import { useState } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctId: string;
  explanation: string;
  sourceTitle?: string;
  sourceUrl?: string;
}

// ── Mock data (replaced by real API from Full-Stack Engineer) ──────────────

const DAILY_QUESTION: QuizQuestion = {
  id: "dq-2026-04-15",
  text: "Hvilken norsk by ble kåret til Europas kulturhovedstad for 2026?",
  options: [
    { id: "a", text: "Bergen" },
    { id: "b", text: "Tromsø" },
    { id: "c", text: "Bodø" },
    { id: "d", text: "Stavanger" },
  ],
  correctId: "c",
  explanation:
    "Bodø er Norges første by som er kåret til europeisk kulturhovedstad. Byens kulturprogram Bodø2024 ble utsatt til 2026 og tiltrekker seg besøkende fra hele Europa.",
  sourceTitle: "Bodø2024 — Den europeiske kulturhovedstaden",
  sourceUrl: "/",
};

const WEEKLY_QUIZ: QuizQuestion[] = [
  {
    id: "wq-1",
    text: "Hva vedtok Stortinget i budsjettforhandlingene denne uken?",
    options: [
      { id: "a", text: "Ny skattereform" },
      { id: "b", text: "Økt forsvarsbudsjett" },
      { id: "c", text: "Redusert moms på mat" },
      { id: "d", text: "Ny barnehagepolitikk" },
    ],
    correctId: "b",
    explanation:
      "Stortinget vedtok å øke forsvarsbudsjettet med 20% som svar på den sikkerhetspolitiske situasjonen i Europa.",
    sourceTitle: "Forsvarsbudsjettet vedtatt — NRK",
  },
  {
    id: "wq-2",
    text: "Hvilken norsk artist vant årets Spellemannspris?",
    options: [
      { id: "a", text: "Sigrid" },
      { id: "b", text: "Aurora" },
      { id: "c", text: "Marcus & Martinus" },
      { id: "d", text: "Astrid S" },
    ],
    correctId: "a",
    explanation:
      "Sigrid tok hjem årets Spellemannspris for sitt album og internasjonale gjennombrudd.",
    sourceTitle: "Årets Spellemannspris — VG",
  },
  {
    id: "wq-3",
    text: "Hvor mange grader steg den globale gjennomsnittstemperaturen ifølge ukens klimarapport?",
    options: [
      { id: "a", text: "1,2 grader" },
      { id: "b", text: "1,5 grader" },
      { id: "c", text: "1,8 grader" },
      { id: "d", text: "2,1 grader" },
    ],
    correctId: "b",
    explanation:
      "Ny klimarapport fra WMO viser at den globale gjennomsnittstemperaturen nå er 1,5 grader over førindustrielt nivå.",
    sourceTitle: "Klimarapporten 2026 — Aftenposten",
  },
];

// ── XP helpers ────────────────────────────────────────────────────────────

const XP_DAILY_CORRECT = 15;
const XP_DAILY_WRONG = 5;
const XP_QUIZ_CORRECT = 10;

// ── Subcomponents ─────────────────────────────────────────────────────────

interface OptionButtonProps {
  option: QuizOption;
  selected: string | null;
  correct: string;
  onSelect: (id: string) => void;
}

function OptionButton({ option, selected, correct, onSelect }: OptionButtonProps) {
  const answered = selected !== null;
  const isSelected = selected === option.id;
  const isCorrect = option.id === correct;

  let className =
    "w-full rounded-[10px] border-2 px-4 py-3 text-left text-sm font-medium transition-all duration-150 ";

  if (!answered) {
    className += "border-neutral-200 bg-white text-foreground hover:border-brand-300 hover:bg-brand-50 cursor-pointer";
  } else if (isCorrect) {
    className += "border-success-500 bg-success-50 text-success-500";
  } else if (isSelected && !isCorrect) {
    className += "border-error-500 bg-error-50 text-error-500";
  } else {
    className += "border-neutral-100 bg-neutral-50 text-neutral-400";
  }

  return (
    <button
      className={className}
      disabled={answered}
      onClick={() => onSelect(option.id)}
    >
      <span className="mr-2 font-bold opacity-60">{option.id.toUpperCase()})</span>
      {option.text}
      {answered && isCorrect && <span className="float-right">✅</span>}
      {answered && isSelected && !isCorrect && <span className="float-right">❌</span>}
    </button>
  );
}

// ── Daily Question ────────────────────────────────────────────────────────

function DailyQuestion() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showFull, setShowFull] = useState(false);

  const answered = selected !== null;
  const isCorrect = selected === DAILY_QUESTION.correctId;
  const xp = answered ? (isCorrect ? XP_DAILY_CORRECT : XP_DAILY_WRONG) : 0;

  if (!showFull) {
    return (
      <div
        className="rounded-[12px] border-2 border-dashed border-brand-200 p-5 animate-slide-up"
        style={{ background: "linear-gradient(135deg, #eff6ff, #f5f3ff)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-brand-700">⚡ Dagens spørsmål</p>
            <p className="mt-1 text-sm text-neutral-600">
              Test kunnskapen din om dagens nyheter
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white animate-pulse">
            NYTT!
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-neutral-400">🔥 Streak aktiv • Tilgjengelig til 23:59</p>
          <button
            onClick={() => setShowFull(true)}
            className="rounded-[8px] bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors duration-150"
          >
            Svar nå →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-neutral-200 bg-white p-6 space-y-4 animate-scale-in">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          ⚡ Dagens spørsmål — {new Date().toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <p className="mt-2 text-lg font-semibold text-foreground leading-snug">
          {DAILY_QUESTION.text}
        </p>
      </div>

      <div className="space-y-2">
        {DAILY_QUESTION.options.map((opt) => (
          <OptionButton
            key={opt.id}
            option={opt}
            selected={selected}
            correct={DAILY_QUESTION.correctId}
            onSelect={setSelected}
          />
        ))}
      </div>

      {answered && (
        <div className="rounded-[10px] border border-neutral-100 bg-neutral-50 p-4 animate-slide-up space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-bold text-foreground">
              {isCorrect ? "🎉 Riktig!" : "Ikke helt riktig"}
            </p>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                isCorrect ? "bg-xp-50 text-xp-600" : "bg-neutral-100 text-neutral-500"
              }`}
            >
              +{xp} XP
            </span>
          </div>
          <p className="text-sm text-neutral-600">{DAILY_QUESTION.explanation}</p>
          {DAILY_QUESTION.sourceTitle && (
            <Link
              href={DAILY_QUESTION.sourceUrl ?? "/"}
              className="flex items-center gap-1.5 rounded-[8px] border border-neutral-200 bg-white p-3 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <span>📰</span>
              <span className="line-clamp-1">{DAILY_QUESTION.sourceTitle}</span>
              <span className="ml-auto shrink-0 opacity-50">→</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ── Weekly Quiz ───────────────────────────────────────────────────────────

type WeeklyPhase = "intro" | "question" | "feedback" | "results";

function WeeklyQuiz() {
  const [phase, setPhase] = useState<WeeklyPhase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    new Array(WEEKLY_QUIZ.length).fill(null)
  );
  const [selectedNow, setSelectedNow] = useState<string | null>(null);

  const question = WEEKLY_QUIZ[questionIndex];
  const totalCorrect = answers.filter((a, i) => a === WEEKLY_QUIZ[i].correctId).length;
  const totalXp = answers.reduce(
    (sum, a, i) => sum + (a === WEEKLY_QUIZ[i].correctId ? XP_QUIZ_CORRECT : 0),
    0
  );
  const streakBonus = totalCorrect >= WEEKLY_QUIZ.length * 0.8 ? 5 : 0;
  const progress = Math.round(((questionIndex) / WEEKLY_QUIZ.length) * 100);

  function handleAnswer(id: string) {
    setSelectedNow(id);
    const newAnswers = [...answers];
    newAnswers[questionIndex] = id;
    setAnswers(newAnswers);
    setPhase("feedback");
  }

  function handleNext() {
    if (questionIndex + 1 >= WEEKLY_QUIZ.length) {
      setPhase("results");
    } else {
      setQuestionIndex((i) => i + 1);
      setSelectedNow(null);
      setPhase("question");
    }
  }

  if (phase === "intro") {
    return (
      <div className="rounded-[12px] border border-neutral-200 bg-white p-6 text-center space-y-4 animate-scale-in">
        <p className="text-4xl">📝</p>
        <div>
          <h2 className="text-xl font-bold text-foreground">Ukens Nyhetsquiz</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Uke {getWeekNumber()}, {new Date().getFullYear()}
          </p>
        </div>
        <div className="rounded-[10px] bg-neutral-50 p-4 space-y-1 text-sm text-neutral-600">
          <p>{WEEKLY_QUIZ.length} spørsmål om ukens viktigste nyheter</p>
          <p>⏱ Ca. 3 minutter &nbsp;|&nbsp; 🏆 Opptil {WEEKLY_QUIZ.length * XP_QUIZ_CORRECT} XP</p>
        </div>
        <button
          onClick={() => setPhase("question")}
          className="w-full rounded-[10px] bg-brand-600 py-3 text-sm font-bold text-white hover:bg-brand-700 transition-colors duration-150"
        >
          Start quiz →
        </button>
      </div>
    );
  }

  if (phase === "results") {
    const stars = Math.round((totalCorrect / WEEKLY_QUIZ.length) * 5);
    return (
      <div className="rounded-[12px] border border-neutral-200 bg-white p-6 space-y-5 animate-scale-in">
        <div className="text-center space-y-2">
          <p className="text-4xl">🏆</p>
          <h2 className="text-2xl font-bold text-foreground">
            {totalCorrect} av {WEEKLY_QUIZ.length} riktige!
          </h2>
          <p className="text-neutral-400">{"⭐".repeat(stars)}{"☆".repeat(5 - stars)}</p>
        </div>

        <div className="rounded-[12px] border border-neutral-100 bg-neutral-50 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Quiz-XP</span>
            <span className="font-bold text-xp-600">+{totalXp} XP</span>
          </div>
          {streakBonus > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Streak-bonus</span>
              <span className="font-bold text-xp-600">+{streakBonus} XP</span>
            </div>
          )}
          <div className="flex justify-between border-t border-neutral-200 pt-2 font-bold">
            <span>Totalt</span>
            <span className="text-xp-600">+{totalXp + streakBonus} XP</span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">Gjennomgang</p>
          <div className="space-y-1.5">
            {WEEKLY_QUIZ.map((q, i) => {
              const correct = answers[i] === q.correctId;
              return (
                <div key={q.id} className="flex items-start gap-2 text-sm">
                  <span>{correct ? "✅" : "❌"}</span>
                  <p className="text-neutral-600 line-clamp-1">{q.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <Link
          href="/"
          className="block w-full rounded-[10px] border border-neutral-200 py-2.5 text-center text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          Tilbake til forsiden
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-neutral-200 bg-white overflow-hidden animate-scale-in">
      {/* Progress bar */}
      <div className="px-5 pt-5">
        <div className="mb-1 flex justify-between text-xs text-neutral-400 font-medium">
          <span>Spørsmål {questionIndex + 1} av {WEEKLY_QUIZ.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 w-full rounded-full bg-neutral-100">
          <div
            className="h-1 rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-lg font-semibold text-foreground leading-snug">
          {question.text}
        </p>

        <div className="space-y-2">
          {question.options.map((opt) => (
            <OptionButton
              key={opt.id}
              option={opt}
              selected={selectedNow}
              correct={question.correctId}
              onSelect={handleAnswer}
            />
          ))}
        </div>

        {phase === "feedback" && (
          <div className="rounded-[10px] bg-neutral-50 border border-neutral-100 p-4 space-y-3 animate-slide-up">
            <div className="flex items-center justify-between">
              <p className="font-bold text-foreground">
                {selectedNow === question.correctId ? "✅ Riktig!" : "❌ Feil"}
              </p>
              {selectedNow === question.correctId && (
                <span className="rounded-full bg-xp-50 px-2 py-0.5 text-xs font-bold text-xp-600">
                  +{XP_QUIZ_CORRECT} XP
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-600">{question.explanation}</p>
            {question.sourceTitle && (
              <p className="text-xs text-neutral-400">
                📰 {question.sourceTitle}
              </p>
            )}
            <button
              onClick={handleNext}
              className="w-full rounded-[10px] bg-brand-600 py-2.5 text-sm font-bold text-white hover:bg-brand-700 transition-colors duration-150"
            >
              {questionIndex + 1 >= WEEKLY_QUIZ.length ? "Se resultater →" : "Neste spørsmål →"}
            </button>
          </div>
        )}

        {phase === "question" && (
          <button
            onClick={handleNext}
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Hopp over →
          </button>
        )}
      </div>
    </div>
  );
}

function getWeekNumber() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const [tab, setTab] = useState<"daily" | "weekly">("daily");

  return (
    <div className="mx-auto max-w-xl px-4 py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quiz</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Test kunnskapen din og tjen XP
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex rounded-[10px] border border-neutral-200 bg-neutral-50 p-1 gap-1">
        {(["daily", "weekly"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-[8px] py-2 text-sm font-medium transition-all duration-150 ${
              tab === t
                ? "bg-white shadow-sm text-foreground"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {t === "daily" ? "⚡ Dagens spørsmål" : "📝 Ukens quiz"}
          </button>
        ))}
      </div>

      {tab === "daily" ? <DailyQuestion /> : <WeeklyQuiz />}

      {/* XP info */}
      <div className="rounded-[10px] bg-xp-50 border border-xp-400/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-xp-600 mb-2">
          XP-belønning
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
          <span>⚡ Dagens spørsmål (riktig)</span><span className="text-right font-medium text-xp-600">+15 XP</span>
          <span>⚡ Dagens spørsmål (feil)</span><span className="text-right font-medium text-neutral-400">+5 XP</span>
          <span>📝 Quiz-spørsmål (riktig)</span><span className="text-right font-medium text-xp-600">+10 XP</span>
          <span>🔥 Streak-bonus (7+ dager)</span><span className="text-right font-medium text-xp-600">+5 XP</span>
        </div>
      </div>
    </div>
  );
}

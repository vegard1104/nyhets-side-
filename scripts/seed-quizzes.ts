/**
 * Seed script to populate sample quizzes into Supabase
 * Run with: npx ts-node scripts/seed-quizzes.ts
 *
 * Requires environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const dailyQuestions = [
  {
    question: "Hva er hovedstaden i Norge?",
    options: ["Oslo", "Bergen", "Stavanger", "Trondheim"],
    correctAnswer: 0,
    explanation: "Oslo er hovedstaden i Norge og ligger ved Oslofjorden.",
  },
  {
    question: "Hvilken norsk politiker var first statsminister etter 1945?",
    options: ["Vidkun Quisling", "Johan Ludwig Mowinckel", "Einar Gerhardsen", "Alf Ramm"],
    correctAnswer: 2,
    explanation: "Einar Gerhardsen ble valgt som Norges statsminister etter 1945.",
  },
  {
    question: "Hvilket år ble Norge medlem av Schengen-området?",
    options: ["1995", "1996", "1997", "1998"],
    correctAnswer: 2,
    explanation: "Norge ble medlem av Schengen-området den 1. januar 1996.",
  },
];

const weeklyQuizzes = [
  {
    title: "Norsk geografi",
    questions: [
      {
        question: "Hvor ligger Nordkapp?",
        options: ["Finnmark", "Troms", "Nordland", "Svalbard"],
        correctAnswer: 0,
        explanation: "Nordkapp ligger i Finnmark og er kjent som Europas nordligste punkt.",
      },
      {
        question: "Hva er Norges høyeste fjell?",
        options: ["Snøhetta", "Galdhøpiggen", "Store Skagastølstinden", "Glittertind"],
        correctAnswer: 1,
        explanation: "Galdhøpiggen er Norges høyeste fjell med 2469 meters høyde.",
      },
      {
        question: "Hvilken norsk by er kjent som 'Lofoten-øyenes hovedstad'?",
        options: ["Bodø", "Svolvær", "Stamsund", "Henningsvær"],
        correctAnswer: 1,
        explanation: "Svolvær ligger på Lofoten og er en viktig handelshavn.",
      },
      {
        question: "Hva er Norges lengste fjord?",
        options: ["Sognefjorden", "Hardangerfjorden", "Rauma-fjorden", "Lysefjorden"],
        correctAnswer: 0,
        explanation: "Sognefjorden er Norges lengste fjord, med omkring 205 km lengde.",
      },
    ],
  },
  {
    title: "Norsk historie",
    questions: [
      {
        question: "I hvilken år fikk Norge sin egen grunnlov?",
        options: ["1814", "1815", "1816", "1824"],
        correctAnswer: 0,
        explanation: "Grunnloven ble vedtatt på Eidsvoll 17. mai 1814.",
      },
      {
        question: "Hvem var Norges første kvinnelige statsminister?",
        options: ["Gro Harlem Brundtland", "Erna Solberg", "Anniken Huitfeldt", "Kristin Halvorsen"],
        correctAnswer: 0,
        explanation: "Gro Harlem Brundtland var Norges første kvinnelige statsminister, første gang 1981.",
      },
      {
        question: "Hva skjedde 17. mai 1814?",
        options: ["Norges uavhengighet", "Kalmarunionen oppløst", "Grunnloven vedtatt", "Unionen opprettet"],
        correctAnswer: 2,
        explanation: "17. mai 1814 ble Grunnloven vedtatt på Eidsvoll, og Norge feirer denne datoen som nasjonaldag.",
      },
      {
        question: "I hvilket år gikk Norge ut av Unionen med Sverige?",
        options: ["1900", "1905", "1910", "1920"],
        correctAnswer: 1,
        explanation: "Norge oppløste unionen med Sverige i 1905 og ble en selvstendig nasjon.",
      },
      {
        question: "Hvem var den første nordmannen som nådde Sydpolen?",
        options: ["Roald Amundsen", "Robert Scott", "Fridtjof Nansen", "Otto Sverdrup"],
        correctAnswer: 0,
        explanation: "Roald Amundsen nådde Sydpolen 14. desember 1911, før Robert Scott.",
      },
    ],
  },
  {
    title: "Norsk kultur og kunst",
    questions: [
      {
        question: "Hvem malte 'Skraiket'?",
        options: ["Edvard Munch", "Gustav Vigeland", "Odd Nerdrum", "Nikolai Astrup"],
        correctAnswer: 0,
        explanation: "Edvard Munch malte 'Skraiket' (The Scream) som er ett av verdens mest kjente kunstverker.",
      },
      {
        question: "Hvilken norsk forfatter skrev 'Kristin Lavransdatter'?",
        options: ["Selma Lagerlöf", "Sigrid Undset", "Knut Hamsun", "Henrik Ibsen"],
        correctAnswer: 1,
        explanation: "Sigrid Undset skrev 'Kristin Lavransdatter' og vant Nobelprisen i litteratur i 1928.",
      },
      {
        question: "Hva er det norske ordet for et folkemusikkinstrument med strenger?",
        options: ["Fiolin", "Hardingfele", "Mundharmonika", "Trekkspill"],
        correctAnswer: 1,
        explanation: "Hardingfelen er et tradisjonelt norsk strykinstrument med sympatiske strenger.",
      },
      {
        question: "Hvilket norsk band er kjent for musikken 'Take On Me'?",
        options: ["Eurythmics", "A-ha", "Royksopp", "Darkthrone"],
        correctAnswer: 1,
        explanation: "A-ha er et norsk pop-band fra 1980-tallet, kjent for 'Take On Me'.",
      },
    ],
  },
];

async function seedQuizzes() {
  try {
    console.log("Starting quiz seeding...");

    // Seed daily quizzes
    for (let i = 0; i < dailyQuestions.length; i++) {
      const question = dailyQuestions[i];
      const publishedDate = new Date();
      publishedDate.setDate(publishedDate.getDate() - (dailyQuestions.length - 1 - i));
      publishedDate.setHours(6, 0, 0, 0);

      const { error } = await supabase.from("quizzes").insert({
        title: `Dagens spørsmål - ${publishedDate.toLocaleDateString("nb-NO")}`,
        quiz_type: "daily",
        questions: [question],
        published_at: publishedDate.toISOString(),
        expires_at: new Date(publishedDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      });

      if (error) {
        console.error(`Error seeding daily quiz ${i + 1}:`, error);
      } else {
        console.log(`Seeded daily quiz ${i + 1}`);
      }
    }

    // Seed weekly quizzes
    for (const weeklyQuiz of weeklyQuizzes) {
      const { error } = await supabase.from("quizzes").insert({
        title: weeklyQuiz.title,
        quiz_type: "weekly",
        questions: weeklyQuiz.questions,
        published_at: new Date().toISOString(),
        expires_at: null,
      });

      if (error) {
        console.error(`Error seeding weekly quiz "${weeklyQuiz.title}":`, error);
      } else {
        console.log(`Seeded weekly quiz: ${weeklyQuiz.title}`);
      }
    }

    console.log("Quiz seeding completed!");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seedQuizzes();

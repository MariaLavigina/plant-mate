"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "../../../components/Navbar";
import { DarkModeContext } from "../../ClientProviders";
import { pageBg } from "../../../lib/styles";
import allQuestions from "../../../data/play-and-win.json";

type Phase = "intro" | "countdown" | "quiz" | "result";
type Badge = "bronze" | "silver" | "gold";

interface Question {
  question: string;
  choices: string[];
  answer: string;
}

const LABELS = ["A", "B", "C", "D"];


const BADGE_CONFIG: Record<Badge, { label: string; message: string; range: string }> = {
  gold:   { label: "Gold",   range: "8–10", message: "Incredible! You're a true plant expert." },
  silver: { label: "Silver", range: "5–7",  message: "Great work! You know your greenery well." },
  bronze: { label: "Bronze", range: "0–4",  message: "Good start! Keep exploring the plant world." },
};

function pickRandom(arr: Question[], n: number): Question[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function getBadge(score: number): Badge {
  if (score >= 8) return "gold";
  if (score >= 5) return "silver";
  return "bronze";
}

export default function BadgeQuiz() {
  const { darkMode } = useContext(DarkModeContext);
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("intro");
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(5);

  const currentQuestion = gameQuestions[currentIndex];
  const isLast = currentIndex === gameQuestions.length - 1;
  const badge = getBadge(score);

  // Countdown timer
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown < 0) { setPhase("quiz"); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Auto-advance 1.4 s after answering
  useEffect(() => {
    if (!answered) return;
    const t = setTimeout(() => {
      if (isLast) {
        setPhase("result");
      } else {
        setCurrentIndex(i => i + 1);
        setSelected(null);
        setAnswered(false);
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [answered, isLast]);

  function startQuiz() {
    setGameQuestions(pickRandom(allQuestions as Question[], 10));
    setCurrentIndex(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setCountdown(5);
    setPhase("countdown");
  }

  function handleSelect(choice: string) {
    if (answered) return;
    setSelected(choice);
    setAnswered(true);
    if (choice === currentQuestion.answer) setScore(s => s + 1);
  }

  function tileBase() {
    return "relative flex flex-col items-start justify-between p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 text-left w-full aspect-square";
  }

  function tileStyle(choice: string) {
    if (!answered) {
      return darkMode
        ? `${tileBase()} bg-white/[0.07] border-white/[0.12] cursor-pointer`
        : `${tileBase()} bg-white/50 border-[#210E4A]/[0.12] cursor-pointer`;
    }
    if (choice === currentQuestion.answer) {
      return darkMode
        ? `${tileBase()} bg-[#65F0CD]/[0.18] border-[#65F0CD] cursor-default`
        : `${tileBase()} bg-emerald-50 border-emerald-500 cursor-default`;
    }
    if (choice === selected) {
      return darkMode
        ? `${tileBase()} bg-red-500/[0.12] border-red-400/70 cursor-default`
        : `${tileBase()} bg-red-50 border-red-400 cursor-default`;
    }
    return darkMode
      ? `${tileBase()} bg-white/[0.03] border-white/[0.06] opacity-35 cursor-default`
      : `${tileBase()} bg-white/25 border-[#210E4A]/[0.06] opacity-35 cursor-default`;
  }

  function labelColor(choice: string, i: number) {
    if (!answered) return darkMode ? "text-[#65F0CD]/50" : "text-[#210E4A]/35";
    if (choice === currentQuestion.answer) return darkMode ? "text-[#65F0CD]" : "text-emerald-600";
    if (choice === selected) return "text-red-400";
    return darkMode ? "text-white/20" : "text-[#210E4A]/20";
  }

  function answerTextColor(choice: string) {
    if (!answered) return darkMode ? "text-white/90" : "text-[#210E4A]";
    if (choice === currentQuestion.answer) return darkMode ? "text-[#65F0CD]" : "text-emerald-800";
    if (choice === selected) return darkMode ? "text-red-300" : "text-red-700";
    return darkMode ? "text-white/25" : "text-[#210E4A]/25";
  }

  // ── INTRO ────────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className={`min-h-screen flex flex-col ${pageBg(darkMode)}`}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="w-full max-w-md flex flex-col items-center"
          >
            {/* Three badges */}
            <div className="flex items-end justify-center gap-6 mb-10">
              {(["bronze", "silver", "gold"] as Badge[]).map((b, i) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 + 0.2 }}
                  className="flex flex-col items-center gap-2"
                >
                  <img
                    src={`/images/${b}-badge.svg`}
                    alt={b}
                    className={`drop-shadow-xl ${b === "gold" ? "w-[72px] h-[72px]" : "w-12 h-12 opacity-70"}`}
                  />
                  <span className={`font-comic text-[10px] uppercase tracking-widest ${darkMode ? "text-white/35" : "text-[#1E3D2A]/40"}`}>
                    {BADGE_CONFIG[b].range}
                  </span>
                </motion.div>
              ))}
            </div>

            <h1 className={`font-caveat font-bold leading-none mb-3 ${darkMode ? "text-[#65F0CD]" : "text-[#2D6A4F]"}`}
              style={{ fontSize: "clamp(3rem,12vw,5rem)" }}>
              Play & Grow
            </h1>
            <p className={`font-comic text-base mb-10 ${darkMode ? "text-white/50" : "text-[#1E3D2A]/50"}`}>
              10 questions. Earn your badge.
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={startQuiz}
              className={`font-comic text-sm uppercase tracking-[0.2em] px-12 py-4 rounded-full font-bold shadow-2xl transition-colors duration-300 ${
                darkMode
                  ? "bg-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3]"
                  : "bg-[#210E4A] text-[#65F0CD] hover:bg-[#2D1260]"
              }`}
            >
              Start
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── COUNTDOWN ────────────────────────────────────────────────────────────────
  if (phase === "countdown") {
    return (
      <div className={`min-h-screen overflow-hidden flex flex-col items-center justify-center ${pageBg(darkMode)}`}>
        <Navbar />
        <div className="relative w-[96vw] h-[96vw] sm:w-[80vw] sm:h-[80vw] max-w-[800px] max-h-[800px]">
          {/* Big flower — fills container, rotates one way */}
          <motion.img
            src="/images/floraBig-lightMode.svg"
            alt=""
            className="absolute inset-0 w-full h-full"
            style={darkMode ? { filter: "invert(77%) sepia(56%) saturate(668%) hue-rotate(121deg) brightness(99%) contrast(97%)" } : {}}
            animate={{ rotate: 20 }}
            transition={{ repeat: Infinity, repeatType: "mirror", duration: 3, ease: "easeInOut" }}
          />
          {/* Small flower — rotates opposite */}
          <motion.img
            src="/images/floraSmall-lightMode.svg"
            alt=""
            className="absolute inset-0 w-full h-full"
            style={darkMode ? { filter: "invert(77%) sepia(56%) saturate(668%) hue-rotate(121deg) brightness(99%) contrast(97%)" } : {}}
            animate={{ rotate: -20 }}
            transition={{ repeat: Infinity, repeatType: "mirror", duration: 3, ease: "easeInOut" }}
          />
          {/* Countdown number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={countdown}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={`font-sans font-bold select-none ${darkMode ? "text-[#18FFC9]/80" : "text-[#210E4A]/80"}`}
                style={{ fontSize: "clamp(5rem, 18vw, 8rem)" }}
              >
                {countdown}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ───────────────────────────────────────────────────────────────────
  if (phase === "result") {
    const cfg = BADGE_CONFIG[badge];
    return (
      <div className={`min-h-screen flex flex-col ${pageBg(darkMode)}`}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            {/* Score ring */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.05 }}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center mb-6 border-[3px] ${
                darkMode ? "border-[#65F0CD]/30 bg-white/[0.07]" : "border-[#2D6A4F]/25 bg-white/40"
              }`}
            >
              <span className={`font-caveat text-5xl font-bold leading-none ${darkMode ? "text-[#65F0CD]" : "text-[#2D6A4F]"}`}>
                {score}
              </span>
              <span className={`font-comic text-xs ${darkMode ? "text-white/35" : "text-[#1E3D2A]/40"}`}>/ 10</span>
            </motion.div>

            {/* Badge */}
            <motion.img
              src={`/images/${badge}-badge.svg`}
              alt={badge}
              className="w-24 h-24 drop-shadow-2xl mb-4"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 13, delay: 0.25 }}
            />

            <h1 className={`font-caveat font-bold mb-2 ${darkMode ? "text-[#65F0CD]" : "text-[#2D6A4F]"}`}
              style={{ fontSize: "clamp(2.5rem,10vw,4rem)" }}>
              {cfg.label} Badge!
            </h1>
            <p className={`font-comic text-sm max-w-xs mx-auto mb-10 ${darkMode ? "text-white/45" : "text-[#1E3D2A]/50"}`}>
              {cfg.message}
            </p>

            <div className="flex items-center gap-5">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={startQuiz}
                className={`font-comic text-sm uppercase tracking-[0.2em] px-8 py-3 rounded-full font-bold shadow-lg transition-colors duration-300 ${
                  darkMode
                    ? "bg-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3]"
                    : "bg-[#210E4A] text-[#65F0CD] hover:bg-[#2D1260]"
                }`}
              >
                Play Again
              </motion.button>
              <button
                onClick={() => router.back()}
                className={`font-comic text-sm underline underline-offset-4 opacity-45 hover:opacity-80 transition-opacity ${
                  darkMode ? "text-white" : "text-[#1E3D2A]"
                }`}
              >
                Back
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── QUIZ ─────────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen flex flex-col overflow-hidden ${pageBg(darkMode)}`}>
      <Navbar />

      <div className="flex-1 flex flex-col relative px-4 sm:px-8 pt-4 pb-6 max-w-2xl w-full mx-auto justify-center">


        {/* Flower progress garden */}
        <div className="relative z-10 mb-5 mt-2">
          <div className="flex flex-col items-center mb-3">
            <span className={`font-sans font-bold tabular-nums leading-none ${
              darkMode ? "text-[#65F0CD]" : "text-[#2D6A4F]"
            }`} style={{ fontSize: "clamp(3.5rem, 14vw, 7rem)" }}>
              {score}
            </span>
            <span className={`font-comic uppercase tracking-[0.3em] text-xs ${
              darkMode ? "text-[#65F0CD]" : "text-[#2D6A4F]"
            }`}>points</span>
          </div>
          <div className="flex justify-center"><div className="grid grid-cols-5 sm:flex sm:flex-row gap-1.5 justify-items-center">
            {gameQuestions.map((_, i) => {
              const bloomed = i < currentIndex || (i === currentIndex && answered);
              return (
                <motion.img
                  key={i}
                  src={darkMode ? "/images/darkMode-flora.svg" : "/images/lightMode-flora.svg"}
                  alt=""
                  className="w-8 h-8 sm:w-9 sm:h-9"
                  animate={{ opacity: bloomed ? 1 : 0.2 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              );
            })}
          </div></div>
        </div>

        {/* Question + answers */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex flex-col gap-6"
          >
            <p className={`font-comic font-bold leading-snug text-center ${darkMode ? "text-white" : "text-[#210E4A]"}`}
              style={{ fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)" }}>
              {currentQuestion.question}
            </p>

            {/* 2 x 2 answer grid */}
            <div className="relative lg:max-w-[460px] lg:mx-auto w-full">
              {/* Semi-transparent number dead-centre over the 4 tiles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.25 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.4 }}
                    className={`font-caveat font-bold leading-none ${darkMode ? "text-white/[0.07]" : "text-[#210E4A]/[0.08]"}`}
                    style={{ fontSize: "clamp(8rem, 30vw, 14rem)" }}
                  >
                    {String(currentIndex + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="grid grid-cols-2 gap-3">
              {currentQuestion.choices.map((choice, i) => (
                <motion.button
                  key={choice}
                  onClick={() => handleSelect(choice)}
                  whileHover={!answered ? { scale: 1.03 } : {}}
                  whileTap={!answered ? { scale: 0.96 } : {}}
                  animate={
                    answered && choice === selected && choice !== currentQuestion.answer
                      ? { x: [0, -7, 7, -5, 5, -2, 2, 0] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                  className={tileStyle(choice)}
                >
                  {/* Letter label */}
                  <span className={`font-caveat text-2xl lg:text-3xl font-bold leading-none ${labelColor(choice, i)}`}>
                    {LABELS[i]}
                  </span>

                  {/* Answer text */}
                  <span className={`font-comic text-sm sm:text-base lg:text-xl leading-snug mt-2 ${answerTextColor(choice)}`}>
                    {choice}
                  </span>

                  {/* Correct checkmark */}
                  {answered && choice === currentQuestion.answer && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                      className={`absolute top-3 right-3 text-sm font-bold ${darkMode ? "text-[#65F0CD]" : "text-emerald-600"}`}
                    >
                      ✓
                    </motion.span>
                  )}

                  {/* Wrong X */}
                  {answered && choice === selected && choice !== currentQuestion.answer && (
                    <span className="absolute top-3 right-3 text-sm font-bold text-red-400">✗</span>
                  )}
                </motion.button>
              ))}
              </div>
            </div>

            {/* Auto-advance hint — always rendered to avoid layout shift */}
            <motion.p
              animate={{ opacity: answered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className={`text-center font-comic text-xs pb-1 ${darkMode ? "text-white/25" : "text-[#1E3D2A]/30"}`}
            >
              {isLast ? "Calculating result..." : "Next question in a moment..."}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

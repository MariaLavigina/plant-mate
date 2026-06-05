"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "../../../components/Navbar";
import AuthModal from "../../../components/AuthModal";
import { DarkModeContext } from "../../ClientProviders";
import { pageBg } from "../../../lib/styles";
import allQuestions from "../../../data/play-and-win.json";

const BADGE_GLOW: Record<string, string> = {
  gold:   "rgba(244,200,66,0.55)",
  silver: "rgba(180,210,240,0.65)",
  bronze: "rgba(240,144,64,0.6)",
};

const BADGE_FILTER: Record<string, string> = {
  gold:   "sepia(1) saturate(5) hue-rotate(5deg) brightness(1.2)",
  silver: "sepia(1) saturate(2) hue-rotate(190deg) brightness(1.5)",
  bronze: "sepia(1) saturate(6) hue-rotate(325deg) brightness(1.1)",
};

const BADGE_COLOR: Record<string, string> = {
  gold:   "#F4C842",
  silver: "#C8DCF0",
  bronze: "#FF9A30",
};

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bestBadge, setBestBadge] = useState<Badge | null>(null);
  const [authModal, setAuthModal] = useState<"register" | "login" | null>(null);
  const scoreSaved = useRef(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) return;
    const { token } = JSON.parse(stored);
    if (!token) return;
    setIsLoggedIn(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { if (data.user?.badge) setBestBadge(data.user.badge as Badge); })
      .catch(() => {});
  }, []);

  function submitScore(finalScore: number) {
    const stored = sessionStorage.getItem("user");
    if (!stored) return;
    const { token } = JSON.parse(stored);
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/play/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ score: finalScore }),
    }).catch(() => {});
  }

  const currentQuestion = gameQuestions[currentIndex];
  const isLast = currentIndex === gameQuestions.length - 1;
  const badge = getBadge(score);

  const bg = darkMode
    ? "bg-gradient-to-b from-[#210E4A] to-[#5A1B27] transition-colors duration-500"
    : "bg-[#1E3D2A] transition-colors duration-500";

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

  // Save score when result phase starts (logged-in users only)
  useEffect(() => {
    if (phase !== "result") return;
    scoreSaved.current = false;
    const stored = sessionStorage.getItem("user");
    if (!stored) return;
    const { token } = JSON.parse(stored);
    if (!token) return;
    scoreSaved.current = true;
    submitScore(score);
  }, [phase]);

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
    return "relative flex flex-col items-start justify-between p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 text-left w-full aspect-square lg:aspect-auto lg:h-[min(18vh,130px)]";
  }

  function tileStyle(choice: string) {
    if (!answered) {
      return darkMode
        ? `${tileBase()} bg-white/[0.07] border-white/[0.12] cursor-pointer`
        : `${tileBase()} bg-white/[0.10] border-white/[0.22] cursor-pointer`;
    }
    if (choice === currentQuestion.answer) {
      return `${tileBase()} bg-[#65F0CD]/[0.18] border-[#65F0CD] cursor-default`;
    }
    if (choice === selected) {
      return `${tileBase()} bg-red-500/[0.12] border-red-400/70 cursor-default`;
    }
    return `${tileBase()} bg-white/[0.03] border-white/[0.06] opacity-35 cursor-default`;
  }

  function labelColor(choice: string, i: number) {
    if (!answered) return darkMode ? "text-[#65F0CD]/50" : "text-white/50";
    if (choice === currentQuestion.answer) return "text-[#65F0CD]";
    if (choice === selected) return "text-red-400";
    return "text-white/20";
  }

  function answerTextColor(choice: string) {
    if (!answered) return "text-white/90";
    if (choice === currentQuestion.answer) return "text-[#65F0CD]";
    if (choice === selected) return "text-red-300";
    return "text-white/25";
  }

  // ── INTRO ────────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className={`min-h-screen flex flex-col ${bg}`}>
        <Navbar />

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="w-full max-w-md flex flex-col items-center"
          >
            {/* Three badges */}
            <div className="flex items-end justify-center gap-8 mb-10">
              {(["bronze", "gold", "silver"] as Badge[]).map((b, i) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 + 0.2 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], opacity: [0.75, 1, 0.75] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                      className="absolute rounded-full blur-md"
                      style={{
                        background: BADGE_GLOW[b],
                        width:  b === "gold" ? "4rem" : "2.8rem",
                        height: b === "gold" ? "4rem" : "2.8rem",
                      }}
                    />
                    <img
                      src={`/images/${b}-badge.svg`}
                      alt={b}
                      className={`relative drop-shadow-xl ${b === "gold" ? "w-36 h-36" : "w-24 h-24 opacity-80"}`}
                      style={b === "silver" ? { filter: "brightness(1.4) contrast(1.1)" } : undefined}
                    />
                  </div>
                  <span className="font-comic text-[10px] uppercase tracking-widest text-white/40">
                    {BADGE_CONFIG[b].range}
                  </span>
                </motion.div>
              ))}
            </div>

            <h1 className="font-caveat font-bold leading-none mb-3 text-[#65F0CD]"
              style={{ fontSize: "clamp(3rem,12vw,5rem)" }}>
              Play & Grow
            </h1>
            <p className="font-comic text-base text-white/50">
              10 questions. Earn your badge.
            </p>

            {bestBadge && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center gap-2 mt-3 mb-8 px-4 py-2 rounded-full bg-white/[0.07] border border-white/10"
              >
                <img src={`/images/${bestBadge}-badge.svg`} alt={bestBadge} className="w-5 h-5" />
                <span className="font-comic text-xs text-white/60">
                  Your best: <span style={{ color: BADGE_COLOR[bestBadge] }} className="font-bold capitalize">{bestBadge}</span>
                </span>
              </motion.div>
            )}
            {!bestBadge && <div className="mb-12" />}

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={startQuiz}
              className="w-full max-w-xs font-comic text-sm uppercase tracking-[0.2em] px-12 py-4 rounded-full font-bold shadow-2xl transition-colors duration-300 bg-[#65F0CD] text-[#1E3D2A] hover:bg-[#4FD4B3]"
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
      <div className={`min-h-screen overflow-hidden flex flex-col items-center justify-center ${bg}`}>
        <Navbar />
        <div className="relative w-[96vw] h-[96vw] sm:w-[80vw] sm:h-[80vw] max-w-[800px] max-h-[800px]">
          {/* Big flower — fills container, rotates one way */}
          <motion.img
            src="/images/floraBig-lightMode.svg"
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{ filter: "invert(77%) sepia(56%) saturate(668%) hue-rotate(121deg) brightness(99%) contrast(97%)" }}
            animate={{ rotate: 20 }}
            transition={{ repeat: Infinity, repeatType: "mirror", duration: 3, ease: "easeInOut" }}
          />
          {/* Small flower — rotates opposite */}
          <motion.img
            src="/images/floraSmall-lightMode.svg"
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{ filter: "invert(77%) sepia(56%) saturate(668%) hue-rotate(121deg) brightness(99%) contrast(97%)" }}
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
                className="font-sans font-bold select-none text-[#18FFC9]/70"
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
      <>
      <div className={`min-h-screen flex flex-col ${bg}`}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >

            {/* Badge — float wrapper + glow */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
              className="relative flex items-center justify-center mb-6"
            >
              {/* Glow ring */}
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.45, 0.75, 0.45] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                className="absolute w-28 h-28 rounded-full blur-2xl"
                style={{ background: BADGE_GLOW[badge] }}
              />
              {/* Badge image */}
              <motion.img
                src={`/images/${badge}-badge.svg`}
                alt={badge}
                className="relative w-28 h-28 drop-shadow-2xl"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 13, delay: 0.25 }}
              />
            </motion.div>

            <h1 className="font-caveat font-bold mb-1"
              style={{ fontSize: "clamp(2.5rem,10vw,4rem)", color: BADGE_COLOR[badge] }}>
              {cfg.label} Badge!
            </h1>
            <p className="font-caveat font-bold text-[#65F0CD] mb-1" style={{ fontSize: "clamp(2rem,8vw,3rem)" }}>
              {score} <span className="text-white/30">/ 10</span>
            </p>
            <p className="font-comic text-sm max-w-xs mx-auto mb-6 text-white/50">
              {cfg.message}
            </p>

            {/* Profile link — logged-in users only */}
            {isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="mb-8"
              >
                <Link
                  href="/profile"
                  className="font-comic text-sm underline underline-offset-4 transition-opacity hover:opacity-70 text-[#65F0CD]"
                >
                  See all your badges on your profile →
                </Link>
              </motion.div>
            )}

            {!isLoggedIn && (
              <div className={`mt-8 w-full max-w-xs mx-auto p-5 rounded-2xl text-center ${darkMode ? "bg-white/[0.06] border border-white/10" : "bg-white/60 border border-[#1E3D2A]/10"}`}>
                <p className="font-heading text-base mb-1 text-white/90">Save your badge!</p>
                <p className="font-comic text-xs mb-4 text-white/50">Create a free account to keep your result.</p>
                <button
                  onClick={() => setAuthModal("register")}
                  className={`w-full py-2.5 mb-2 border-2 rounded-full font-heading text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 bg-white/5 border-[#65F0CD] text-[#65F0CD] hover:bg-[#65F0CD]/80 hover:text-[#1E3D2A]`}
                >
                  Register free
                </button>
                <button
                  onClick={() => setAuthModal("login")}
                  className={`w-full py-2 border rounded-full font-heading text-xs font-bold tracking-wide transition-all duration-300 hover:scale-105 border-white/25 text-white/55 hover:border-white/50 hover:text-white/80`}
                >
                  Log in
                </button>
              </div>
            )}

            <div className="flex items-center gap-5 mt-8">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={startQuiz}
                className={`font-comic text-sm uppercase tracking-[0.2em] px-8 py-3 rounded-full font-bold shadow-lg transition-colors duration-300 ${
                  darkMode
                    ? "bg-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3]"
                    : "bg-[#65F0CD] text-[#1E3D2A] hover:bg-[#4FD4B3]"
                }`}
              >
                Play Again
              </motion.button>
              <button
                onClick={() => router.back()}
                className={`font-comic text-sm underline underline-offset-4 opacity-45 hover:opacity-80 transition-opacity ${
                  "text-white"
                }`}
              >
                Back
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {authModal && (
        <AuthModal
          type={authModal}
          reason="badge"
          onClose={() => {
            setAuthModal(null);
            const stored = sessionStorage.getItem("user");
            if (stored && JSON.parse(stored).token) {
              setIsLoggedIn(true);
              window.dispatchEvent(new Event("plant-mate-login"));
              if (!scoreSaved.current) {
                scoreSaved.current = true;
                submitScore(score);
              }
            }
          }}
        />
      )}
      </>
    );
  }

  // ── QUIZ ─────────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen lg:h-screen flex flex-col lg:overflow-hidden ${bg}`}>
      <Navbar />

      <div className="flex-1 flex flex-col relative px-4 sm:px-8 pt-20 pb-6 lg:pt-4 lg:pb-4 max-w-2xl w-full mx-auto justify-start lg:justify-center lg:overflow-hidden">


        {/* Flower progress garden */}
        <div className="relative z-10 mb-2 mt-1">
          <div className="flex flex-col items-center mb-1">
            <span className="font-sans font-bold tabular-nums leading-none"
              style={{ fontSize: "clamp(2rem, 8vw, 4rem)", color: BADGE_COLOR[getBadge(score)], transition: "color 0.6s ease" }}>
              {score}
            </span>
            <span className="font-comic uppercase tracking-[0.3em] text-xs"
              style={{ color: BADGE_COLOR[getBadge(score)], opacity: 0.7, transition: "color 0.6s ease" }}>points</span>
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
                  animate={{
                    opacity: bloomed ? 1 : 0.15,
                    filter: bloomed
                      ? `${BADGE_FILTER[getBadge(score)]} drop-shadow(0 0 4px ${BADGE_GLOW[getBadge(score)]})`
                      : "grayscale(1) brightness(0.4)",
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
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
            className="relative z-10 flex flex-col gap-3"
          >
            <div className="flex justify-center">
              <span className="font-caveat font-bold text-lg px-4 py-0.5 rounded-full border border-[#65F0CD]/30 text-[#65F0CD]/70">
                {String(currentIndex + 1).padStart(2, "0")} / {String(gameQuestions.length).padStart(2, "0")}
              </span>
            </div>

            <p className="font-comic font-bold leading-snug text-center text-white/90"
              style={{ fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)" }}>
              {currentQuestion.question}
            </p>

            {/* 2 x 2 answer grid */}
            <div className="relative lg:max-w-[460px] lg:mx-auto w-full">
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
              className="text-center font-comic text-xs pb-1 text-white/25"
            >
              {isLast ? "Calculating result..." : "Next question in a moment..."}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

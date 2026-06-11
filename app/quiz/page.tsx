"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";
import { pageBg, primaryText } from "../../lib/styles";
import { QUIZ_RESULTS_KEY } from "../../lib/constants";
import { SelectedAnswers } from "../../types";
import quizQuestions from "../../data/quiz_questions.json";

const FLOWERS = [
  { size: 80,  x: "50%",  y: "38%",  rotate: 0,    delay: 0,    duration: 3.2 },
  { size: 48,  x: "22%",  y: "28%",  rotate: 40,   delay: 0.15, duration: 2.8 },
  { size: 48,  x: "78%",  y: "28%",  rotate: -30,  delay: 0.25, duration: 3.5 },
  { size: 36,  x: "15%",  y: "62%",  rotate: 20,   delay: 0.35, duration: 2.6 },
  { size: 36,  x: "85%",  y: "62%",  rotate: -50,  delay: 0.4,  duration: 3.0 },
  { size: 28,  x: "38%",  y: "72%",  rotate: 60,   delay: 0.5,  duration: 2.9 },
  { size: 28,  x: "62%",  y: "72%",  rotate: -20,  delay: 0.45, duration: 3.3 },
];

function TransitionOverlay({ darkMode }: { darkMode: boolean }) {
  const flora = darkMode ? "/images/darkMode-flora.svg" : "/images/lightMode-flora.svg";
  const bg    = darkMode
    ? "linear-gradient(135deg, #210E4A 0%, #5A1B27 100%)"
    : "linear-gradient(135deg, #F4FBF0 0%, #C8DEBA 100%)";

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {FLOWERS.map((f, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ width: f.size, height: f.size, left: f.x, top: f.y, transform: "translate(-50%, -50%)" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.15, 1], opacity: [0, 1, 1] }}
          transition={{ duration: 0.6, delay: f.delay, ease: "easeOut" }}
        >
          <motion.img
            src={flora}
            alt=""
            aria-hidden
            className="w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: f.duration, repeat: Infinity, ease: "linear", delay: f.delay + 0.6 }}
          />
        </motion.div>
      ))}

      <motion.div
        className="relative flex flex-col items-center gap-3 mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p className={`font-heading text-[clamp(1.6rem,4vw,2.4rem)] ${darkMode ? "text-[#65F0CD]" : "text-[#1E3D2A]"}`}>
          Finding your match…
        </p>
        <p className={`font-comic text-sm ${darkMode ? "text-white/45" : "text-[#1E3D2A]/55"}`}>
          Analysing your answers
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function Quiz() {
  const { darkMode } = useContext(DarkModeContext);
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [transitioning, setTransitioning] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
  const hasAnswered = !!selectedAnswers[currentQuestion.id];

  useEffect(() => {
    if (!transitioning) return;
    const t = setTimeout(() => router.push("/results"), 2200);
    return () => clearTimeout(t);
  }, [transitioning]);

  const handleSelectAnswer = (answerId: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: answerId });
  };

  const handleBack = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(selectedAnswers));
      setTransitioning(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {transitioning && <TransitionOverlay darkMode={darkMode} />}
      </AnimatePresence>

      <div className={`flex flex-col h-[100dvh] overflow-hidden ${pageBg(darkMode)}`}>
        <Navbar />

        <div className="flex flex-1 items-start sm:items-center justify-center px-3 sm:px-6 lg:px-8 pt-20 sm:pt-6 pb-4 sm:pb-[clamp(0px,6vh,3rem)] min-h-0 overflow-y-auto">
          <div className="max-w-xl w-full flex flex-col gap-3">
          <div className={`w-full rounded-2xl shadow-2xl border-2 p-5 sm:p-8 lg:p-10 ${
            darkMode ? "bg-white/10 border-[#65F0CD]/30 backdrop-blur-md" : "bg-white/90 border-[#1E3D2A]/20"
          }`}>

            {/* Progress */}
            <div className="mb-4 sm:mb-6">
              <h2 className={`text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 font-heading ${primaryText(darkMode)}`}>
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </h2>
              <div className={`w-full h-2 sm:h-2.5 rounded-full ${darkMode ? "bg-white/10" : "bg-[#1E3D2A]/10"}`}>
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`, background: "#65F0CD" }}
                />
              </div>
            </div>

            {/* Question */}
            <p className={`mb-4 sm:mb-6 text-xl sm:text-3xl font-heading font-normal leading-snug ${primaryText(darkMode)}`}>
              {currentQuestion.question}
            </p>

            {/* Answers */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {currentQuestion.answers.map((answer) => (
                <button
                  key={answer.id}
                  onClick={() => handleSelectAnswer(answer.id)}
                  className={`text-left px-3 py-2.5 sm:p-4 text-sm sm:text-base border-2 rounded-lg transition-all duration-200 leading-snug ${
                    selectedAnswers[currentQuestion.id] === answer.id
                      ? darkMode
                        ? "bg-[#65F0CD]/30 border-[#65F0CD] text-white"
                        : "bg-[#65F0CD]/30 border-[#2DAE87] text-[#0F4D35] font-semibold"
                      : darkMode
                      ? "bg-white/10 border-white/30 text-white hover:border-[#65F0CD] hover:bg-[#65F0CD]/10"
                      : "bg-white border-[#1E3D2A]/40 text-[#1E3D2A] hover:border-[#2DAE87] hover:bg-[#65F0CD]/10"
                  }`}
                >
                  {answer.text}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className={`mt-4 sm:mt-6 flex gap-3 ${currentQuestionIndex > 0 ? "" : "justify-end"}`}>
              {currentQuestionIndex > 0 && (
                <button
                  onClick={handleBack}
                  className={`py-2 sm:py-3 px-4 sm:px-6 text-xs sm:text-base rounded-lg font-semibold transition-all duration-200 border-2 ${
                    darkMode
                      ? "border-white/30 text-white/70 hover:border-white/60 hover:text-white"
                      : "border-[#1E3D2A]/40 text-[#1E3D2A]/70 hover:border-[#1E3D2A] hover:text-[#1E3D2A]"
                  }`}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!hasAnswered}
                className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 text-xs sm:text-base rounded-lg font-semibold transition-all duration-200 border-2 ${
                  hasAnswered
                    ? darkMode
                      ? "bg-[#65F0CD] border-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3] hover:border-[#4FD4B3]"
                      : "bg-[#2D6A4F] border-[#2D6A4F] text-white hover:bg-[#1E4D38] hover:border-[#1E4D38]"
                    : darkMode
                    ? "bg-white/10 border-white/20 cursor-not-allowed text-white/30"
                    : "bg-[#1E3D2A]/10 border-[#1E3D2A]/20 cursor-not-allowed text-[#1E3D2A]/30"
                }`}
              >
                {isLastQuestion ? "See My Plant Matches" : "Next Question"}
              </button>
            </div>

          </div>

          <div className="flex justify-center mt-10">
            <Link href="/" className={`font-comic text-lg transition-colors duration-200 ${
              darkMode ? "text-[#65F0CD] hover:text-[#65F0CD]/80" : "text-[#0F032B] hover:text-[#0F032B]/70"
            }`}>
              ← exit quiz
            </Link>
          </div>

          </div>
        </div>

      </div>
    </>
  );
}

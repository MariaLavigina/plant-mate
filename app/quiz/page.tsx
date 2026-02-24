// app/quiz/page.tsx (or wherever your quiz page lives)
"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar"; // adjust if needed
import { DarkModeContext } from "../ClientProviders"; // ✅ correct import
import quizQuestions from "../../data/quiz_questions.json";

type SelectedAnswers = { [key: number]: number }; // questionId -> answerId

export default function Quiz() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleSelect = (answerId: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: answerId });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // save results to localStorage or context for results page
      localStorage.setItem("quizResults", JSON.stringify(selectedAnswers));
      router.push("/results");
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-b from-[#210E4A] to-[#5A1B27]"
          : "bg-gradient-to-b from-[#A75B2B] to-[#F4E5FB]"
      }`}
    >
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div
        className={`max-w-xl w-full mx-auto p-6 sm:p-8 rounded-lg shadow-2xl mt-20 backdrop-blur-md border-2 ${
          darkMode
            ? "bg-white/10 border-[#65F0CD]/30"
            : "bg-white/30 border-[#210E4A]/30"
        }`}
      >
        <h2
          className={`text-xl sm:text-2xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-[#210E4A]"
          }`}
        >
          Question {currentQuestionIndex + 1} of {quizQuestions.length}
        </h2>

        <p
          className={`mb-6 text-base sm:text-lg ${
            darkMode ? "text-white" : "text-[#210E4A]"
          }`}
        >
          {currentQuestion.question}
        </p>

        <div className="flex flex-col gap-3">
          {currentQuestion.answers.map((answer) => (
            <button
              key={answer.id}
              onClick={() => handleSelect(answer.id)}
              className={`text-left p-3 sm:p-4 border-2 rounded-lg transition-all duration-200 backdrop-blur-sm ${
                selectedAnswers[currentQuestion.id] === answer.id
                  ? darkMode
                    ? "bg-[#65F0CD]/30 border-[#65F0CD] text-white"
                    : "bg-[#210E4A]/20 border-[#210E4A] text-[#210E4A]"
                  : darkMode
                  ? "bg-white/10 border-white/30 text-white hover:border-[#65F0CD] hover:bg-[#65F0CD]/10"
                  : "bg-white/20 border-[#210E4A]/30 text-[#210E4A] hover:border-[#210E4A] hover:bg-white/40"
              }`}
            >
              {answer.text}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestion.id]}
          className={`mt-6 w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-200 border-2 ${
            selectedAnswers[currentQuestion.id]
              ? darkMode
                ? "bg-[#65F0CD] border-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3] hover:border-[#4FD4B3]"
                : "bg-[#210E4A] border-[#210E4A] text-[#65F0CD] hover:bg-[#2D1260]"
              : "bg-gray-400/30 border-gray-400/50 cursor-not-allowed text-gray-600"
          }`}
        >
          {currentQuestionIndex < quizQuestions.length - 1
            ? "Next Question"
            : "See My Plant Match"}
        </button>
      </div>
    </div>
  );
}
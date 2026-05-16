"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";
import { pageBg, primaryText, primaryButton } from "../../lib/styles";
import { QUIZ_RESULTS_KEY } from "../../lib/constants";
import { SelectedAnswers } from "../../types";
import quizQuestions from "../../data/quiz_questions.json";

export default function Quiz() {
  const { darkMode } = useContext(DarkModeContext);
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
  const hasAnswered = !!selectedAnswers[currentQuestion.id];

  const handleSelectAnswer = (answerId: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: answerId });
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(selectedAnswers));
      router.push("/results");
    }
  };

  return (
    <div className={`flex flex-col min-h-screen px-4 sm:px-6 lg:px-8 py-10 ${pageBg(darkMode)}`}>
      <Navbar />

      <div className={`max-w-xl w-full mx-auto p-6 sm:p-8 rounded-lg shadow-2xl mt-20 backdrop-blur-md border-2 ${
        darkMode ? "bg-white/10 border-[#65F0CD]/30" : "bg-white/30 border-[#210E4A]/30"
      }`}>
        <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${primaryText(darkMode)}`}>
          Question {currentQuestionIndex + 1} of {quizQuestions.length}
        </h2>

        <p className={`mb-6 text-base sm:text-lg ${primaryText(darkMode)}`}>
          {currentQuestion.question}
        </p>

        <div className="flex flex-col gap-3">
          {currentQuestion.answers.map((answer) => (
            <button
              key={answer.id}
              onClick={() => handleSelectAnswer(answer.id)}
              className={`text-left p-3 sm:p-4 border-2 rounded-lg transition-all duration-200 backdrop-blur-sm ${
                selectedAnswers[currentQuestion.id] === answer.id
                  ? darkMode
                    ? "bg-[#65F0CD]/30 border-[#65F0CD] text-white"
                    : "bg-[#1E3D2A]/20 border-[#1E3D2A] text-[#1E3D2A]"
                  : darkMode
                  ? "bg-white/10 border-white/30 text-white hover:border-[#65F0CD] hover:bg-[#65F0CD]/10"
                  : "bg-white/20 border-[#1E3D2A]/30 text-[#1E3D2A] hover:border-[#1E3D2A] hover:bg-white/40"
              }`}
            >
              {answer.text}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!hasAnswered}
          className={`mt-6 w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-200 border-2 ${
            hasAnswered
              ? primaryButton(darkMode)
              : "bg-gray-400/30 border-gray-400/50 cursor-not-allowed text-gray-600"
          }`}
        >
          {isLastQuestion ? "See My Plant Matches" : "Next Question"}
        </button>
      </div>
    </div>
  );
}

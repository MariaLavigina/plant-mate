"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import plants from "../../data/plants.json";
import traits from "../../data/traits.json";
import quizQuestions from "../../data/quiz_questions.json";
import Navbar from "../../components/Navbar";
import InteractivePlantImage from "../../components/InteractivePlantImage";
import { DarkModeContext } from "../ClientProviders";

type SelectedAnswers = { [key: number]: number };

export default function Results() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const router = useRouter();

  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [bestMatch, setBestMatch] = useState<any>(null);

  // Load selected answers from localStorage
  useEffect(() => {
    const storedAnswers = localStorage.getItem("quizResults");
    if (storedAnswers) {
      const parsed: SelectedAnswers = JSON.parse(storedAnswers);
      setSelectedAnswers(parsed);

      const selectedTraitIds = Object.entries(parsed).flatMap(([qId, aId]) => {
        const question = quizQuestions.find((q) => q.id === Number(qId));
        const answer = question?.answers.find((a) => a.id === aId);
        return answer?.trait_ids || [];
      });

      // Determine best match plant
      const match = plants.reduce((best, plant) => {
        const overlap = plant.traits.filter((t) => selectedTraitIds.includes(t))
          .length;
        if (!best || overlap > best.overlap) return { ...plant, overlap };
        return best;
      }, null as any);

      setBestMatch(match);
    }
  }, []);

  return (
    <div
      className={`relative h-screen overflow-hidden transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-b from-[#210E4A] to-[#5A1B27]"
          : "bg-gradient-to-b from-[#A75B2B] to-[#F4E5FB]"
      }`}
    >
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 relative px-4 sm:px-6 md:px-6 lg:px-10 xl:px-14 2xl:px-16 pt-20 md:pt-20 lg:pt-24 pb-8 md:pb-0 md:h-[calc(100vh-80px)]">
        {/* Left Side - Text */}
        <div className="w-full md:w-[44%] lg:w-[40%] xl:w-[36%] z-10 flex flex-col space-y-2 sm:space-y-3 md:space-y-3 lg:space-y-4 items-center text-center md:items-start md:text-left mb-8 md:mb-0 px-2 md:px-0">
          <h2
            className={`text-2xl sm:text-3xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold leading-tight ${
              darkMode ? "text-white" : "text-[#210E4A]"
            }`}
            style={{ fontFamily: "'Caveat', cursive", fontOpticalSizing: "auto" }}
          >
            Your Plant Match
          </h2>

          {bestMatch ? (
            <>
              <h3
                className={`text-xl sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold leading-tight ${
                  darkMode ? "text-[#65F0CD]" : "text-[#210E4A]"
                }`}
                style={{ fontFamily: "'Caveat', cursive", fontOpticalSizing: "auto" }}
              >
                {bestMatch.name}
              </h3>
              <p
                className={`text-sm sm:text-base md:text-xs lg:text-sm xl:text-base 2xl:text-lg leading-relaxed ${
                  darkMode ? "text-white" : "text-[#210E4A]"
                }`}
                style={{ fontFamily: "'Comic Relief', system-ui" }}
              >
                {bestMatch.description}
              </p>
              <p
                className={`text-xs sm:text-sm md:text-xs lg:text-xs xl:text-sm 2xl:text-base leading-relaxed ${
                  darkMode ? "text-white/80" : "text-[#210E4A]/80"
                }`}
                style={{ fontFamily: "'Comic Relief', system-ui" }}
              >
                Traits:{" "}
                {bestMatch.traits
                  .map((id: number) => traits.find((t) => t.id === id)?.name)
                  .join(", ")}
              </p>
              <button
                onClick={() => router.push("/")}
                className={`mt-2 sm:mt-3 md:mt-3 lg:mt-4 py-1.5 px-4 sm:py-2 sm:px-6 md:py-2 md:px-5 lg:py-2 lg:px-6 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base rounded-full font-semibold border-2 transition-all duration-300 self-center md:self-start ${
                  darkMode
                    ? "bg-[#65F0CD] border-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3] hover:border-[#4FD4B3]"
                    : "bg-[#210E4A] border-[#210E4A] text-[#65F0CD] hover:bg-[#2D1260]"
                }`}
              >
                Go Home
              </button>
            </>
          ) : (
            <p
              className={darkMode ? "text-white" : "text-[#210E4A]"}
              style={{ fontFamily: "'Comic Relief', system-ui" }}
            >
              No plant match found.
            </p>
          )}
        </div>

        {/* Right Side - Interactive Plant Image */}
        {bestMatch && (
          <div className="w-full md:w-[44%] lg:w-[40%] xl:w-[36%] flex items-end justify-center">
            <InteractivePlantImage
              plant={bestMatch}
              darkMode={darkMode}
              className="w-full max-h-[45vh] sm:max-h-[50vh] md:max-h-[55vh] lg:max-h-[60vh] xl:max-h-[65vh] 2xl:max-h-[70vh]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
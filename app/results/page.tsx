"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import InteractivePlantImage from "../../components/InteractivePlantImage";
import AuthModal from "../../components/AuthModal";
import { DarkModeContext } from "../ClientProviders";
import { pageBg, primaryText, accentText, primaryButton } from "../../lib/styles";
import { QUIZ_RESULTS_KEY } from "../../lib/constants";
import { Plant, SelectedAnswers } from "../../types";
import plants from "../../data/plants.json";
import traits from "../../data/traits.json";
import quizQuestions from "../../data/quiz_questions.json";

export default function Results() {
  const { darkMode } = useContext(DarkModeContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const preview = searchParams.get("preview");
  const plantId = searchParams.get("plantId");

  const [bestMatch, setBestMatch] = useState<Plant | null>(null);
  const [selectedTraitIds, setSelectedTraitIds] = useState<number[]>([]);
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null);

  useEffect(() => {
    if (plantId) {
      const plant = plants.find((p) => p.id === Number(plantId));
      if (plant) setBestMatch(plant as Plant);
      return;
    }

    const storedAnswers = localStorage.getItem(QUIZ_RESULTS_KEY);
    if (!storedAnswers) {
      router.replace("/quiz");
      return;
    }

    const parsed: SelectedAnswers = JSON.parse(storedAnswers);

    const traitIds = Object.entries(parsed).flatMap(([questionId, answerId]) => {
      const question = quizQuestions.find((q) => q.id === Number(questionId));
      const answer = question?.answers.find((a) => a.id === answerId);
      return answer?.trait_ids || [];
    });

    setSelectedTraitIds(traitIds);

    let bestPlant: Plant | null = null;
    let bestOverlap = -1;

    for (const plant of plants as Plant[]) {
      const overlap = plant.traits.filter((t) => traitIds.includes(t)).length;
      if (
        overlap > bestOverlap ||
        (overlap === bestOverlap && plant.traits.length < (bestPlant?.traits.length ?? Infinity))
      ) {
        bestPlant = plant;
        bestOverlap = overlap;
      }
    }

    setBestMatch(bestPlant);
  }, [preview, plantId]);

  const TRAIT_REASONS: Record<number, string> = {
    1: "you want a plant that can handle some neglect",
    2: "your space gets plenty of natural sunlight",
    3: "you need something safe around your pets",
    4: "you enjoy giving your plants hands-on daily care",
    5: "your home doesn't get much natural light",
    6: "you love misting and creating a humid environment",
    7: "you want to watch something grow fast and noticeably",
    8: "you want a bold statement plant that turns heads",
  };

  const buildWhyText = (plant: Plant): string => {
    const reasons = plant.traits
      .filter((id) => selectedTraitIds.includes(id))
      .map((id) => TRAIT_REASONS[id])
      .filter(Boolean);
    if (reasons.length === 0) return "";
    if (reasons.length === 1) return `You ${reasons[0]}.`;
    const last = reasons[reasons.length - 1];
    const rest = reasons.slice(0, -1);
    return `You ${rest.join(", you ")} — and ${last}.`;
  };


  return (
    <>
      <div className={`min-h-screen ${pageBg(darkMode)}`}>
        <Navbar />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-6 xl:gap-8 2xl:gap-10 px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 pt-20 lg:pt-24 pb-8 lg:pb-0 lg:h-[calc(100vh-80px)] lg:overflow-hidden">

          {/* Frosted stage: groups plant match text + image */}
          <div className={`w-full lg:w-[62%] xl:w-[65%] rounded-2xl p-4 sm:p-6 lg:p-6 xl:p-8 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 xl:gap-8 mb-6 lg:mb-0 ${darkMode ? "bg-white/8 backdrop-blur-sm border border-white/10" : "bg-[#210E4A]/8 border border-[#210E4A]/10"}`}>

          {/* Left column: Your Plant Match */}
          <div className="w-full lg:w-[42%] z-10 flex flex-col space-y-2 sm:space-y-3 lg:space-y-5 items-center text-center lg:items-start lg:text-left px-2 lg:px-0">
            <h2 className={`font-caveat text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight ${primaryText(darkMode)}`}>
              Your Plant Match
            </h2>

            {bestMatch && (
              <>
                <h3 className={`font-caveat text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-semibold leading-tight ${accentText(darkMode)}`}>
                  {bestMatch.name}
                </h3>

                <p className={`font-comic text-sm sm:text-base lg:text-base xl:text-lg leading-relaxed ${primaryText(darkMode)}`}>
                  {bestMatch.description}
                </p>

                <p className={`font-comic text-xs sm:text-sm lg:text-sm xl:text-base leading-relaxed ${darkMode ? "text-white/80" : "text-[#210E4A]/80"}`}>
                  Traits: {bestMatch.traits.map((id: number) => traits.find((t) => t.id === id)?.name).join(", ")}
                </p>

                {selectedTraitIds.length > 0 && buildWhyText(bestMatch) && (
                  <div className={`mt-1 rounded-xl p-3 sm:p-4 border ${darkMode ? "bg-white/5 border-[#65F0CD]/20" : "bg-[#210E4A]/5 border-[#210E4A]/15"}`}>
                    <p className={`font-comic text-xs sm:text-sm lg:text-xs xl:text-sm font-semibold mb-1 ${accentText(darkMode)}`}>
                      Why this plant fits you:
                    </p>
                    <p className={`font-comic text-xs sm:text-sm lg:text-xs xl:text-sm leading-relaxed ${darkMode ? "text-white/80" : "text-[#210E4A]/80"}`}>
                      {buildWhyText(bestMatch)}
                    </p>
                  </div>
                )}

              </>
            )}
          </div>

          {/* Center column: Plant Image */}
          {bestMatch && (
            <div className="w-full lg:w-[58%] flex items-center justify-center">
              <InteractivePlantImage
                plant={bestMatch}
                className="h-[60vh] sm:h-[65vh] lg:h-[calc(100vh-280px)]"
                imageClassName="h-full w-auto"
              />
            </div>
          )}

          </div>{/* end frosted stage */}

          {/* Right column: Play & Win — always dark for badge contrast */}
          <div className={`w-full lg:w-[30%] xl:w-[28%] rounded-2xl p-8 sm:p-10 lg:p-7 xl:p-8 flex flex-col items-center lg:items-start space-y-5 lg:space-y-4 -mt-16 lg:mt-0 relative z-10 border ${darkMode ? "bg-[#210E4A] lg:bg-transparent border-[#65F0CD]/30 lg:border-transparent" : "bg-[#210E4A] border-[#65F0CD]/30"}`}>

            <h2 className="font-caveat text-5xl sm:text-6xl lg:text-3xl xl:text-4xl font-bold text-[#65F0CD] text-center lg:text-left">
              Play & Win!
            </h2>

            <p className="font-comic text-xl sm:text-2xl lg:text-base xl:text-lg font-semibold text-white text-center lg:text-left leading-snug">
              Think you know plants, or want to learn more?
            </p>

            <p className="font-comic text-lg sm:text-xl lg:text-sm xl:text-base text-white/80 text-center lg:text-left leading-relaxed">
              Answer 10 fun questions, score points, and earn your{' '}
              <span className="font-bold" style={{ color: '#CD7F32' }}>Bronze</span>,{' '}
              <span className="font-bold" style={{ color: '#C0C0C0' }}>Silver</span>,{' '}
              or <span className="font-bold" style={{ color: '#FFD700' }}>Gold</span> badge!
            </p>

            <div className="flex justify-center lg:justify-start gap-6 sm:gap-10 lg:gap-3 xl:gap-4 py-1 w-full">
              <img src="/images/bronze-badge.svg" alt="Bronze badge" className="w-36 h-36 sm:w-40 sm:h-40 lg:w-20 lg:h-20 xl:w-24 xl:h-24 drop-shadow-xl" />
              <img src="/images/silver-badge.svg" alt="Silver badge" className="w-36 h-36 sm:w-40 sm:h-40 lg:w-20 lg:h-20 xl:w-24 xl:h-24 drop-shadow-xl" />
              <img src="/images/gold-badge.svg" alt="Gold badge" className="w-36 h-36 sm:w-40 sm:h-40 lg:w-20 lg:h-20 xl:w-24 xl:h-24 drop-shadow-xl" />
            </div>

            <p className="font-comic text-base sm:text-lg lg:text-xs xl:text-sm text-white/70 text-center lg:text-left leading-relaxed">
              A free account keeps your badge safe and tracks your leafy progress!
            </p>

            <button
              onClick={() => setAuthModal("register")}
              className="w-full lg:w-auto py-4 lg:py-2.5 px-8 text-xl lg:text-sm xl:text-base rounded-full font-semibold border-2 transition-all duration-300 bg-[#65F0CD] border-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3] hover:border-[#4FD4B3]"
            >
              Play & Grow
            </button>

          </div>

        </div>
      </div>

      {authModal && <AuthModal type={authModal} onClose={() => setAuthModal(null)} />}
    </>
  );
}

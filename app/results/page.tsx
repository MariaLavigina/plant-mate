"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import InteractivePlantImage from "../../components/InteractivePlantImage";
import AuthModal from "../../components/AuthModal";
import BadgeWelcomeModal from "../../components/BadgeWelcomeModal";
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
  const [authReason, setAuthReason] = useState<string | undefined>(undefined);
  const [badgeModal, setBadgeModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);

  const TRAIT_ICONS: Record<number, string> = {
    1: "🌿", 2: "☀️", 3: "🐾", 4: "💚",
    5: "🌙", 6: "💧", 7: "🚀", 8: "✨",
  };

  useEffect(() => {
    if (bestMatch) {
      const t = setTimeout(() => setRevealed(true), 50);
      return () => clearTimeout(t);
    }
  }, [bestMatch]);

  useEffect(() => {
    if (plantId) {
      const plant = plants.find((p) => p.id === Number(plantId));
      if (plant) setBestMatch(plant as Plant);
      setLoading(false);
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
    setLoading(false);
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
      <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-gradient-to-b from-[#210E4A] to-[#5A1B27]" : "bg-gradient-to-b from-[#F4FBF0] from-[3%] via-[#F5C6D8] via-[20%] to-[#A75B2B] lg:from-[0%] lg:via-[50%]"}`}>
        <Navbar />

        <div className="flex flex-col px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 pt-20 lg:pt-24 pb-6 lg:h-screen lg:overflow-hidden max-w-7xl mx-auto w-full">

          {/* TOP SECTION: text left + image right */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:flex-1 gap-4 lg:gap-10 xl:gap-14 mb-5 lg:mb-6 min-h-0">

            {/* Left: plant info + Play & Win */}
            <div className="w-full lg:w-[50%] flex flex-col space-y-3 lg:space-y-5 items-center text-center lg:items-start lg:text-left">

              {/* 1 — Eyebrow + plant name */}
              <div className={`w-full transition-all duration-700 ease-out ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "0ms" }}>
                <h2 className={`font-caveat text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-normal leading-tight ${darkMode ? "text-white" : "text-[#1E3D2A]"}`}>
                  <span className={darkMode ? "text-[#65F0CD]" : "text-[#2D6A4F]"}>✦</span>{" "}Your Plant Match
                </h2>
                {bestMatch && (
                  <>
                    <h3 className={`font-caveat text-5xl sm:text-6xl lg:text-5xl xl:text-6xl font-bold leading-tight ${darkMode ? "text-[#65F0CD]" : "text-[#2D6A4F]"}`}>
                      {bestMatch.name}
                    </h3>
                  </>
                )}
              </div>

              {loading && !bestMatch && (
                <p className={`font-caveat text-xl animate-pulse ${darkMode ? "text-white/50" : "text-[#1E3D2A]/50"}`}>
                  Finding your match…
                </p>
              )}

              {bestMatch && (
                <>
                  {/* 2 — Description */}
                  <div className={`w-full transition-all duration-700 ease-out ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "150ms" }}>
                    <p className={`font-comic text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed lg:max-w-lg xl:max-w-xl ${darkMode ? "text-white" : "text-[#1E3D2A]"}`}>
                      {bestMatch.description}
                    </p>
                  </div>

                  {/* 3 — Trait pills + match score */}
                  <div className={`w-full transition-all duration-700 ease-out ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "250ms" }}>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      {bestMatch.traits.map((id: number) => {
                        const trait = traits.find((t) => t.id === id);
                        return trait ? (
                          <span key={id} className={`font-comic text-xs px-3 py-1 rounded-lg ${darkMode ? "bg-[#65F0CD]/10 text-[#65F0CD]/80" : "bg-[#2D6A4F]/15 text-[#2D6A4F]"}`}>
                            {TRAIT_ICONS[id] && <span className="mr-1">{TRAIT_ICONS[id]}</span>}{trait.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                    {selectedTraitIds.length > 0 && (
                      <p className={`font-comic text-xs mt-2 text-center lg:text-left ${darkMode ? "text-white/65" : "text-[#1E3D2A]/65"}`}>
                        ✦ {bestMatch.traits.filter((t) => selectedTraitIds.includes(t)).length} of {bestMatch.traits.length} traits matched
                      </p>
                    )}
                  </div>

                  {/* 4 — Mobile: plant image + overlapping why box */}
                  <div className={`lg:hidden w-full flex flex-col transition-all duration-700 ease-out ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "350ms" }}>
                    <InteractivePlantImage
                      plant={bestMatch}
                      className="h-[120vw] max-h-[700px] w-full"
                      imageClassName="w-full h-full object-contain"
                    />
                    {selectedTraitIds.length > 0 && buildWhyText(bestMatch) && (
                      <div
                        className={`-mt-24 relative z-10 w-full rounded-2xl p-6 border overflow-hidden ${darkMode ? "border-[#65F0CD]/20" : "border-[#1E3D2A]/20"}`}
                        style={{ backgroundColor: darkMode ? "rgba(33,14,74,0.90)" : "rgba(244,251,240,0.93)", backdropFilter: "blur(8px)" }}
                      >
                        <p className={`font-caveat text-2xl font-bold mb-3 whitespace-nowrap ${darkMode ? "text-[#F4FBF0]" : "text-[#2D6A4F]"}`}>
                          Why this plant fits you:
                        </p>
                        <p className={`font-comic text-base leading-loose ${darkMode ? "text-white/80" : "text-[#1E3D2A]/80"}`}>
                          {buildWhyText(bestMatch)}
                        </p>
                      </div>
                    )}
                  </div>

                </>
              )}

              {/* 5 — Play & Win */}
              <div className={`w-full transition-all duration-700 ease-out ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "450ms" }}>
                <div className={`w-full rounded-2xl p-7 sm:p-9 lg:p-5 xl:p-6 border flex flex-col items-center lg:items-start gap-5 lg:gap-3 xl:gap-3 ${darkMode ? "bg-[#350F29] border-[#65F0CD]/20" : "bg-[#1E3D2A] border-[#1E3D2A]"}`}>
                  <h2 className={`font-caveat text-5xl sm:text-6xl lg:text-2xl xl:text-3xl font-bold ${darkMode ? "text-[#65F0CD]" : "text-[#F4FBF0]"}`}>
                    Play & Win!
                  </h2>
                  <p className={`font-comic text-lg sm:text-xl lg:text-sm xl:text-sm font-semibold leading-relaxed lg:leading-snug ${darkMode ? "text-white" : "text-[#F4FBF0]"}`}>
                    Answer 10 fun and surprising questions about plants and your care habits. Score points and earn your{' '}
                    <span className="font-bold" style={{ color: '#CD7F32' }}>Bronze</span>,{' '}
                    <span className="font-bold" style={{ color: '#C0C0C0' }}>Silver</span>,{' '}
                    or <span className="font-bold" style={{ color: '#FFD700' }}>Gold</span> badge!
                  </p>
                  {/* Mobile badges */}
                  <div className="lg:hidden flex items-center justify-center gap-6 sm:gap-8 py-3 w-full">
                    <img src="/images/bronze-badge.svg" alt="Bronze badge" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-xl" />
                    <img src="/images/silver-badge.svg" alt="Silver badge" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-xl" />
                    <img src="/images/gold-badge.svg" alt="Gold badge" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-xl" />
                  </div>
                  {/* Desktop badges */}
                  <div className="hidden lg:flex items-center justify-start gap-3 w-full">
                    <img src="/images/desktop-images/bronzeBadge.svg" alt="Bronze badge" className="w-12 h-12 xl:w-14 xl:h-14 drop-shadow-xl" />
                    <img src="/images/desktop-images/silverBadge.svg" alt="Silver badge" className="w-12 h-12 xl:w-14 xl:h-14 drop-shadow-xl" />
                    <img src="/images/desktop-images/goldBadge.svg" alt="Gold badge" className="w-12 h-12 xl:w-14 xl:h-14 drop-shadow-xl" />
                  </div>
                  <button
                    onClick={() => {
                      const stored = localStorage.getItem("user");
                      if (stored) {
                        setLoggedInUser(JSON.parse(stored));
                        setBadgeModal(true);
                      } else {
                        setAuthModal("register");
                        setAuthReason("badge");
                      }
                    }}
                    className={`w-full lg:w-auto py-4 px-10 lg:py-2 lg:px-7 text-xl sm:text-2xl lg:text-sm xl:text-base rounded-full font-bold border-2 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl ${darkMode ? "bg-[#65F0CD] border-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3] hover:border-[#4FD4B3] hover:shadow-[#65F0CD]/30" : "bg-[#2D6A4F] border-[#2D6A4F] text-[#F4FBF0] hover:bg-[#1E3D2A] hover:border-[#1E3D2A] hover:shadow-[#2D6A4F]/40"}`}
                  >
                    🏆 Claim Your Badge →
                  </button>
                </div>
              </div>

              {/* 6 — Retake quiz (bottom, after everything) */}
              <div className={`w-full flex justify-center lg:justify-start transition-all duration-700 ease-out ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "550ms" }}>
                <button
                  onClick={() => router.push("/quiz")}
                  className={`font-comic text-sm sm:text-base uppercase tracking-widest underline underline-offset-4 transition-opacity opacity-70 hover:opacity-100 ${darkMode ? "text-white" : "text-[#1E3D2A]"}`}
                >
                  ↩ Retake quiz
                </button>
              </div>

            </div>

            {/* Right: plant image with why overlay — desktop only */}
            {bestMatch && (
              <div className="hidden lg:flex lg:w-[50%] items-center justify-center min-h-0">
                <div className="relative h-[calc(100vh-360px)] max-h-[500px]">
                  <InteractivePlantImage
                    plant={bestMatch}
                    className="h-full w-auto"
                    imageClassName="h-full w-auto object-contain"
                  />
                  {selectedTraitIds.length > 0 && buildWhyText(bestMatch) && (
                    <div
                      className={`absolute z-20 transition-opacity duration-700 ease-out ${revealed ? "opacity-100" : "opacity-0"}`}
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        transitionDelay: "350ms",
                        width: "115%",
                        padding: "14px 20px",
                        borderRadius: "16px",
                        backgroundColor: darkMode ? "rgba(26,11,59,0.55)" : "rgba(244,251,240,0.58)",
                        backdropFilter: "blur(12px)",
                        boxShadow: darkMode
                          ? "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(101,240,205,0.12)"
                          : "0 8px 32px rgba(30,61,42,0.14), 0 0 0 1px rgba(45,106,79,0.12)",
                      }}
                    >
                      <p className={`font-caveat text-base xl:text-lg font-bold mb-1 text-center ${darkMode ? "text-[#65F0CD]" : "text-[#2D6A4F]"}`}>
                        Why this plant fits you:
                      </p>
                      <p className={`font-comic text-xs xl:text-sm leading-relaxed text-center ${darkMode ? "text-white/80" : "text-[#1E3D2A]/80"}`}>
                        {buildWhyText(bestMatch)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {authModal && <AuthModal type={authModal} reason={authReason} onClose={() => { setAuthModal(null); setAuthReason(undefined); }} />}
      {badgeModal && <BadgeWelcomeModal user={loggedInUser} onClose={() => setBadgeModal(false)} />}
    </>
  );
}

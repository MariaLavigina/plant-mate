"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";
import { QUIZ_RESULTS_KEY } from "../../lib/constants";
import { Plant, Trait, SelectedAnswers } from "../../types";
import plants from "../../data/plants.json";
import traits from "../../data/traits.json";
import quizQuestions from "../../data/quiz_questions.json";

const TRAIT_REASONS: Record<number, string> = {
  1:  "you want a plant that fits around your life, not the other way around",
  2:  "your space gets plenty of bright, indirect light",
  3:  "you have direct sunlight to work with",
  4:  "your home is on the darker side — and that's perfectly fine",
  5:  "you need something safe around your pets or kids",
  7:  "you love a lush, humid atmosphere and the ritual of misting",
  8:  "you prefer a plant that's relaxed about humidity",
  9:  "you want to actually watch your plant grow and change",
  10: "you appreciate a plant that takes its time — slow, steady, and calming",
  11: "you're drawn to colour and personality over plain green",
  13: "you love intricate, patterned leaves — the kind you stop to study",
  14: "you're a tropical soul at heart",
  15: "you want a plant that makes a real statement in the room",
  16: "you're just getting started and want something forgiving",
  17: "you need a plant that forgives the occasional forgotten watering",
  18: "you're drawn to the sculptural world of cacti and succulents",
  20: "you picture your plant trailing and filling a corner with life",
  21: "you prefer something compact and perfectly placed",
  22: "big, bold leaves are absolutely your thing",
  23: "you love plants with a strong, architectural silhouette",
  24: "the idea of a plant that actually moves and responds fascinates you",
  25: "you genuinely enjoy the daily ritual of caring for your plants",
  26: "you'd love a plant that actually blooms and flowers at home",
  27: "you enjoy the full cycle — propagating, sharing cuttings, and watching new roots grow",
};

function buildWhyText(traitIds: number[]): string {
  const counts: Record<number, number> = {};
  traitIds.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
  const topIds = Object.entries(counts)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 3)
    .map(([id]) => Number(id));
  const reasons = topIds.map(id => TRAIT_REASONS[id]).filter(Boolean);
  if (!reasons.length) return "These plants are perfectly suited to your lifestyle and preferences.";
  if (reasons.length === 1) return `Because ${reasons[0]}, these plants are a wonderful match for you.`;
  const last = reasons.at(-1);
  const rest = reasons.slice(0, -1);
  return `Because ${rest.join(", ")} — and ${last}, these plants were made for you.`;
}

function ArrowDown({ delay = 0, size = 28 }: { delay?: number; size?: number }) {
  return (
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: delay + 0.9 }}
      >
        <svg width={size} height={size * 1.6} viewBox="0 0 20 32" fill="none">
          <motion.line
            x1="10" y1="0" x2="10" y2="20"
            stroke="#65F0CD" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: delay + 0.1, ease: "easeOut" }}
          />
          <motion.path
            d="M 3 14 L 10 23 L 17 14"
            stroke="#65F0CD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.5, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function traitPillStyle(id: number): React.CSSProperties {
  let rgb: string;
  if (id === 6)                                  rgb = "248,113,113";  // pet toxic  → red
  else if (id === 5)                             rgb = "74,222,128";   // pet safe   → green
  else if ([2, 3, 4].includes(id))               rgb = "251,191,36";   // light      → amber
  else if ([1, 7, 8, 16, 17, 25].includes(id))   rgb = "56,189,248";   // care/water → sky blue
  else if ([11, 12, 13, 15, 23, 26].includes(id)) rgb = "244,114,182"; // visual     → pink
  else                                            rgb = "101,240,205"; // growth/special → teal
  return {
    color: `rgb(${rgb})`,
    borderColor: `rgb(${rgb})`,
    backgroundColor: `rgba(${rgb},0.12)`,
  };
}

function sideHeightClass(rank: number): string {
  return ({
    1: "h-[130px] lg:h-[min(34vh,25vw,300px)]",
    2: "h-[160px] lg:h-[min(42vh,31vw,370px)]",
    3: "h-[185px] lg:h-[min(47vh,35vw,420px)]",
  }[rank] ?? "h-[145px] lg:h-[min(38vh,28vw,340px)]");
}

interface PlantLabel {
  plant: Plant;
  position: "left" | "right" | "center";
  revealed: boolean;
  traitNames: (id: number) => string;
  delay: string;
}

function PlantLabelDesktop({ plant, position, revealed, traitNames, delay }: PlantLabel) {
  const motionDelay = parseFloat(delay) / 1000;
  const base = `hidden lg:flex flex-col absolute transition-all duration-700 ${revealed ? "opacity-100" : "opacity-0"}`;
  const nameStyle = { fontSize: "clamp(0.95rem,1.6vw,1.35rem)" } as React.CSSProperties;
  const pillStyle = { fontSize: "clamp(8px,1vw,12px)" };
  const t = (extra = 0) => ({ duration: 0.55, delay: motionDelay + 0.2 + extra, ease: "easeOut" as const });

  if (position === "left") {
    // stacked: name above, pills below; label floats above-left, diagonal ↘ arrow drops into plant
    return (
      <div className={`${base} items-end`} style={{ bottom: "105%", right: "100%", marginRight: "clamp(8px,1.5vw,24px)", transitionDelay: delay }}>
        <div className="text-right">
          <p className="font-heading text-[#65F0CD] leading-tight whitespace-nowrap" style={nameStyle}>{plant.name}</p>
          <div className="flex gap-1 flex-wrap justify-end mt-1">
            {plant.traits.slice(0, 3).map(id => (
              <span key={id} style={{ ...pillStyle, ...traitPillStyle(id) }} className="px-2.5 py-1 border-2 rounded-full whitespace-nowrap font-semibold tracking-wide">{traitNames(id)}</span>
            ))}
          </div>
        </div>
        <svg width="52" height="62" viewBox="0 0 52 62" fill="none" className="mt-2 self-end">
          <motion.path d="M 6 4 L 44 54" stroke="#65F0CD" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={t()} />
          <motion.path d="M 30 46 L 46 58 L 38 44" stroke="#65F0CD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={t(0.5)} />
        </svg>
      </div>
    );
  }

  if (position === "right") {
    // stacked: name above, pills below; label floats above-right, diagonal ↙ arrow drops into plant
    return (
      <div className={`${base} items-start`} style={{ bottom: "105%", left: "100%", marginLeft: "clamp(8px,1.5vw,24px)", transitionDelay: delay }}>
        <div className="text-left">
          <p className="font-heading text-[#65F0CD] leading-tight whitespace-nowrap" style={nameStyle}>{plant.name}</p>
          <div className="flex gap-1 flex-wrap mt-1">
            {plant.traits.slice(0, 3).map(id => (
              <span key={id} style={{ ...pillStyle, ...traitPillStyle(id) }} className="px-2.5 py-1 border-2 rounded-full whitespace-nowrap font-semibold tracking-wide">{traitNames(id)}</span>
            ))}
          </div>
        </div>
        <svg width="52" height="62" viewBox="0 0 52 62" fill="none" className="mt-2 self-start">
          <motion.path d="M 46 4 L 8 54" stroke="#65F0CD" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={t()} />
          <motion.path d="M 22 46 L 6 58 L 14 44" stroke="#65F0CD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={t(0.5)} />
        </svg>
      </div>
    );
  }

  // center: name + pills on ONE horizontal row; anchored to the side at top of plant (never overlaps heading)
  return (
    <div className={`${base} items-start`} style={{ top: "12%", left: "100%", marginLeft: "clamp(8px,1.5vw,24px)", transitionDelay: delay }}>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-heading text-[#65F0CD] leading-tight whitespace-nowrap" style={nameStyle}>{plant.name}</p>
        {plant.traits.slice(0, 3).map(id => (
          <span key={id} style={{ ...pillStyle, ...traitPillStyle(id) }} className="px-2.5 py-1 border-2 rounded-full whitespace-nowrap font-semibold tracking-wide">{traitNames(id)}</span>
        ))}
      </div>
      {/* arrow curves from upper-right (label) down-left into the plant */}
      <svg width="62" height="52" viewBox="0 0 62 52" fill="none" className="mt-2 self-start">
        <motion.path d="M 58 8 C 44 14 22 28 6 42" stroke="#65F0CD" strokeWidth="2" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={t()} />
        <motion.path d="M 16 32 L 4 42 L 18 46" stroke="#65F0CD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={t(0.5)} />
      </svg>
    </div>
  );
}

export default function Results() {
  const { darkMode } = useContext(DarkModeContext);
  const router = useRouter();

  const [displayPlants, setDisplayPlants] = useState<Plant[]>([]);
  const [selectedTraitIds, setSelectedTraitIds] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (displayPlants.length > 0) {
      const t = setTimeout(() => setRevealed(true), 120);
      return () => clearTimeout(t);
    }
  }, [displayPlants]);

  useEffect(() => {
    const storedAnswers = localStorage.getItem(QUIZ_RESULTS_KEY);
    if (!storedAnswers) {
      router.replace("/quiz");
      return;
    }

    const parsed: SelectedAnswers = JSON.parse(storedAnswers);
    const traitIds = Object.entries(parsed).flatMap(([questionId, answerId]) => {
      const q = quizQuestions.find(q => q.id === Number(questionId));
      const a = q?.answers.find(a => a.id === answerId);
      return a?.trait_ids ?? [];
    });
    setSelectedTraitIds(traitIds);

    const scored = (plants as Plant[]).map(plant => ({
      plant,
      score: plant.traits.filter(t => traitIds.includes(t)).length,
    }));
    scored.sort((a, b) => b.score - a.score || a.plant.traits.length - b.plant.traits.length);
    const top3 = scored.slice(0, 3).map(s => s.plant);

    // Sort for display: tallest in center position
    const byHeight = [...top3].sort((a, b) => a.heightRank - b.heightRank);
    // [shortest, medium, tallest] → display as [shortest, tallest, medium]
    setDisplayPlants([byHeight[0], byHeight[2], byHeight[1]]);
    setLoading(false);
  }, []);

  const traitName = (id: number) => (traits as Trait[]).find(t => t.id === id)?.name ?? "";

  const [leftPlant, centerPlant, rightPlant] = displayPlants;

  return (
    <div className={`flex flex-col min-h-screen lg:h-screen lg:overflow-hidden transition-colors duration-500 ${darkMode ? "bg-gradient-to-b from-[#210E4A] to-[#5A1B27]" : "bg-gradient-to-b from-[#F4FBF0] via-[#F5C6D8] to-[#A75B2B]"}`}>
      <Navbar />

      {/* flex-1 so this fills all space below the fixed navbar */}
      <div className="flex flex-col flex-1 min-h-0 items-center px-4 sm:px-10 pt-20 pb-10 lg:pb-2">

        {loading && (
          <p className={`mt-32 font-heading text-2xl animate-pulse ${darkMode ? "text-white/50" : "text-[#210E4A]/50"}`}>
            Finding your plants…
          </p>
        )}

        {!loading && displayPlants.length === 3 && (
          <div className={`flex flex-col flex-1 min-h-0 items-center w-full max-w-6xl transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

            {/* ── Header — shrinks to its content, never grows ── */}
            <div className="shrink-0 flex flex-col items-center text-center mt-2">
              <h1 className="font-heading text-[clamp(2rem,4.5vw,3rem)] text-[#F4C842] leading-none">
                Your Plants Match!
              </h1>
              <h2 className="font-heading text-[clamp(0.95rem,1.6vw,1.25rem)] text-[#65F0CD] mt-1">
                Why those plants fit you:
              </h2>
              {selectedTraitIds.length > 0 && (
                <p className={`font-comic text-sm sm:text-[0.82rem] max-w-sm sm:max-w-xl mt-1 leading-snug ${darkMode ? "text-white/65" : "text-[#210E4A]/65"}`}>
                  {buildWhyText(selectedTraitIds)}
                </p>
              )}
            </div>

            {/* ── Plant showcase — desktop only (lg+) ── */}
            <div className="relative hidden lg:flex flex-1 min-h-0 items-end justify-center w-full mt-3 overflow-x-visible"
              style={{ paddingBottom: "clamp(24px,5vh,64px)" }}>


              {/* LEFT PLANT */}
              <div className="relative flex-shrink-0" style={{ zIndex: 10, marginRight: "clamp(-40px,-3vw,-12px)" }}>
                <PlantLabelDesktop plant={leftPlant} position="left" revealed={revealed} traitNames={traitName} delay="350ms" />
                <img
                  src={leftPlant.image}
                  alt={leftPlant.name}
                  className={`${sideHeightClass(leftPlant.heightRank)} w-auto object-contain object-bottom`}
                />
              </div>

              {/* CENTER PLANT */}
              <div className="relative flex-shrink-0" style={{ zIndex: 20 }}>
                <PlantLabelDesktop plant={centerPlant} position="center" revealed={revealed} traitNames={traitName} delay="150ms" />
                <img
                  src={centerPlant.image}
                  alt={centerPlant.name}
                  className="h-[240px] lg:h-[min(56vh,40vw,480px)] w-auto object-contain object-bottom"
                />
              </div>

              {/* RIGHT PLANT */}
              <div className="relative flex-shrink-0" style={{ zIndex: 10, marginLeft: "clamp(-40px,-3vw,-12px)" }}>
                <PlantLabelDesktop plant={rightPlant} position="right" revealed={revealed} traitNames={traitName} delay="500ms" />
                <img
                  src={rightPlant.image}
                  alt={rightPlant.name}
                  className={`${sideHeightClass(rightPlant.heightRank)} w-auto object-contain object-bottom`}
                />
              </div>
            </div>

            {/* ── Tablet (sm–lg): center plant hero on top, two side plants in a row ── */}
            <div className="hidden sm:flex lg:hidden flex-col items-center w-full mt-6 pb-8 gap-6">

              {/* Center plant — hero */}
              <div className={`flex flex-col items-center transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "150ms" }}>
                <p className="font-heading text-[#65F0CD] text-3xl leading-tight">{centerPlant.name}</p>
                <div className="flex gap-1 flex-wrap justify-center mt-2">
                  {centerPlant.traits.slice(0, 3).map(id => (
                    <span key={id} style={traitPillStyle(id)} className="text-[12px] px-3 py-1 border-2 rounded-full font-semibold tracking-wide">{traitName(id)}</span>
                  ))}
                </div>
                <img src={centerPlant.image} alt={centerPlant.name} className="mt-4 h-[42vh] w-auto object-contain" />
              </div>

              {/* Side plants — side by side */}
              <div className="flex gap-8 justify-center w-full">
                {[leftPlant, rightPlant].map((plant, i) => (
                  <div key={plant.id} className={`flex flex-col items-center flex-1 max-w-[260px] transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${300 + i * 150}ms` }}>
                    <p className="font-heading text-[#65F0CD] text-xl leading-tight">{plant.name}</p>
                    <div className="flex gap-1 flex-wrap justify-center mt-1">
                      {plant.traits.slice(0, 3).map(id => (
                        <span key={id} style={traitPillStyle(id)} className="text-[11px] px-3 py-1 border-2 rounded-full font-semibold tracking-wide">{traitName(id)}</span>
                      ))}
                    </div>
                    <img src={plant.image} alt={plant.name} className="mt-3 h-[28vh] w-auto object-contain" />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Mobile: name → traits → image, stacked ── */}
            <div className="flex flex-col items-center gap-10 mt-6 sm:hidden w-full">
              {[centerPlant, leftPlant, rightPlant].map((plant, i) => (
                <div
                  key={plant.id}
                  className={`flex flex-col items-center w-full transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: `${200 + i * 180}ms` }}
                >
                  <p className="font-heading text-[#65F0CD] text-2xl leading-tight">{plant.name}</p>
                  <div className="flex gap-1 flex-wrap justify-center mt-2">
                    {plant.traits.slice(0, 3).map(id => (
                      <span key={id} style={traitPillStyle(id)} className="text-[11px] px-3 py-1 border-2 rounded-full font-semibold tracking-wide">
                        {traitName(id)}
                      </span>
                    ))}
                  </div>
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="mt-4 h-[340px] w-auto object-contain"
                  />
                </div>
              ))}
            </div>

            {/* ── Retake quiz ── */}
            <button
              onClick={() => router.push("/quiz")}
              className={`shrink-0 font-comic text-xs sm:text-sm uppercase tracking-widest underline underline-offset-4 transition-opacity opacity-60 hover:opacity-100 mt-4 sm:mt-2 mb-2 ${darkMode ? "text-white" : "text-[#210E4A]"}`}
            >
              ↩ Retake quiz
            </button>

          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";
import { QUIZ_RESULTS_KEY } from "../../lib/constants";
import { Plant, Trait, SelectedAnswers } from "../../types";
import plants from "../../data/plants.json";
import traits from "../../data/traits.json";
import quizQuestions from "../../data/quiz_questions.json";

interface ScoredPlant {
  plant: Plant;
  questionMatches: number; // how many quiz questions had ≥1 matching trait
  traitMatches: number;    // total matched traits (secondary sort key)
  pct: number;             // percentage to display
}

// Maps each answer ID → a sentence explaining why that choice led to this plant.
const ANSWER_REASON: Record<number, (n: string, mt: number[]) => string | null> = {
  1:  (n) => `You told us plants genuinely thrive in your care - ${n} will reward that attention with steady, reliable growth.`,
  2:  (n) => `You said you find a rhythm and mostly stick to it - ${n} is a natural fit for that easy, consistent pace.`,
  3:  (n) => `You said you forget sometimes but you try - ${n} stores what it needs and waits patiently without drama.`,
  4:  (n) => `You told us you need something basically indestructible - ${n} is exactly that, thriving on minimal input.`,
  5:  (n) => `Your big sunny windows are perfect - ${n} loves direct light and uses every bit of it to stay vibrant.`,
  6:  (n) => `Your soft filtered light suits ${n} well - it grows steadily without needing harsh direct sun.`,
  7:  (n) => `Even your dim space is fine - ${n} is built for shadier spots most plants simply give up in.`,
  8:  (n) => `With a mix of bright and dark spots in your home, ${n} is flexible enough to settle in wherever you put it.`,
  9:  (n, mt) => mt.includes(5) ? `Safety around pets and kids was a priority for you - ${n} is completely non-toxic and worry-free.` : null,
  10: (n, mt) => mt.includes(5) ? `You wanted peace of mind about safety - ${n} is non-toxic and perfectly safe to have around.` : null,
  11: (n) => `With no restrictions at home, you could pick anything - and ${n} proves you have genuinely good taste.`,
  12: (n, mt) => mt.includes(5) ? `You prefer non-toxic for peace of mind - ${n} keeps things completely worry-free.` : null,
  13: (n) => `You love the ritual of misting and checking soil - ${n} rewards that hands-on, attentive care.`,
  14: (n) => `You said you don't want to fuss with humidity - ${n} is completely at home in dry air, no misting needed.`,
  15: (n) => `You prefer watering every couple of weeks - ${n} stores water and stays healthy on exactly that relaxed schedule.`,
  16: (n) => `You want a plant you can almost forget - ${n} is built for that, thriving happily on neglect.`,
  17: (n) => `You want a lush tropical corner - ${n} brings that layered, jungle energy to any space.`,
  18: (n) => `You said you want one dramatic architectural plant that owns the entire room - ${n} does exactly that.`,
  19: (n) => `You love colour and pattern everywhere - ${n} delivers that vivid, living personality.`,
  20: (n) => `You told us you want a living sculpture, clean and minimal - ${n} is precisely that, nothing more and nothing less.`,
  21: (n) => `You want a floor statement you admire every time you walk past it - ${n} is made for exactly that spot.`,
  22: (n, mt) => mt.includes(21)
    ? `You want something compact and perfectly placed on a shelf - ${n} sits exactly there.`
    : `You want something that earns its place without taking over - ${n} is a calm, considered presence.`,
  23: (n) => `You picture it trailing down beautifully - ${n} lends itself perfectly to that kind of flowing display.`,
  24: (n) => `Your warm, steamy bathroom or kitchen is ideal - ${n} thrives in that kind of naturally humid warmth.`,
  25: (n) => `You picture watching a brand new leaf slowly unfurl - ${n} gives you that moment regularly.`,
  26: (n) => `You imagine it trailing down a bookshelf, filling a corner with life - ${n} grows naturally into exactly that.`,
  27: (n) => `You want guests to stop mid-sentence asking what on earth it is - ${n} will absolutely do that.`,
  28: (n) => `You said you want a plant that moves and responds like living magic - ${n} has that kind of quiet, captivating presence.`,
  29: (n) => `You told us the plant should be the star - massive, dramatic, impossible to ignore - ${n} delivers exactly that presence.`,
  30: (n) => `You want a solid presence without stealing the whole spotlight - ${n} sits naturally in that understated role.`,
  31: (n) => `Small and perfectly placed on a shelf was exactly what you pictured - ${n} is made for that kind of considered space.`,
  32: (n) => `You want something that trails and wanders, filling a corner with life - ${n} is built for that.`,
  33: (n) => `You wanted something truly unforgettable - ${n} never disappoints on that front.`,
  34: (n) => `You said you prefer calm and peaceful over flashy - ${n} has real presence without ever demanding attention.`,
  35: (n) => `You wanted something interesting but not overwhelming - ${n} hits that balance perfectly.`,
  40: (n) => `You'd love a plant that actually blooms at home - ${n} can surprise you with flowers when conditions are right.`,
  36: (n) => `When you told us you instantly love cacti as living sculptures - that settled it. ${n} is exactly your kind of plant.`,
  37: (n) => `Cacti aren't really your thing, and ${n} is the lush, leafy alternative you were looking for.`,
  38: (n) => `You said you could be convinced by the right cactus - and ${n} is definitely the right one.`,
  39: (n) => `You want something lush and leafy over anything spiky - ${n} gives you exactly that.`,
};

function buildPersonalizedWhyText(parsedAnswers: SelectedAnswers, bestPlant: Plant): string[] {
  type Entry = { sentence: string; matchCount: number; qId: number };
  const entries: Entry[] = [];

  for (const [questionId, answerId] of Object.entries(parsedAnswers)) {
    const q = quizQuestions.find(q => q.id === Number(questionId));
    const a = q?.answers.find(a => a.id === answerId);
    if (!q || !a) continue;

    const matchingTraits = a.trait_ids.filter(t => (bestPlant as Plant).traits.includes(t));
    if (matchingTraits.length === 0) continue;

    const builder = ANSWER_REASON[answerId];
    if (!builder) continue;
    const sentence = builder(bestPlant.name, matchingTraits);
    if (!sentence) continue;

    entries.push({ sentence, matchCount: matchingTraits.length, qId: q.id });
  }

  entries.sort((a, b) => b.matchCount - a.matchCount || a.qId - b.qId);
  const picks = entries.slice(0, 7);
  picks.sort((a, b) => a.qId - b.qId);

  return picks.length > 0
    ? picks.map(e => e.sentence)
    : [`${bestPlant.name} came out on top because it matched more of your preferences than any other plant in our collection.`];
}

function traitPillStyle(id: number): React.CSSProperties {
  let rgb: string;
  if (id === 6)                                   rgb = "248,113,113";
  else if (id === 5)                              rgb = "74,222,128";
  else if ([2, 3, 4].includes(id))                rgb = "251,191,36";
  else if ([1, 7, 8, 16, 17, 25].includes(id))    rgb = "56,189,248";
  else if ([11, 12, 13, 15, 23, 26].includes(id)) rgb = "244,114,182";
  else                                             rgb = "101,240,205";
  return {
    color: `rgb(${rgb})`,
    borderColor: `rgb(${rgb})`,
    backgroundColor: `rgba(${rgb},0.12)`,
  };
}

function WhyTextLine({ line, darkMode, className = "" }: { line: string; darkMode: boolean; className?: string }) {
  const dashIdx = line.indexOf(" - ");
  const before = dashIdx !== -1 ? line.slice(0, dashIdx) : line;
  const after  = dashIdx !== -1 ? line.slice(dashIdx + 3) : null;
  return (
    <p className={`font-semibold ${className}`}>
      <span className={`block leading-snug ${darkMode ? "text-white/50" : "text-[#1A6241]/60"}`}>{before}</span>
      {after && (
        <span className={`block mt-0.5 leading-snug ${darkMode ? "text-[#65F0CD]" : "text-[#0F3D26]"}`}>{after}</span>
      )}
    </p>
  );
}

function TraitPills({ plant, traitName, className = "" }: { plant: Plant; traitName: (id: number) => string; className?: string }) {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {plant.traits.filter(id => id !== 24).slice(0, 5).map(id => (
        <span key={id} style={{ fontSize: "10px", ...traitPillStyle(id) }} className="px-3 py-1 border-2 rounded-full font-bold uppercase tracking-widest">
          {traitName(id)}
        </span>
      ))}
    </div>
  );
}

interface DesktopPlantCardProps {
  plant: Plant;
  score: number;
  revealed: boolean;
  traitName: (id: number) => string;
  nameDelay: number;
  isCenter?: boolean;
  isTopPick?: boolean;
  hidePills?: boolean;
  onClick?: () => void;
  darkMode?: boolean;
}

function DesktopPlantCard({ plant, score, revealed, traitName, nameDelay, isCenter = false, isTopPick = false, hidePills = false, onClick, darkMode = true }: DesktopPlantCardProps) {
  const imgClass = `h-[130px] lg:h-[min(34vh,25vw,300px)] w-auto object-contain object-bottom${isCenter ? " scale-[1.6] origin-bottom" : ""}`;

  return (
    <motion.div
      className="relative flex flex-col items-center cursor-pointer"
      style={{ width: "clamp(100px, 18vw, 220px)" }}
      onClick={onClick}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
    >
      {isCenter && (
        <div
          className="absolute left-0 right-0 cursor-pointer"
          style={{ top: "clamp(-150px,-14vh,-80px)", height: "clamp(80px,14vh,150px)" }}
          onClick={onClick}
        />
      )}
      <div className="relative">
        <img src={plant.image} alt={plant.name} className={imgClass} style={{ pointerEvents: "none" }} />
        {isTopPick && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 px-4 py-1.5 border border-[#F4C842]/60 text-[#F4C842] bg-[#210E4A]/80 rounded-full font-medium tracking-widest uppercase whitespace-nowrap"
            style={{ fontSize: "clamp(10px,1vw,12px)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            ★ Best Match
          </motion.div>
        )}
      </div>

      {/* Name + score below the image */}
      <motion.p
        className={`font-heading mt-3 text-center ${darkMode ? "text-[#65F0CD]" : "text-[#1A3A0A]"}`}
        style={{ fontSize: "clamp(0.85rem,1.3vw,1.15rem)" }}
        initial={{ opacity: 0, y: 14 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.5, delay: nameDelay, ease: "easeOut" }}
      >
        {plant.name}
      </motion.p>

      <motion.div
        className="w-full mt-2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: nameDelay + 0.1 }}
      >
        <div className="flex items-center justify-between mb-0.5">
          <span
            className="font-comic font-semibold"
            style={{
              fontSize: "clamp(8px,0.75vw,10px)",
              color: isCenter ? (darkMode ? "#F4C842" : "#0F3D26") : darkMode ? "rgba(255,255,255,0.55)" : "rgba(15,61,38,0.75)",
            }}
          >
            {score}% match
          </span>
        </div>
        <div className="h-[10px] w-full max-w-[120px] rounded-full" style={{ background: darkMode ? "rgba(255,255,255,0.12)" : "rgba(15,61,38,0.15)" }}>
          <motion.div
            className="h-[10px] rounded-full"
            style={{ background: isCenter ? (darkMode ? "#F4C842" : "#1A6241") : darkMode ? "rgba(101,240,205,0.55)" : "rgba(26,98,65,0.5)" }}
            initial={{ width: 0 }}
            animate={revealed ? { width: `${score}%` } : { width: 0 }}
            transition={{ duration: 0.8, delay: nameDelay + 0.25, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {!hidePills && (
        <div className="flex gap-1 flex-wrap justify-center mt-1.5">
          {plant.traits.filter(id => id !== 24).slice(0, 3).map((id, i) => (
            <motion.span
              key={id}
              style={{ fontSize: "clamp(8px,0.85vw,11px)", ...traitPillStyle(id) }}
              className="px-2.5 py-1 border-2 rounded-full whitespace-nowrap font-semibold tracking-wide"
              initial={{ opacity: 0, y: 8 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.35, delay: nameDelay + 0.15 + i * 0.09, ease: "easeOut" }}
            >
              {traitName(id)}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function Results() {
  const { darkMode } = useContext(DarkModeContext);
  const router = useRouter();

  const [displayPlants, setDisplayPlants] = useState<Plant[]>([]);
  const [displayScores, setDisplayScores] = useState<number[]>([]);
  const [whyText, setWhyText] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tappedPlant, setTappedPlant] = useState<Plant | null>(null);

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

    // Build flat trait list for secondary scoring
    const traitIds = Object.entries(parsed).flatMap(([questionId, answerId]) => {
      const q = quizQuestions.find(q => q.id === Number(questionId));
      const a = q?.answers.find(a => a.id === answerId);
      return a?.trait_ids ?? [];
    });

    const scored: ScoredPlant[] = (plants as Plant[]).map(plant => {
      // Per-answer quality: for each answer, what fraction of its trait_ids does this plant have?
      // Average across all answers gives a score that naturally differentiates even tied plants.
      let qualitySum = 0;
      let questionMatches = 0;
      for (const [qId, aId] of Object.entries(parsed)) {
        const q = quizQuestions.find(q => q.id === Number(qId));
        const a = q?.answers.find(a => a.id === aId);
        if (!a || a.trait_ids.length === 0) continue;
        const matched = a.trait_ids.filter(t => plant.traits.includes(t)).length;
        qualitySum += matched / a.trait_ids.length;
        if (matched > 0) questionMatches++;
      }
      const numAnswers = Object.keys(parsed).length;
      const pct = Math.round((qualitySum / numAnswers) * 100);
      const traitMatches = plant.traits.filter(t => traitIds.includes(t)).length;

      return { plant, questionMatches, traitMatches, pct };
    });

    // Sort: highest quality score → most traits matched → fewer total plant traits (more focused)
    scored.sort((a, b) =>
      b.pct         - a.pct         ||
      b.traitMatches - a.traitMatches ||
      a.plant.traits.length - b.plant.traits.length
    );

    const devPreviewId = localStorage.getItem("devPreviewId");
    if (devPreviewId) {
      localStorage.removeItem("devPreviewId");
      const idx = scored.findIndex(s => s.plant.id === Number(devPreviewId));
      if (idx > 0) { const [item] = scored.splice(idx, 1); scored.unshift(item); }
    }

    const top3 = scored.slice(0, 3);

    setWhyText(buildPersonalizedWhyText(parsed, top3[0].plant));

    // Best scorer always center; sides ordered by heightRank for visual balance
    const sides = [top3[1], top3[2]].sort((a, b) => a.plant.heightRank - b.plant.heightRank);
    const ordered = [sides[0], top3[0], sides[1]];
    setDisplayPlants(ordered.map(s => s.plant));
    setDisplayScores(ordered.map(s => s.pct));
    setLoading(false);
  }, []);

  const traitName = (id: number) => (traits as Trait[]).find(t => t.id === id)?.name ?? "";

  const [leftPlant, centerPlant, rightPlant] = displayPlants;
  const [leftScore, centerScore, rightScore] = displayScores;

  return (
    <div className={`flex flex-col min-h-screen lg:h-screen lg:overflow-hidden transition-colors duration-500 ${darkMode ? "bg-gradient-to-b from-[#210E4A] to-[#5A1B27]" : "bg-gradient-to-t lg:bg-gradient-to-tr from-[#7EC8A0] lg:from-[#1A6241] to-[#FDFAF0]"}`}>
      <Navbar />

      <div className="flex flex-col flex-1 min-h-0 items-center px-4 sm:px-10 pt-20 pb-10 lg:pb-2">

        {loading && (
          <p className={`mt-32 font-heading text-2xl animate-pulse ${darkMode ? "text-white/50" : "text-[#1A6241]/60"}`}>
            Finding your plants…
          </p>
        )}

        {!loading && displayPlants.length === 3 && (
          <div className={`flex flex-col flex-1 min-h-0 items-center w-full max-w-6xl transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

            {/* ── Header: tablet + mobile only ── */}
            <div className="lg:hidden shrink-0 flex flex-col items-center text-center mt-2 gap-1">
              <p className={`font-comic text-[1.1rem] sm:text-[0.95rem] uppercase tracking-widest ${darkMode ? "text-white/40" : "text-[#1A6241]/50"}`}>
                Your Plants Match!
              </p>
              <h1 className={`font-heading text-[clamp(2rem,4.5vw,3rem)] leading-none ${darkMode ? "text-[#F4C842]" : "text-[#1E3D2A]"}`}>
                {centerPlant.name}
              </h1>
              <p className={`font-comic font-bold text-[clamp(0.9rem,1.5vw,1.1rem)] ${darkMode ? "text-[#F4C842]" : "text-[#0F3D26]"}`}>· {centerScore}% match</p>
              {whyText.length > 0 && (
                <div className="hidden sm:block max-w-sm sm:max-w-xl text-center space-y-2 mt-4">
                  {whyText.map((line, i) => (
                    <WhyTextLine key={i} line={line} darkMode={darkMode} className="font-comic text-[0.85rem]" />
                  ))}
                </div>
              )}
            </div>

            {/* ── Desktop (lg+): two-column ── */}
            <div className="hidden lg:flex flex-1 min-h-0 w-full mt-2">

              {/* LEFT: heading + overlapping plants + names + score bars */}
              <div className="flex flex-col flex-1 min-h-0 items-center justify-center">
                <div className="shrink-0 text-center">
                  <p className={`font-comic text-[1.1rem] sm:text-[0.95rem] uppercase tracking-widest ${darkMode ? "text-white/40" : "text-[#1A6241]/50"}`}>
                    Your Plants Match!
                  </p>
                  <h1 className={`font-heading text-[clamp(1.8rem,3vw,2.6rem)] leading-none ${darkMode ? "text-[#F4C842]" : "text-[#1E3D2A]"}`}>
                    {centerPlant.name}
                  </h1>
                  <p className={`font-comic font-bold text-[clamp(0.85rem,1.1vw,1rem)] mt-0.5 ${darkMode ? "text-[#F4C842]" : "text-[#0F3D26]"}`}>· {centerScore}% match</p>
                </div>

                {(() => {
                  const leighton = centerPlant?.id === 35 || centerPlant?.id === 20;
                  return (
                    <div className="flex items-end justify-center w-full mt-44"
                      style={{ paddingBottom: "clamp(16px,4vh,48px)" }}>
                      <div className="flex-shrink-0" style={{ zIndex: leighton ? 20 : 10, marginRight: "clamp(-40px,-3vw,-20px)" }}>
                        <DesktopPlantCard plant={leftPlant} score={leftScore} revealed={revealed} traitName={traitName} nameDelay={0.4} hidePills onClick={() => setTappedPlant(leftPlant)} darkMode={darkMode} />
                      </div>
                      <div className="flex-shrink-0" style={{ zIndex: leighton ? 10 : 20 }}>
                        <DesktopPlantCard plant={centerPlant} score={centerScore} revealed={revealed} traitName={traitName} nameDelay={0.2} isCenter isTopPick hidePills onClick={() => setTappedPlant(centerPlant)} darkMode={darkMode} />
                      </div>
                      <div className="flex-shrink-0" style={{ zIndex: leighton ? 20 : 10, marginLeft: "clamp(-40px,-3vw,-20px)" }}>
                        <DesktopPlantCard plant={rightPlant} score={rightScore} revealed={revealed} traitName={traitName} nameDelay={0.55} hidePills onClick={() => setTappedPlant(rightPlant)} darkMode={darkMode} />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* RIGHT: why text + best plant's trait pills + comparison + retake */}
              <div className="flex flex-col justify-center w-[540px] xl:w-[580px] shrink-0 pl-12 pr-4"
                style={{ paddingBottom: "clamp(24px,5vh,60px)" }}>
                {whyText.length > 0 && (
                  <motion.div
                    className="font-comic space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                  >
                    {whyText.map((line, i) => (
                      <WhyTextLine key={i} line={line} darkMode={darkMode} className="text-[0.95rem]" />
                    ))}
                  </motion.div>
                )}
                <button
                  onClick={() => router.push("/quiz")}
                  className={`font-comic text-sm font-bold uppercase tracking-widest underline underline-offset-4 transition-opacity hover:opacity-70 mt-8 self-start ${darkMode ? "text-[#65F0CD]" : "text-[#1A6241]"}`}
                >
                  ↩ Retake quiz
                </button>
              </div>
            </div>

            {/* ── Tablet (sm–lg): center hero + two side plants ── */}
            <div className="hidden sm:flex lg:hidden flex-col items-center w-full mt-6 pb-8 gap-6">

              <button type="button" onClick={() => setTappedPlant(centerPlant)} className={`flex flex-col items-center transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "150ms" }}>
                <div className="mb-1 px-3 py-0.5 border-2 border-[#F4C842] text-[#F4C842] rounded-full text-[10px] font-semibold tracking-widest uppercase">
                  ★ Best Match
                </div>
                <p className={`font-heading text-3xl leading-tight ${darkMode ? "text-[#65F0CD]" : "text-[#1A3A0A]"}`}>{centerPlant.name}</p>
                <div className="w-[180px] mt-1.5">
                  <div className="flex justify-between mb-0.5">
                    <span className="font-comic text-[11px] font-bold text-[#F4C842]">{centerScore}% match</span>
                  </div>
                  <div className={`h-[10px] w-full max-w-[120px] rounded-full ${darkMode ? "bg-white/10" : "bg-[#3A5A20]/12"}`}>
                    <div className="h-full rounded-full bg-[#F4C842]" style={{ width: `${centerScore}%` }} />
                  </div>
                </div>
                <img src={centerPlant.image} alt={centerPlant.name} className="mt-4 h-[42vh] w-auto object-contain" />
              </button>

              <div className="flex gap-8 justify-center w-full">
                {([leftPlant, rightPlant] as Plant[]).map((plant, i) => {
                  const sc = i === 0 ? leftScore : rightScore;
                  return (
                    <button type="button" key={plant.id} onClick={() => setTappedPlant(plant)} className={`flex flex-col items-center flex-1 max-w-[260px] transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${300 + i * 150}ms` }}>
                      <p className={`font-heading text-xl leading-tight ${darkMode ? "text-[#65F0CD]" : "text-[#1A3A0A]"}`}>{plant.name}</p>
                      <div className="w-[140px] mt-1 mb-1">
                        <div className="flex justify-between mb-0.5">
                          <span className={`font-comic text-[10px] ${darkMode ? "text-white/50" : "text-[#1E3D2A]/60"}`}>{sc}% match</span>
                        </div>
                        <div className={`h-[10px] w-full max-w-[120px] rounded-full ${darkMode ? "bg-white/10" : "bg-[#3A5A20]/12"}`}>
                          <div className="h-full rounded-full bg-[#65F0CD]/55" style={{ width: `${sc}%` }} />
                        </div>
                      </div>
                      <img src={plant.image} alt={plant.name} className="mt-3 h-[28vh] w-auto object-contain" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Mobile: stacked ── */}
            <div className="flex flex-col items-center gap-10 mt-6 sm:hidden w-full">
              {([centerPlant, leftPlant, rightPlant] as Plant[]).map((plant, i) => {
                const sc = [centerScore, leftScore, rightScore][i];
                return (
                  <div key={plant.id} className="flex flex-col items-center w-full gap-10">
                    {i === 1 && (
                      <div className="w-full px-6 text-center border-t pt-6" style={{ borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(26,98,65,0.15)" }}>
                        <p className={`font-comic text-[0.7rem] uppercase tracking-widest mb-1 ${darkMode ? "text-white/35" : "text-[#1A6241]/50"}`}>Also a great match for you</p>
                        <p className={`font-comic text-[0.78rem] font-semibold ${darkMode ? "text-white/70" : "text-[#1A3A0A]/80"}`}>Not quite feeling {centerPlant.name}? These two came very close - tap either to learn more.</p>
                      </div>
                    )}
                    <button
                      type="button"
                      className={`flex flex-col items-center w-full transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                      style={{ transitionDelay: `${200 + i * 180}ms` }}
                      onClick={() => setTappedPlant(plant)}
                    >
                      <p className={`font-heading text-2xl leading-tight ${darkMode ? "text-[#65F0CD]" : "text-[#1A3A0A]"}`}>{plant.name}</p>
                      <div className="w-[180px] mt-1.5 mb-1">
                        <div className="flex justify-between mb-0.5">
                          <span className={`font-comic text-[11px] font-semibold ${darkMode ? (i === 0 ? "text-[#F4C842]" : "text-white/90") : "text-[#0F3D26]"}`}>
                            {sc}% match
                          </span>
                        </div>
                        <div className={`h-[10px] w-full max-w-[120px] rounded-full ${darkMode ? "bg-white/10" : "bg-[#3A5A20]/12"}`}>
                          <div
                            className="h-[10px] rounded-full"
                            style={{ width: `${sc}%`, background: i === 0 ? (darkMode ? "#F4C842" : "#1A6241") : darkMode ? "rgba(101,240,205,0.55)" : "rgba(26,98,65,0.5)" }}
                          />
                        </div>
                      </div>
                      <div className="relative mt-4">
                        <img
                          src={plant.image}
                          alt={plant.name}
                          className="h-[340px] w-auto object-contain"
                        />
                        </div>
                    </button>

                    {/* Why text - shown immediately after the best match plant */}
                    {i === 0 && whyText.length > 0 && (
                      <div className="w-full px-4 space-y-4 -mt-2">
                        {whyText.map((line, j) => (
                          <WhyTextLine key={j} line={line} darkMode={darkMode} className="font-comic text-[0.9rem] text-center" />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

            </div>


            {/* ── Retake quiz: tablet + mobile only (desktop has it in right column) ── */}
            <button
              onClick={() => router.push("/quiz")}
              className={`lg:hidden shrink-0 font-comic text-sm sm:text-base font-bold uppercase tracking-widest underline underline-offset-4 transition-opacity hover:opacity-80 mt-4 sm:mt-2 mb-2 ${darkMode ? "text-[#65F0CD]" : "text-[#1A6241]"}`}
            >
              ↩ Retake quiz
            </button>

          </div>
        )}
      </div>

      {/* ── Plant detail: bottom sheet on mobile/tablet, slide-in drawer on desktop ── */}
      <AnimatePresence>
        {tappedPlant && (
          <>
            {/* Invisible click-catcher - no colour, just captures clicks anywhere to dismiss */}
            <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setTappedPlant(null)} />

            {/* Mobile + tablet: bottom sheet */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#210E4A] rounded-t-3xl overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={() => setTappedPlant(null)}
            >
              {/* Drag handle + X button */}
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />
                <button
                  onClick={() => setTappedPlant(null)}
                  className="absolute top-3 right-4 text-white/40 hover:text-white transition-colors text-lg leading-none"
                >
                  ✕
                </button>
              </div>
              <div className="px-4 pt-2 pb-1">
                <img
                  src={tappedPlant.image.replace(".webp", "-rightPanel.webp")}
                  alt={tappedPlant.name}
                  className="w-full object-contain rounded-xl"
                  style={{ height: "60vw", maxHeight: "360px" }}
                />
              </div>
              <div className="px-6 pt-4 pb-8">
                <p className="font-heading text-[#65F0CD] text-xl mb-3">{tappedPlant.name}</p>
                <TraitPills plant={tappedPlant} traitName={traitName} className="mb-4" />
                <p className="font-comic text-white/80 text-sm leading-relaxed mb-5">
                  {tappedPlant.panelDescription ?? tappedPlant.description}
                </p>
              </div>
            </motion.div>

            {/* Desktop: slide-in drawer from right */}
            <motion.div
              className="fixed top-0 right-0 h-full z-50 hidden lg:flex flex-col bg-[#210E4A] border-l border-white/10 overflow-hidden"
              style={{ width: "clamp(360px, 30vw, 480px)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <button
                onClick={() => setTappedPlant(null)}
                className="absolute top-4 right-5 text-white/40 hover:text-white transition-colors z-10 text-lg leading-none"
              >
                ✕
              </button>
              <div className="px-5 pt-10 pb-2 flex-shrink-0" style={{ height: "40%" }}>
                <img
                  src={tappedPlant.image.replace(".webp", "-rightPanel.webp")}
                  alt={tappedPlant.name}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="flex-1 overflow-y-auto px-7 py-6">
                <h2 className="font-heading text-[#65F0CD] text-2xl mb-4">{tappedPlant.name}</h2>
                <TraitPills plant={tappedPlant} traitName={traitName} className="mb-5" />
                <p className="font-comic text-white/80 text-sm leading-relaxed">
                  {tappedPlant.panelDescription ?? tappedPlant.description}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

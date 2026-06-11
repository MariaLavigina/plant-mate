"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "../../components/Navbar";
import AuthModal from "../../components/AuthModal";
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
  1:  (n) => `Since plants genuinely thrive in your care - ${n} will reward that attention with steady, reliable growth.`,
  2:  (n) => `You naturally find a rhythm and mostly stick to it - ${n} is a natural fit for that easy, consistent pace.`,
  3:  (n) => `Even when you forget sometimes, you always try - ${n} stores what it needs and waits patiently without drama.`,
  4:  (n) => `Low-maintenance and basically indestructible was the brief - ${n} is exactly that, thriving on minimal input.`,
  5:  (n) => `Those big sunny windows of yours are a real asset - ${n} loves direct light and uses every bit of it to stay vibrant.`,
  6:  (n) => `Soft filtered light actually suits your space perfectly - ${n} grows steadily without needing harsh direct sun.`,
  7:  (n) => `Even that dim corner everyone ignores works just fine - ${n} is built for shadier spots most plants simply give up in.`,
  8:  (n) => `A mix of light levels actually works in your favour - ${n} is flexible enough to settle in wherever you put it.`,
  9:  (n, mt) => mt.includes(5) ? `Keeping pets and kids safe was a real priority for you - ${n} is completely non-toxic and worry-free.` : null,
  10: (n, mt) => mt.includes(5) ? `Peace of mind around safety genuinely matters to you - ${n} is non-toxic and perfectly safe to have around.` : null,
  11: (n) => `No restrictions at home meant total freedom to choose - and ${n} proves you have genuinely good taste.`,
  12: (n, mt) => mt.includes(5) ? `Non-toxic was simply non-negotiable for you - ${n} keeps things completely worry-free.` : null,
  13: (n) => `That ritual of misting and checking soil is very much your thing - ${n} rewards that hands-on, attentive care.`,
  14: (n) => `Fussing with humidity just isn't on your radar - ${n} is completely at home in dry air, no misting needed.`,
  15: (n) => `Every couple of weeks is your ideal watering rhythm - ${n} stores water and stays healthy on exactly that relaxed schedule.`,
  16: (n) => `A plant you can almost forget about was precisely the brief - ${n} is built for that, thriving happily on neglect.`,
  17: (n) => `That lush tropical corner is absolutely the dream - ${n} brings that layered, jungle energy to any space.`,
  18: (n) => `One dramatic architectural plant that owns the entire room is what you described - ${n} does exactly that.`,
  19: (n) => `Colour and pattern everywhere is completely your style - ${n} delivers that vivid, living personality.`,
  20: (n) => `A living sculpture, clean and minimal, was precisely your vision - ${n} is exactly that, nothing more and nothing less.`,
  21: (n) => `A floor statement you stop to admire every time you walk past - ${n} is made for exactly that spot.`,
  22: (n, mt) => mt.includes(21)
    ? `Compact and perfectly placed on a shelf was exactly what you pictured - ${n} sits exactly there.`
    : `Something that earns its place without taking over the room - ${n} is a calm, considered presence.`,
  23: (n) => `You said you'd love a hanging spot where it can trail down beautifully - ${n} lends itself perfectly to that kind of flowing display.`,
  24: (n) => `That warm, steamy bathroom or kitchen of yours is a hidden gem - ${n} thrives in that kind of naturally humid warmth.`,
  25: (n) => `You said you love picturing a brand new leaf slowly unfurling - ${n} gives you that moment regularly.`,
  26: (n) => `You imagined it trailing down from a bookshelf, filling a corner with life - ${n} grows naturally into exactly that.`,
  27: (n) => `Stopping guests mid-sentence with a "what on earth is that?" was the goal - ${n} will absolutely do that.`,
  28: (n) => `A plant that moves and responds like living magic is what you described - ${n} has that kind of quiet, captivating presence.`,
  29: (n) => `You said the plant needs to be massive, dramatic, impossible to ignore - ${n} delivers exactly that presence.`,
  30: (n) => `Solid presence without stealing the whole spotlight was the balance you wanted - ${n} sits naturally in that understated role.`,
  31: (n) => `Small, considered, perfectly placed on a shelf was exactly the vision - ${n} is made for that kind of space.`,
  32: (n) => `Something that trails and wanders, filling a corner with life, was what you had in mind - ${n} is built for that.`,
  33: (n) => `You said you wanted something truly unforgettable, full stop - ${n} never disappoints on that front.`,
  34: (n) => `Calm and peaceful over flashy, every single time - ${n} has real presence without ever demanding attention.`,
  35: (n) => `Interesting but not overwhelming was the sweet spot you described - ${n} hits that balance perfectly.`,
  40: (n) => `A plant that actually blooms at home was high on the wish list - ${n} can surprise you with flowers when conditions are right.`,
  36: (n) => `The moment you said you love cacti as living sculptures, that settled it - ${n} is exactly your kind of plant.`,
  37: (n) => `Cacti aren't really your thing, and that's perfectly fine - ${n} is the lush, leafy alternative you were looking for.`,
  38: (n) => `You said the right cactus could win you over - and ${n} is definitely that cactus.`,
  39: (n) => `Lush and leafy over anything spiky, every single time - ${n} gives you exactly that.`,
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


function PlayAndWinCard({ darkMode, className = "", delay = 0.6, horizontal = false, onAuthSuccess }: { darkMode: boolean; className?: string; delay?: number; horizontal?: boolean; onAuthSuccess?: () => void }) {
  const [authModal, setAuthModal] = useState<"register" | "login" | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const check = () => {
      const stored = sessionStorage.getItem("user");
      setIsLoggedIn(!!(stored && JSON.parse(stored).token));
    };
    check();
    window.addEventListener("plant-mate-login", check);
    window.addEventListener("plant-mate-logout", check);
    return () => {
      window.removeEventListener("plant-mate-login", check);
      window.removeEventListener("plant-mate-logout", check);
    };
  }, []);

  function handleAuthClose() {
    setAuthModal(null);
    const stored = sessionStorage.getItem("user");
    if (stored && JSON.parse(stored).token) {
      setIsLoggedIn(true);
      onAuthSuccess?.();
      window.dispatchEvent(new Event("plant-mate-login"));
    }
  }

  const cardStyle = {
    background: darkMode ? "#210E4A" : "#1E3D2A",
    border: darkMode ? "1px solid rgba(101,240,205,0.18)" : "1px solid rgba(255,255,255,0.1)",
  };

  if (horizontal) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay, ease: "easeOut" }}
      >
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          <div className="h-1 w-full bg-[#65F0CD]" />
          <div className="flex items-center gap-6 px-8 py-4">
            {/* Badges */}
            <div className="flex items-end gap-2 shrink-0 self-end pb-1">
              <img src="/images/bronze-badge.svg" alt="Bronze" className="h-12 w-auto" style={{ clipPath: "inset(0 8% 0 0)" }} />
              <img src="/images/gold-badge.svg" alt="Gold" className="h-[58px] w-auto -mt-3" style={{ clipPath: "inset(0 8% 0 0)" }} />
              <img src="/images/silver-badge.svg" alt="Silver" className="h-12 w-auto" style={{ clipPath: "inset(0 8% 0 0)" }} />
            </div>

            <div className="h-12 w-px bg-white/15 shrink-0" />

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="font-heading text-[1.15rem] leading-snug text-white/90">
                One last thing...{" "}
                <span className="text-[#65F0CD]">Could you earn the Gold badge?</span>
              </p>
              <p className="font-comic text-[0.82rem] leading-relaxed text-white/55 mt-1.5">
                You've found your plant. Now find out how much you really know - 10 fun questions, Bronze to Gold badges to earn.
              </p>
            </div>

            {isLoggedIn ? (
              <>
                <div className="h-12 w-px bg-white/15 shrink-0" />
                <div className="flex flex-col gap-2.5 shrink-0 w-[190px]">
                  <Link
                    href="/quiz/badge"
                    className="w-full py-2.5 border-2 rounded-full font-heading text-sm font-bold tracking-wide transition-all duration-300 backdrop-blur-md hover:scale-105 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] bg-white/5 border-[#65F0CD] text-[#65F0CD] hover:bg-[#65F0CD]/80 hover:text-[#1E3D2A] text-center"
                  >
                    Play &amp; Win
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="h-12 w-px bg-white/15 shrink-0" />

                {/* Buttons */}
                <div className="flex flex-col gap-2.5 shrink-0 w-[190px]">
                  <button
                    onClick={() => setAuthModal("register")}
                    className="w-full py-2.5 border-2 rounded-full font-heading text-sm font-bold tracking-wide transition-all duration-300 backdrop-blur-md hover:scale-105 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] bg-white/5 border-[#65F0CD] text-[#65F0CD] hover:bg-[#65F0CD]/80 hover:text-[#1E3D2A]"
                  >
                    Register free
                  </button>
                  <button
                    onClick={() => setAuthModal("login")}
                    className="w-full py-2 border rounded-full font-heading text-xs font-bold tracking-wide transition-all duration-300 hover:scale-105 border-white/25 text-white/55 hover:border-white/50 hover:text-white/80"
                  >
                    Log in
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {authModal && <AuthModal type={authModal} reason="badge" onClose={handleAuthClose} />}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        {/* Teal accent stripe */}
        <div className="h-1 w-full bg-[#65F0CD]" />

        {/* Headline */}
        <div className="text-center px-8 pt-7 pb-4">
          <p className="font-heading text-[1.7rem] leading-snug text-white/90">One last thing...</p>
          <p className="font-heading text-[1.7rem] leading-snug text-[#65F0CD]">Could you earn the Gold badge?</p>
        </div>

        {/* Explanatory text */}
        <div className="text-center px-8 pb-4">
          <p className="font-comic text-base leading-relaxed mb-3 text-white/70">
            You've found your plant. Now find out how much you really know about the world they come from.
          </p>
          <p className="font-comic text-sm leading-relaxed text-white/45">
            10 fun questions, some genuinely cool plant facts, and a Bronze, Silver or Gold badge to earn along the way.
          </p>
        </div>

        {/* Badges */}
        <div className="flex items-end justify-center gap-4 pt-14 pb-6">
          <img src="/images/bronze-badge.svg" alt="Bronze" className="h-24 w-auto" style={{ clipPath: "inset(0 8% 0 0)" }} />
          <img src="/images/gold-badge.svg" alt="Gold" className="h-36 w-auto -mt-14" style={{ clipPath: "inset(0 8% 0 0)" }} />
          <img src="/images/silver-badge.svg" alt="Silver" className="h-24 w-auto" style={{ clipPath: "inset(0 8% 0 0)" }} />
        </div>

        {/* Sign-in note + buttons */}
        {isLoggedIn ? (
          <div className="text-center px-8 pb-10">
            <Link
              href="/quiz/badge"
              className="block w-full py-4 border-2 rounded-full font-heading text-lg font-bold tracking-wide transition-all duration-300 backdrop-blur-md hover:scale-105 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] bg-white/5 border-[#65F0CD] text-[#65F0CD] hover:bg-[#65F0CD]/80 hover:text-[#1E3D2A]"
            >
              Play &amp; Win
            </Link>
          </div>
        ) : (
          <div className="text-center px-8 pb-10">
            <p className="font-heading text-[1.15rem] leading-snug text-white/90 mb-1">Think you know your plants?</p>
            <p className="font-comic text-sm leading-relaxed text-white/50 mb-6">
              It's free to play - register in seconds and keep your badge forever.
            </p>
            <button
              onClick={() => setAuthModal("register")}
              className="block w-full py-4 border-2 rounded-full font-heading text-lg font-bold tracking-wide transition-all duration-300 backdrop-blur-md hover:scale-105 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] bg-white/5 border-[#65F0CD] text-[#65F0CD] hover:bg-[#65F0CD]/80 hover:text-[#1E3D2A] mb-3"
            >
              Register free
            </button>
            <button
              onClick={() => setAuthModal("login")}
              className="block w-full py-3.5 border rounded-full font-heading text-base font-bold tracking-wide transition-all duration-300 hover:scale-105 border-white/25 text-white/55 hover:border-white/50 hover:text-white/80"
            >
              Log in
            </button>
          </div>
        )}
      </div>

      {authModal && <AuthModal type={authModal} reason="badge" onClose={handleAuthClose} />}
    </motion.div>
  );
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
  pulse?: boolean;
}

function DesktopPlantCard({ plant, score, revealed, traitName, nameDelay, isCenter = false, isTopPick = false, hidePills = false, onClick, darkMode = true, pulse = false }: DesktopPlantCardProps) {
  const imgClass = `h-[130px] lg:h-[min(26vh,19vw,220px)] w-auto object-contain object-bottom${isCenter ? " scale-[1.6] origin-bottom" : ""}${pulse ? (darkMode ? " plant-pulse" : " plant-pulse-light") : ""}`;

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
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: nameDelay + 0.6 }}
        >
          <span
            className="pill-pulse inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full border font-comic font-semibold"
            style={{
              fontSize: "13px",
              color: darkMode ? "#65F0CD" : "#ffffff",
              borderColor: darkMode ? "rgba(101,240,205,0.5)" : "rgba(26,98,65,0.8)",
              background: darkMode ? "rgba(15,10,40,0.55)" : "#1A6241",
              backdropFilter: "blur(4px)",
            }}
          >
            explore
          </span>
        </motion.div>
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
  const [hasDiscoveredPlant, setHasDiscoveredPlant] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (displayPlants.length > 0) {
      const t = setTimeout(() => setRevealed(true), 120);
      // Save plant for already-logged-in users
      const [, plant] = displayPlants;
      const [, pct]   = displayScores;
      if (plant && pct != null) saveTopPlant(plant, pct);
      return () => clearTimeout(t);
    }
  }, [displayPlants]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setIsLoggedIn(true);

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

    localStorage.removeItem("devPreviewId");

    const top3 = scored.slice(0, 3);

    setWhyText(buildPersonalizedWhyText(parsed, top3[0].plant));

    // Best scorer always center; sides ordered by heightRank for visual balance
    const sides = [top3[1], top3[2]].sort((a, b) => a.plant.heightRank - b.plant.heightRank);
    const ordered = [sides[0], top3[0], sides[1]];
    setDisplayPlants(ordered.map(s => s.plant));
    setDisplayScores(ordered.map(s => s.pct));
    setLoading(false);
  }, []);

  function saveTopPlant(plant: Plant, pct: number) {
    const stored = sessionStorage.getItem("user");
    if (!stored) return;
    const { token } = JSON.parse(stored);
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/plant`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ plantName: plant.name, matchPct: pct }),
    }).catch(() => {});
  }

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
                We found your match
              </p>
              <h1 className={`font-heading text-[clamp(2rem,4.5vw,3rem)] leading-none ${darkMode ? "text-[#F4C842]" : "text-[#1E3D2A]"}`}>
                {centerPlant.name}
              </h1>
              <p className={`font-comic font-bold text-[clamp(0.9rem,1.5vw,1.1rem)] ${darkMode ? "text-[#F4C842]" : "text-[#0F3D26]"}`}>· {centerScore}% match</p>
              {isLoggedIn && revealed && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className={`font-comic text-[0.75rem] mt-1 ${darkMode ? "text-white/70" : "text-[#1A6241]/80"}`}
                >
                  Saved to your profile.{" "}
                  <Link href="/profile" className={`underline underline-offset-2 transition-opacity hover:opacity-70 ${darkMode ? "text-[#65F0CD]" : "text-[#1A6241]"}`}>
                    View it →
                  </Link>
                </motion.p>
              )}
              {whyText.length > 0 && (
                <div className="hidden sm:block max-w-sm sm:max-w-xl text-center space-y-2 mt-4">
                  {whyText.slice(0, 5).map((line, i) => (
                    <WhyTextLine key={i} line={line} darkMode={darkMode} className="font-comic text-[0.85rem]" />
                  ))}
                </div>
              )}
            </div>

            {/* ── Desktop heading — centered across full width ── */}
            <div className="hidden lg:block shrink-0 text-center mt-24 mb-2">
              <p className={`font-comic text-[0.95rem] uppercase tracking-widest ${darkMode ? "text-white/40" : "text-[#1A6241]/50"}`}>
                We found your match
              </p>
              <h1 className={`font-heading text-[clamp(1.8rem,3vw,2.6rem)] leading-none ${darkMode ? "text-[#F4C842]" : "text-[#1E3D2A]"}`}>
                {centerPlant.name}
              </h1>
              <p className={`font-comic font-bold text-[clamp(0.85rem,1.1vw,1rem)] mt-0.5 ${darkMode ? "text-[#F4C842]" : "text-[#0F3D26]"}`}>· {centerScore}% match</p>
              {isLoggedIn && revealed && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className={`font-comic text-[0.75rem] mt-1 ${darkMode ? "text-white/70" : "text-[#1A6241]/80"}`}
                >
                  Saved to your profile.{" "}
                  <Link href="/profile" className={`underline underline-offset-2 transition-opacity hover:opacity-70 ${darkMode ? "text-[#65F0CD]" : "text-[#1A6241]"}`}>
                    View it →
                  </Link>
                </motion.p>
              )}
            </div>

            {/* ── Desktop (lg+): two-column ── */}
            <div className="hidden lg:flex flex-1 min-h-0 w-full">

              {/* LEFT: overlapping plants + names + score bars */}
              <div className="flex flex-col flex-1 min-h-0 items-center justify-end">

                {(() => {
                  const leighton = centerPlant?.id === 35 || centerPlant?.id === 20;
                  return (
                    <div className="flex items-end justify-center w-full"
                      style={{ paddingBottom: "clamp(16px,4vh,48px)" }}>
                      <div className="flex-shrink-0" style={{ zIndex: leighton ? 20 : 10, marginRight: "clamp(-40px,-3vw,-20px)" }}>
                        <DesktopPlantCard plant={leftPlant} score={leftScore} revealed={revealed} traitName={traitName} nameDelay={0.4} hidePills onClick={() => { setTappedPlant(leftPlant); setHasDiscoveredPlant(true); }} darkMode={darkMode} />
                      </div>
                      <div className="flex-shrink-0" style={{ zIndex: leighton ? 10 : 20 }}>
                        <DesktopPlantCard plant={centerPlant} score={centerScore} revealed={revealed} traitName={traitName} nameDelay={0.2} isCenter isTopPick hidePills pulse={!hasDiscoveredPlant} onClick={() => { setTappedPlant(centerPlant); setHasDiscoveredPlant(true); }} darkMode={darkMode} />
                      </div>
                      <div className="flex-shrink-0" style={{ zIndex: leighton ? 20 : 10, marginLeft: "clamp(-40px,-3vw,-20px)" }}>
                        <DesktopPlantCard plant={rightPlant} score={rightScore} revealed={revealed} traitName={traitName} nameDelay={0.55} hidePills onClick={() => { setTappedPlant(rightPlant); setHasDiscoveredPlant(true); }} darkMode={darkMode} />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* RIGHT: why text + best plant's trait pills + comparison + retake */}
              <div className="flex flex-col justify-end w-[540px] xl:w-[580px] shrink-0 pl-12 pr-4 pb-12">
                {whyText.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                  >
                    <div className="space-y-4">
                      {whyText.slice(0, 5).map((line, i) => {
                        const dashIdx = line.indexOf(" - ");
                        const before = dashIdx !== -1 ? line.slice(0, dashIdx) : line;
                        const after  = dashIdx !== -1 ? line.slice(dashIdx + 3) : null;
                        return (
                          <div key={i}>
                            <p className={`font-comic text-[0.78rem] leading-snug ${darkMode ? "text-white/42" : "text-[#1A6241]/50"}`}>
                              {before}
                            </p>
                            {after && (
                              <p className={`font-comic text-[0.9rem] leading-snug font-semibold mt-1 ${darkMode ? "text-[#65F0CD]" : "text-[#0F3D26]"}`}>
                                {after}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
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

            {/* Desktop horizontal Play & Win footer */}
            <PlayAndWinCard darkMode={darkMode} horizontal className="hidden lg:block w-full shrink-0 mb-4" delay={0.8} onAuthSuccess={() => saveTopPlant(centerPlant, centerScore)} />

            {/* ── Tablet (sm–lg): center hero + two side plants ── */}
            <div className="hidden sm:flex lg:hidden flex-col items-center w-full mt-6 pb-8 gap-6">

              <button type="button" onClick={() => setTappedPlant(centerPlant)} className={`flex flex-col items-center transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "150ms" }}>
                <p className={`font-heading text-3xl leading-tight ${darkMode ? "text-[#65F0CD]" : "text-[#1A3A0A]"}`}>{centerPlant.name}</p>
                <div className="w-[180px] mt-1.5">
                  <div className="flex justify-between mb-0.5">
                    <span className="font-comic text-[11px] font-bold text-[#F4C842]">{centerScore}% match</span>
                  </div>
                  <div className={`h-[10px] w-full max-w-[120px] rounded-full ${darkMode ? "bg-white/10" : "bg-[#3A5A20]/12"}`}>
                    <div className="h-full rounded-full bg-[#F4C842]" style={{ width: `${centerScore}%` }} />
                  </div>
                </div>
                <div className="relative mt-4">
                  <img src={centerPlant.image} alt={centerPlant.name} className="h-[42vh] w-auto object-contain" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="pill-pulse inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full border font-comic font-semibold" style={{ fontSize: "12px", color: darkMode ? "#65F0CD" : "#1A6241", borderColor: darkMode ? "rgba(101,240,205,0.5)" : "rgba(26,98,65,0.5)", background: darkMode ? "rgba(15,10,40,0.55)" : "rgba(255,255,255,0.6)", backdropFilter: "blur(4px)" }}>explore</span>
                  </div>
                </div>
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
                      <div className="relative mt-3">
                        <img src={plant.image} alt={plant.name} className="h-[28vh] w-auto object-contain" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="pill-pulse inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full border font-comic font-semibold" style={{ fontSize: "12px", color: darkMode ? "#65F0CD" : "#1A6241", borderColor: darkMode ? "rgba(101,240,205,0.5)" : "rgba(26,98,65,0.5)", background: darkMode ? "rgba(15,10,40,0.55)" : "rgba(255,255,255,0.6)", backdropFilter: "blur(4px)" }}>explore</span>
                        </div>
                      </div>
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
                      onClick={() => { setTappedPlant(plant); setHasDiscoveredPlant(true); }}
                    >
                      <p className={`font-heading text-2xl leading-tight ${darkMode ? "text-[#65F0CD]" : "text-[#1A3A0A]"}`}>{plant.name}</p>
                      <div className="relative mt-4">
                        <img
                          src={plant.image}
                          alt={plant.name}
                          className={`h-[340px] w-auto object-contain${!hasDiscoveredPlant ? (i === 0 ? (darkMode ? " plant-pulse" : " plant-pulse-light") : (darkMode ? " plant-pulse-secondary" : " plant-pulse-secondary-light")) : ""}`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="pill-pulse inline-flex items-center gap-1 px-4 py-1.5 rounded-full border-2 font-comic font-semibold" style={{ fontSize: "15px", color: darkMode ? "#65F0CD" : "#ffffff", borderColor: darkMode ? "rgba(101,240,205,0.5)" : "rgba(26,98,65,0.8)", background: darkMode ? "rgba(15,10,40,0.55)" : "#1A6241", backdropFilter: "blur(4px)" }}>explore</span>
                        </div>
                      </div>
                      <div className="w-[180px] mt-2">
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
                    </button>

                    {/* Why text - shown immediately after the best match plant */}
                    {i === 0 && whyText.length > 0 && (
                      <div className="w-full px-4 space-y-4 -mt-2">
                        {whyText.slice(0, 5).map((line, j) => (
                          <WhyTextLine key={j} line={line} darkMode={darkMode} className="font-comic text-[0.9rem] text-center" />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

            </div>


            {/* ── Retake quiz + Play & Win: tablet + mobile only ── */}
            <button
              onClick={() => router.push("/quiz")}
              className={`lg:hidden shrink-0 font-comic text-sm sm:text-base font-bold uppercase tracking-widest underline underline-offset-4 transition-opacity hover:opacity-80 mt-10 sm:mt-8 mb-12 ${darkMode ? "text-[#65F0CD]" : "text-[#1A6241]"}`}
            >
              ↩ Retake quiz
            </button>

            {/* Divider */}
            <div className={`lg:hidden w-full px-4 sm:px-6 mb-12`}>
              <div className={`w-full h-px ${darkMode ? "bg-white/10" : "bg-[#1E3D2A]/12"}`} />
            </div>

            <div className="lg:hidden w-full mb-12 px-4 sm:px-6">
              <PlayAndWinCard darkMode={darkMode} delay={0.5} onAuthSuccess={() => saveTopPlant(centerPlant, centerScore)} />
            </div>

          </div>
        )}
      </div>

      {/* ── Plant detail: bottom sheet on mobile/tablet, slide-in drawer on desktop ── */}
      <AnimatePresence>
        {tappedPlant && (
          <>
            {/* Backdrop - dark overlay on desktop, transparent on mobile (bottom sheet covers it) */}
            <motion.div
              className="fixed inset-0 z-40 bg-transparent lg:bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setTappedPlant(null)}
            />

            {/* Mobile + tablet: bottom sheet */}
            <motion.div
              className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden rounded-t-3xl overflow-hidden ${darkMode ? "bg-[#210E4A]" : "bg-[#1E3D2A]"}`}
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
                  className="absolute top-3 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-[#65F0CD] text-[#210E4A] hover:scale-110 transition-all duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M1 1l12 12M13 1L1 13"/>
                  </svg>
                </button>
              </div>
              <div className="px-4 pt-2 pb-1">
                <img
                  src={tappedPlant.image.replace(".webp", "-rightPanel.webp")}
                  alt={tappedPlant.name}
                  loading="lazy"
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
              className={`fixed top-0 right-0 h-full z-50 hidden lg:flex flex-col border-l border-white/10 overflow-hidden ${darkMode ? "bg-[#210E4A]" : "bg-[#1E3D2A]"}`}
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
                  loading="lazy"
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

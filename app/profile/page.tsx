"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";
import plants from "../../data/plants.json";
import { Plant } from "../../types";

interface ScoreRow {
  score: number;
  badge_earned: "bronze" | "silver" | "gold";
  created_at: string;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  badge: string | null;
  matched_plant: string | null;
  match_pct: number | null;
}

const BADGE_COLOR: Record<string, string> = {
  gold:   "#F4C842",
  silver: "#C8DCF0",
  bronze: "#FF9A30",
};

const BADGE_GLOW: Record<string, string> = {
  gold:   "rgba(244,200,66,0.55)",
  silver: "rgba(180,210,240,0.65)",
  bronze: "rgba(240,144,64,0.6)",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    + " · "
    + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function BadgeImg({ badge, size = "h-10" }: { badge: string; size?: string }) {
  return (
    <div className={`relative rounded-full bg-[#1E3D2A]/10 p-1 flex items-center justify-center`}>
      <img src={`/images/${badge}-badge.svg`} alt={badge} className={`${size} w-auto`} />
    </div>
  );
}

export default function ProfilePage() {
  const { darkMode } = useContext(DarkModeContext);
  const router = useRouter();

  const [profile, setProfile]   = useState<UserProfile | null>(null);
  const [scores, setScores]     = useState<ScoreRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showAll, setShowAll]   = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.replace("/"); return; }
    const { token } = JSON.parse(stored);
    if (!token) { router.replace("/"); return; }

    const api     = process.env.NEXT_PUBLIC_API_URL;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${api}/user/me`,      { headers }).then(r => r.json()),
      fetch(`${api}/play/scores`,  { headers }).then(r => r.json()),
    ]).then(([profileData, scoresData]) => {
      setProfile(profileData.user   ?? null);
      setScores(scoresData.scores   ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const matchedPlant = profile?.matched_plant
    ? (plants as Plant[]).find(p => p.name === profile.matched_plant) ?? null
    : null;

  const totalPlays = scores.length;
  const avgScore   = totalPlays > 0
    ? (scores.reduce((s, r) => s + r.score, 0) / totalPlays).toFixed(1)
    : null;
  const bestScore  = totalPlays > 0 ? Math.max(...scores.map(r => r.score)) : null;
  // scores already arrive sorted by date desc from the backend
  const displayed = showAll ? scores : scores.slice(0, 4);

  const bg      = darkMode ? "bg-gradient-to-b from-[#210E4A] to-[#5A1B27]" : "bg-gradient-to-b from-[#F4FBF0] to-[#D4EDE1]";
  const card    = darkMode ? "bg-white/[0.06] border border-white/10"        : "bg-white border border-[#1E3D2A]/12";
  const divider = darkMode ? "bg-white/10"                                   : "bg-[#1E3D2A]/10";
  const sub     = darkMode ? "text-white/45"  : "text-[#1E3D2A]/50";
  const body    = darkMode ? "text-white/80"  : "text-[#1E3D2A]/80";
  const heading = darkMode ? "text-[#65F0CD]" : "text-[#1E3D2A]";

  return (
    <div className={`min-h-screen flex flex-col ${bg}`}>
      <Navbar />

      {loading && (
        <p className={`text-center font-heading text-xl animate-pulse mt-40 ${sub}`}>Loading…</p>
      )}

      {!loading && profile && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

          {/* ── Hero ── */}
          <div className="relative w-full overflow-hidden" style={{ minHeight: 220 }}>
            {matchedPlant && (
              <img src={matchedPlant.image} alt="" aria-hidden
                className="absolute inset-0 w-full h-full object-cover object-center scale-125 blur-2xl opacity-20 pointer-events-none"
              />
            )}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: darkMode
                ? "linear-gradient(to bottom, rgba(33,14,74,0.4) 0%, rgba(33,14,74,1) 100%)"
                : "linear-gradient(to bottom, rgba(244,251,240,0.4) 0%, rgba(244,251,240,1) 100%)",
            }} />
            <div className="relative px-6 sm:px-12 pt-28 pb-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
                <p className={`font-comic text-xs uppercase tracking-widest mb-1 ${sub}`}>Your profile</p>
                <h1 className={`font-heading leading-none ${heading}`} style={{ fontSize: "clamp(2rem,5vw,3.2rem)" }}>
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className={`font-comic text-sm mt-1 ${sub}`}>{profile.email}</p>
              </motion.div>
            </div>
          </div>

          {/* ── Two cards + badge strip, all same container ── */}
          <div className="flex flex-col gap-6 px-4 sm:px-10 pb-16 max-w-4xl mx-auto w-full">

          {/* Badge + Stats combined strip */}
          {profile.badge && totalPlays > 0 && (
            <motion.div
              className="rounded-2xl overflow-hidden"
              style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "#1E3D2A", border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "none" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <div className="flex items-center gap-5 px-6 py-4 flex-wrap sm:flex-nowrap">

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex items-center justify-center shrink-0"
                >
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.65, 0.35] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-14 h-14 rounded-full blur-xl"
                    style={{ background: BADGE_GLOW[profile.badge] }}
                  />
                  <img src={`/images/${profile.badge}-badge.svg`} alt={profile.badge}
                    className="relative w-14 h-14 drop-shadow-xl"
                  />
                </motion.div>

                {/* Badge label */}
                <div className="shrink-0">
                  <p className="font-comic text-[0.65rem] uppercase tracking-widest text-white/50">Best badge</p>
                  <p className="font-heading text-lg" style={{ color: BADGE_COLOR[profile.badge] }}>
                    {profile.badge.charAt(0).toUpperCase() + profile.badge.slice(1)}
                  </p>
                </div>

                <div className="hidden sm:block w-px h-10 shrink-0 bg-white/15" />

                {/* Stats */}
                <div className="flex items-center gap-6 flex-wrap">
                  {[
                    { label: "plays",     value: totalPlays },
                    { label: "avg score", value: avgScore },
                    { label: "best",      value: `${bestScore}/10` },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="font-heading text-xl leading-none text-white/90">{s.value}</span>
                      <span className="font-comic text-[0.65rem] uppercase tracking-widest mt-0.5 text-white/45">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Two cards side by side ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Plant match */}
            <motion.div
              className="rounded-2xl overflow-hidden h-full"
              style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "#1E3D2A", border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "none" }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.4 }}>
              <div className="h-1 w-full bg-[#65F0CD]" />
              <div className="p-6 sm:p-8">
                <p className="font-comic text-xs uppercase tracking-widest mb-4 text-white/45">Your perfect plant</p>
                {matchedPlant ? (
                  <>
                    <div className="flex flex-col items-center text-center gap-4">
                      <img src={matchedPlant.image} alt={matchedPlant.name}
                        className="h-56 w-auto object-contain" />
                      <div>
                        <h2 className="font-heading text-3xl leading-tight text-[#65F0CD]">{matchedPlant.name}</h2>
                        {profile.match_pct != null && (
                          <p className="font-comic font-bold text-[#F4C842] text-base mt-1">{profile.match_pct}% match</p>
                        )}
                        <p className="font-comic text-sm leading-relaxed mt-3 text-white/75">{matchedPlant.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-5 border-t flex-wrap gap-3"
                      style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                      <Link href="/quiz"
                        className="font-comic text-xs underline underline-offset-4 opacity-45 hover:opacity-80 transition-opacity text-white">
                        Retake quiz
                      </Link>
                      <Link href="/results"
                        className="px-5 py-2 border-2 rounded-full font-heading text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 border-[#65F0CD] text-[#65F0CD] hover:bg-[#65F0CD]/10">
                        View full results →
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center py-6 gap-4">
                    <p className="font-comic text-sm text-white/45">You haven't taken the Plant Match quiz yet.</p>
                    <Link href="/quiz"
                      className="px-6 py-2.5 border-2 rounded-full font-heading text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 border-[#65F0CD] text-[#65F0CD] hover:bg-[#65F0CD]/10">
                      Find my plant
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Badge history */}
            <motion.div
              className="rounded-2xl overflow-hidden h-full"
              style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "#1E3D2A", border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "none" }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.5 }}>
              <div className="h-1 w-full bg-[#F4C842]" />
              <div className="p-6 sm:p-8">
                <p className="font-comic text-xs uppercase tracking-widest mb-4 text-white/45">Play & Win history</p>

                {totalPlays === 0 ? (
                  <div className="flex flex-col items-center py-6 gap-4">
                    <p className="font-comic text-sm text-white/45">No badge quiz results yet.</p>
                    <Link href="/quiz/badge"
                      className="px-6 py-2.5 border-2 rounded-full font-heading text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 border-[#F4C842] text-[#F4C842] hover:bg-[#F4C842]/10">
                      Play now
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-3">
                      {displayed.map((row, i) => (
                        <motion.div key={`${row.created_at}-${i}`}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.06]"
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}>
                          <BadgeImg badge={row.badge_earned} />
                          <div className="flex-1 min-w-0">
                            <p className="font-heading text-sm" style={{ color: BADGE_COLOR[row.badge_earned] }}>
                              {row.badge_earned.charAt(0).toUpperCase() + row.badge_earned.slice(1)} Badge
                            </p>
                            <p className="font-comic text-[0.7rem] mt-0.5 text-white/40">{formatDate(row.created_at)}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-heading text-xl text-white/90">{row.score}</p>
                            <p className="font-comic text-[0.65rem] text-white/40">/ 10</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
                      {totalPlays > 4 && (
                        <button onClick={() => setShowAll(v => !v)}
                          className="font-comic text-xs underline underline-offset-4 opacity-45 hover:opacity-80 transition-opacity text-white">
                          {showAll ? "Show recent 4 ↑" : `Show all ${totalPlays} ↓`}
                        </button>
                      )}
                      <Link href="/quiz/badge"
                        className="ml-auto px-5 py-2 border-2 rounded-full font-heading text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 border-[#F4C842] text-[#F4C842] hover:bg-[#F4C842]/10">
                        Play again
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

          </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

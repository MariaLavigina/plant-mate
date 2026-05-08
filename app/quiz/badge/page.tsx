"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { DarkModeContext } from "../../ClientProviders";

export default function BadgeQuiz() {
  const { darkMode } = useContext(DarkModeContext);
  const router = useRouter();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode
        ? "bg-gradient-to-b from-[#210E4A] to-[#5A1B27]"
        : "bg-gradient-to-b from-[#F4FBF0] via-[#F5C6D8] to-[#A75B2B]"
    }`}>
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="flex gap-4 mb-8">
          <img src="/images/bronze-badge.svg" alt="Bronze" className="w-16 h-16 drop-shadow-xl opacity-60" />
          <img src="/images/silver-badge.svg" alt="Silver" className="w-20 h-20 drop-shadow-xl" />
          <img src="/images/gold-badge.svg" alt="Gold" className="w-16 h-16 drop-shadow-xl opacity-60" />
        </div>

        <h1 className={`font-caveat text-5xl sm:text-6xl font-bold mb-3 ${
          darkMode ? "text-[#65F0CD]" : "text-[#2D6A4F]"
        }`}>
          Coming Soon!
        </h1>

        <p className={`font-comic text-base sm:text-lg max-w-sm leading-relaxed mb-2 ${
          darkMode ? "text-white/70" : "text-[#1E3D2A]/70"
        }`}>
          The badge quiz is being planted. 🌱
        </p>
        <p className={`font-comic text-sm max-w-xs leading-relaxed mb-10 ${
          darkMode ? "text-white/45" : "text-[#1E3D2A]/45"
        }`}>
          Check back soon to earn your Bronze, Silver, or Gold badge!
        </p>

        <button
          onClick={() => router.back()}
          className={`font-comic text-sm uppercase tracking-widest underline underline-offset-4 transition-opacity opacity-70 hover:opacity-100 ${
            darkMode ? "text-white" : "text-[#1E3D2A]"
          }`}
        >
          ↩ Go back
        </button>
      </div>
    </div>
  );
}

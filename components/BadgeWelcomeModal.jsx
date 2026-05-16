"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { DarkModeContext } from "../app/ClientProviders";

const QUIZ_INFO = [
  { icon: "⚡", text: "5 seconds per question - quick and fun!" },
  { icon: "✅", text: "Instant feedback for every answer" },
  { icon: "🌱", text: "No pressure - it's about learning and having fun!" },
  { icon: "📊", text: "Track your progress in your profile" },
  { icon: "🏆", text: "Collect all badges to become a PlantMate+ master!" },
];

export default function BadgeWelcomeModal({ user, onClose }) {
  const { darkMode } = useContext(DarkModeContext);
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden ${
          darkMode ? "bg-[#210E4A] text-white" : "bg-white text-[#1E3D2A]"
        }`}
        style={{
          boxShadow: darkMode
            ? "0 24px 60px rgba(101,240,205,0.15), 0 8px 32px rgba(0,0,0,0.5)"
            : "0 24px 60px rgba(30,61,42,0.12), 0 12px 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* Top accent bar */}
        <div className={`h-[3px] w-full ${
          darkMode
            ? "bg-gradient-to-r from-[#65F0CD] via-[#4FD4B3] to-[#65F0CD]/40"
            : "bg-gradient-to-r from-[#2D6A4F] via-[#4CAF82] to-[#2D6A4F]/40"
        }`} />

        <div className="p-7">
          {/* Close */}
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all hover:scale-110 active:scale-95 ${
              darkMode
                ? "text-white/30 hover:text-white/80 hover:bg-white/10"
                : "text-[#1E3D2A]/30 hover:text-[#1E3D2A]/80 hover:bg-[#1E3D2A]/10"
            }`}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Eyebrow */}
          <p className={`font-comic text-xs uppercase tracking-widest mb-2 ${
            darkMode ? "text-[#65F0CD]/60" : "text-[#2D6A4F]/60"
          }`}>
            🏆 Badge Quiz
          </p>

          {/* Welcome heading */}
          <h2 className={`font-caveat text-4xl font-bold leading-tight mb-1 ${
            darkMode ? "text-[#65F0CD]" : "text-[#2D6A4F]"
          }`}>
            Welcome, {user?.name || "Plant Lover"}!
          </h2>

          <p className={`font-comic text-sm mb-4 ${
            darkMode ? "text-white/70" : "text-[#1E3D2A]/70"
          }`}>
            Ready to play &amp; grow your plant knowledge?
          </p>

          {/* Description */}
          <p className={`font-comic text-sm leading-relaxed mb-5 ${
            darkMode ? "text-white/60" : "text-[#1E3D2A]/60"
          }`}>
            Answer 10 fun and surprising questions about plants and your care habits. Score points and earn your first badge!
          </p>

          {/* Quiz info box */}
          <div className={`rounded-xl p-4 mb-6 ${
            darkMode ? "bg-white/5 border border-white/8" : "bg-[#2D6A4F]/5 border border-[#2D6A4F]/10"
          }`}>
            <p className={`font-caveat text-lg font-bold mb-3 ${
              darkMode ? "text-white" : "text-[#1E3D2A]"
            }`}>
              Quiz Info:
            </p>
            <div className="space-y-2">
              {QUIZ_INFO.map(({ icon, text }, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-sm mt-0.5 shrink-0">{icon}</span>
                  <p className={`font-comic text-xs leading-relaxed ${
                    darkMode ? "text-white/70" : "text-[#1E3D2A]/70"
                  }`}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => { onClose(); router.push("/quiz/badge"); }}
            className={`w-full py-3 rounded-full font-bold text-base border-2 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl ${
              darkMode
                ? "bg-[#65F0CD] border-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3] hover:border-[#4FD4B3] hover:shadow-[#65F0CD]/30"
                : "bg-[#2D6A4F] border-[#2D6A4F] text-[#F4FBF0] hover:bg-[#1E3D2A] hover:border-[#1E3D2A] hover:shadow-[#2D6A4F]/40"
            }`}
          >
            🚀 Start Quiz →
          </button>
        </div>
      </div>
    </div>
  );
}

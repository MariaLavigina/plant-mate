"use client"
import { useEffect } from "react";

export default function HotspotPopup({ hotspot, onClose, darkMode }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!hotspot) return null;

  // Mobile: centered modal with backdrop
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative max-w-md w-full p-6 rounded-2xl shadow-2xl border-2 transform transition-all duration-300 scale-100
          ${
            darkMode
              ? "bg-[#210E4A]/95 border-[#65F0CD]/30 text-white"
              : "bg-white/95 border-[#210E4A]/30 text-[#210E4A]"
          }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-2xl
            transition-all duration-200 hover:scale-110 active:scale-95
            ${
              darkMode
                ? "bg-[#65F0CD]/20 hover:bg-[#65F0CD]/40 text-[#65F0CD]"
                : "bg-[#210E4A]/10 hover:bg-[#210E4A]/20 text-[#210E4A]"
            }`}
          aria-label="Close popup"
        >
          ×
        </button>

        <h3 className={`text-2xl font-bold mb-4 pr-8 ${darkMode ? "text-[#65F0CD]" : "text-[#210E4A]"}`}>
          {hotspot.title}
        </h3>

        <p className={`text-base leading-relaxed ${darkMode ? "text-white/90" : "text-[#210E4A]/90"}`}>
          {hotspot.content}
        </p>
      </div>
    </div>
  );
}

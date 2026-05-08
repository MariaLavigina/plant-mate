"use client";
import { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { DarkModeContext } from "../app/ClientProviders";

export default function HotspotPopup({ hotspot, onClose }) {
  const { darkMode } = useContext(DarkModeContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!hotspot) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: darkMode
            ? "0 24px 60px rgba(101,240,205,0.15), 0 8px 32px rgba(0,0,0,0.5)"
            : "0 24px 60px rgba(30,61,42,0.12), 0 12px 40px rgba(0,0,0,0.18)",
        }}
        className={`relative w-full max-w-sm rounded-2xl overflow-hidden backdrop-blur-xl ${
          darkMode ? "bg-[#1A0B3B]/97" : "bg-white/97"
        }`}
      >
        {/* Top accent bar */}
        <div className={`h-[3px] w-full ${
          darkMode
            ? "bg-gradient-to-r from-[#65F0CD] via-[#4FD4B3] to-[#65F0CD]/40"
            : "bg-gradient-to-r from-[#2D6A4F] via-[#4CAF82] to-[#2D6A4F]/40"
        }`} />

        <div className="p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
              darkMode
                ? "text-white/30 hover:text-white/80 hover:bg-white/10"
                : "text-[#1E3D2A]/30 hover:text-[#1E3D2A]/80 hover:bg-[#1E3D2A]/10"
            }`}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Title */}
          <h3 className={`font-caveat text-3xl font-bold mb-1 pr-8 leading-tight ${
            darkMode ? "text-[#65F0CD]" : "text-[#2D6A4F]"
          }`}>
            {hotspot.title}
          </h3>

          {/* Accent line */}
          <div className={`w-8 h-[2px] rounded-full mb-4 ${
            darkMode ? "bg-[#65F0CD]/35" : "bg-[#2D6A4F]/30"
          }`} />

          {/* Content */}
          <p className={`font-comic text-base leading-relaxed ${
            darkMode ? "text-white/75" : "text-[#1E3D2A]/75"
          }`}>
            {hotspot.content}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

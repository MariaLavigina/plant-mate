"use client";
import { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../app/ClientProviders";

export default function DesktopHotspotPopup({ hotspot, onClose, position }) {
  const { darkMode } = useContext(DarkModeContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  if (!hotspot) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform: "translate(-50%, calc(-100% - 18px))",
        zIndex: 40,
        boxShadow: darkMode
          ? "0 24px 60px rgba(101,240,205,0.10), 0 8px 32px rgba(0,0,0,0.45)"
          : "0 24px 60px rgba(30,61,42,0.10), 0 8px 32px rgba(0,0,0,0.12)",
      }}
      className={`w-72 xl:w-80 rounded-2xl overflow-hidden transition-all duration-300 ease-out backdrop-blur-xl ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      } ${darkMode ? "bg-[#1A0B3B]/97" : "bg-white/97"}`}
    >
      {/* Top accent bar */}
      <div className={`h-[3px] w-full ${
        darkMode
          ? "bg-gradient-to-r from-[#65F0CD] via-[#4FD4B3] to-[#65F0CD]/40"
          : "bg-gradient-to-r from-[#2D6A4F] via-[#4CAF82] to-[#2D6A4F]/40"
      }`} />

      <div className="p-5 xl:p-6">
        {/* Close */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-200 hover:scale-110 ${
            darkMode
              ? "text-white/30 hover:text-white/80 hover:bg-white/10"
              : "text-[#1E3D2A]/30 hover:text-[#1E3D2A]/80 hover:bg-[#1E3D2A]/10"
          }`}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Title */}
        <h3 className={`font-caveat text-2xl xl:text-3xl font-bold mb-1 pr-6 leading-tight ${
          darkMode ? "text-[#65F0CD]" : "text-[#2D6A4F]"
        }`}>
          {hotspot.title}
        </h3>

        {/* Accent line */}
        <div className={`w-8 h-[2px] rounded-full mb-3 ${
          darkMode ? "bg-[#65F0CD]/35" : "bg-[#2D6A4F]/30"
        }`} />

        {/* Content */}
        <p className={`font-comic text-sm xl:text-base leading-relaxed ${
          darkMode ? "text-white/70" : "text-[#1E3D2A]/70"
        }`}>
          {hotspot.content}
        </p>
      </div>

      {/* Arrow pointing to hotspot */}
      <div
        style={{
          position: "absolute",
          bottom: -7,
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          width: 14,
          height: 14,
          backgroundColor: darkMode ? "rgba(26,11,59,0.97)" : "rgba(255,255,255,0.97)",
        }}
      />
    </div>
  );
}

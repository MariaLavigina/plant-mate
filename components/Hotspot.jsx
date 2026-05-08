"use client";
import { useContext } from "react";
import { DarkModeContext } from "../app/ClientProviders";

export default function Hotspot({ position, onClick, isHidden }) {
  const { darkMode } = useContext(DarkModeContext);

  if (isHidden) return null;

  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -50%)",
      }}
      className="group relative w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center z-30 transition-transform duration-300 hover:scale-125 active:scale-95"
      aria-label="View plant information"
    >
      {/* Pulsing outer ring */}
      <span
        className={`absolute inset-0 rounded-full animate-ping opacity-50 ${darkMode ? "bg-[#65F0CD]" : "bg-[#2D6A4F]"}`}
      />
      {/* Static ring */}
      <span
        className={`absolute inset-0 rounded-full opacity-30 ${darkMode ? "bg-[#65F0CD]" : "bg-[#2D6A4F]"}`}
      />
      {/* Inner dot */}
      <span
        className={`relative w-3 h-3 lg:w-3.5 lg:h-3.5 rounded-full shadow-lg ${darkMode ? "bg-[#65F0CD]" : "bg-[#2D6A4F]"}`}
      />
    </button>
  );
}

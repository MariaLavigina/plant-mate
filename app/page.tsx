// app/page.tsx
"use client"; // still needed because you use useContext

import { useContext } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { DarkModeContext } from "./ClientProviders"; 

export default function Home() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const router = useRouter();

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-b from-[#210E4A] to-[#5A1B27]"
          : "bg-gradient-to-b from-[#A75B2B] to-white"
      }`}
    >
      {/* Navbar */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Desktop Layout */}
      <div className="hidden md:flex relative px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-36 flex-row items-center justify-center min-h-[calc(100vh-64px)] pt-0">
        {/* Text Container */}
        <div className="flex flex-col justify-center w-1/3 pr-6 z-10">
          <div className="max-w-md">
            <h1
              className={`font-heading mb-4 leading-snug drop-shadow-lg text-[clamp(2rem,5vw,5rem)] ${
                darkMode ? "text-white" : "text-[#2B0707]"
              }`}
            >
              PlantMate+
            </h1>

            <p
              className={`font-sans mb-3 leading-relaxed drop-shadow-md text-[clamp(0.875rem,2vw,1.25rem)] ${
                darkMode ? "text-white" : "text-[#2B0707]"
              }`}
            >
              PlantMate matches you with plants that fit your lifestyle, personality, and home. No guilt. No guesswork. Just
              plants you'll actually keep alive.
            </p>

            <p
              className={`font-sans mb-6 leading-relaxed drop-shadow-md text-[clamp(0.875rem,2vw,1.25rem)] ${
                darkMode ? "text-white" : "text-[#2B0707]"
              }`}
            >
              Take our quick quiz and meet your perfect plant match.
            </p>

            <button
              onClick={() => router.push("/quiz")}
              className={`px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 border-2 font-bold rounded-full transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-md text-[clamp(0.875rem,1.5vw,1.25rem)] ${
                darkMode
                  ? "bg-[#20083D]/50 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-[#20083D]"
                  : "bg-white/50 border-[#2B0707] text-[#2B0707] hover:bg-[#2B0707] hover:text-white"
              }`}
            >
              Find Your Plant Match
            </button>
          </div>
        </div>

        {/* SVG Image */}
        <div className="flex-1 flex justify-end items-end z-0 pointer-events-none">
          <img
            src={
              darkMode
                ? "/images/desktop-images/plants-dark-mode.svg"
                : "/images/desktop-images/plants-light-mode.svg"
            }
            alt="Plants"
            className="h-auto w-auto max-w-[105%] object-contain transition-all duration-500"
          />
        </div>
      </div>

      {/* Mobile version */}
      <div className="md:hidden relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl mb-6 mt-10 text-white">
          PlantMate+
        </h1>

        <p className="font-sans text-lg sm:text-xl lg:text-2xl mb-8 text-white">
          PlantMate matches you with plants that fit your lifestyle, personality, and home. No guilt. No guesswork. Just
          plants you'll actually keep alive. Take our quick quiz and meet your perfect plant match.
        </p>
      </div>

      {/* Mobile image at bottom */}
      <div className="block md:hidden absolute bottom-0 left-0 right-0">
        <img
          src={
            darkMode
              ? "/images/mobile-images/plant-dark-mobile.svg"
              : "/images/mobile-images/plant-light-mobile.svg"
          }
          alt="Plants"
          className="w-full scale-90 origin-bottom plant-hover-animation"
        />

        <button
          onClick={() => router.push("/quiz")}
          className={`absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] px-6 py-5 text-lg border-2 font-semibold rounded-full transition-all duration-300 shadow-2xl whitespace-nowrap backdrop-blur-md ${
            darkMode
              ? "bg-[#20083D]/40 border-[#65F0CD] text-[#65F0CD] hover:bg-[#65F0CD]/80 hover:text-[#20083D]"
              : "bg-white/30 border-[#210E4A] text-[#210E4A] hover:bg-[#210E4A]/80 hover:text-white"
          }`}
        >
          Find Your Plant Match
        </button>
      </div>
    </div>
  );
}
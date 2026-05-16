"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { DarkModeContext } from "./ClientProviders";
import { pageBg, primaryText } from "../lib/styles";

const MOBILE_ANIM_INTERVALS = [350, 330, 300, 250, 200, 150, 110];

const MOBILE_LIGHT_IMAGES = [
  "/images/mobile-images/mobile-lightMode-01.svg",
  "/images/mobile-images/mobile-lightMode-02.svg",
  "/images/mobile-images/mobile-lightMode-03.svg",
  "/images/mobile-images/mobile-lightMode-04.svg",
  "/images/mobile-images/mobile-lightMode-05.svg",
  "/images/mobile-images/mobile-lightMode-06.svg",
  "/images/mobile-images/mobile-lightMode-07.svg",
  "/images/mobile-images/mobile-lightMode-08.svg",
];

const MOBILE_DARK_IMAGES = [
  "/images/mobile-images/mobile-darkMode-01.svg",
  "/images/mobile-images/mobile-darkMode-02.svg",
  "/images/mobile-images/mobile-darkMode-03.svg",
  "/images/mobile-images/mobile-darkMode-04.svg",
  "/images/mobile-images/mobile-darkMode-05.svg",
  "/images/mobile-images/mobile-darkMode-06.svg",
  "/images/mobile-images/mobile-darkMode-07.svg",
  "/images/mobile-images/mobile-darkMode-08.svg",
];

export default function Home() {
  const { darkMode } = useContext(DarkModeContext);
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animIndex, setAnimIndex] = useState(0);

  useEffect(() => { router.prefetch("/quiz"); }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleMobileClick = () => {
    const intervals = MOBILE_ANIM_INTERVALS;
    setIsAnimating(true);
    let t = 0;
    intervals.forEach((ms, i) => {
      t += ms;
      setTimeout(() => setAnimIndex(i + 1), t);
    });
    setTimeout(() => router.push("/quiz"), t + 150);
  };


  return (
    <div className={`relative min-h-screen ${pageBg(darkMode)}`}>
      <Navbar />

      {/* Desktop Layout */}
      <div className="hidden md:flex relative px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-36 flex-row items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="flex flex-col justify-center w-1/3 pr-6 z-10">
          <div className="max-w-md">
            <h1 className={`font-heading mb-4 leading-snug text-[clamp(2rem,5vw,5rem)] ${primaryText(darkMode)}`}>
              PlantMate+
            </h1>

            <p className={`font-sans mb-3 leading-relaxed text-[clamp(1rem,2.2vw,1.4rem)] ${primaryText(darkMode)}`}>
              <span className="font-heading text-[1.4em]">PlantMate+</span> matches you with plants that fit your lifestyle, personality, and home. No guilt. No guesswork. Just plants you'll actually keep alive.
            </p>

            <p className={`font-sans mb-6 leading-relaxed text-[clamp(1rem,2.2vw,1.4rem)] ${primaryText(darkMode)}`}>
              Take our quick quiz and meet your perfect plant match.
            </p>

            <button
              onClick={() => router.push("/quiz")}
              className={`px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 border-2 font-bold rounded-full transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-md text-[clamp(0.875rem,1.5vw,1.25rem)] ${
                darkMode
                  ? "bg-[#20083D]/40 border-[#65F0CD] text-[#65F0CD] hover:bg-[#65F0CD]/80 hover:text-[#20083D]"
                  : "bg-white/30 border-[#1E3D2A] text-[#1E3D2A] hover:bg-[#1E3D2A]/80 hover:text-white"
              }`}
            >
              Find Your Plant Match
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-end items-end z-0">
          <div
            className="relative max-w-[105%]"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <img
              src={darkMode ? "/images/desktop-images/plants-dark-mode.svg" : "/images/desktop-images/heroLightMode-plants.svg"}
              alt="Plants"
              className="h-auto w-full object-contain"
            />
            <img
              src={darkMode ? "/images/desktop-images/hover-darkMode-plantsHero.svg" : "/images/desktop-images/heroLightMode-hover-plants.svg"}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
              style={{
                opacity: isHovering ? 1 : 0,
                maskImage: `radial-gradient(circle 180px at ${mousePos.x}% ${mousePos.y}%, black 30%, transparent 100%)`,
                WebkitMaskImage: `radial-gradient(circle 180px at ${mousePos.x}% ${mousePos.y}%, black 30%, transparent 100%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div
        className="md:hidden relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12"
        style={{ opacity: isAnimating ? 0 : 1, transition: "opacity 0.3s ease-in-out" }}
      >
        <h1 className={`font-heading text-5xl sm:text-6xl lg:text-7xl mb-6 mt-10 ${primaryText(darkMode)}`}>
          PlantMate+
        </h1>
        <p className={`font-sans text-xl sm:text-2xl mb-8 ${primaryText(darkMode)}`}>
          <span className="font-heading text-[1.4em]">PlantMate+</span> matches you with plants that fit your lifestyle, personality, and home. No guilt. No guesswork. Just plants you'll actually keep alive. Take our quick quiz and meet your perfect plant match.
        </p>
      </div>

      <div className="block md:hidden absolute bottom-0 left-0 right-0 overflow-hidden">
        {/* Base image - establishes container height */}
        <img
          src={darkMode ? "/images/mobile-images/plant-dark-mobile.svg" : "/images/mobile-images/plant-light-mobile1.svg"}
          alt="Plants"
          className={`w-full scale-90 origin-bottom ${!isAnimating ? "plant-hover-animation" : ""}`}
          style={{ opacity: isAnimating ? 0 : 1, transition: "opacity 0.3s" }}
        />

        {/* Animation frames */}
        {(darkMode ? MOBILE_DARK_IMAGES : MOBILE_LIGHT_IMAGES).map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute top-0 left-0 w-full scale-110 origin-bottom select-none pointer-events-none"
            style={{
              opacity: isAnimating && i === animIndex ? 1 : 0,
              transition: "none",
            }}
          />
        ))}

        <button
          onClick={handleMobileClick}
          disabled={isAnimating}
          className={`absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] px-6 py-5 text-lg border-2 font-semibold rounded-full transition-all duration-300 shadow-2xl whitespace-nowrap backdrop-blur-md ${
            isAnimating ? "opacity-0 pointer-events-none" : ""
          } ${
            darkMode
              ? "bg-[#20083D]/40 border-[#65F0CD] text-[#65F0CD] hover:bg-[#65F0CD]/80 hover:text-[#20083D]"
              : "bg-white/30 border-[#1E3D2A] text-[#1E3D2A] hover:bg-[#1E3D2A]/80 hover:text-white"
          }`}
        >
          Find Your Plant Match
        </button>
      </div>
    </div>
  );
}

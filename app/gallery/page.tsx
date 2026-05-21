"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { motion } from "motion/react"; //for SVG animations
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";

const LETTERS = "Gallery".split("");

function PlantsDraw() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    fetch("/images/plants.svg")
      .then((r) => r.text())
      .then((svg) => {
        const responsive = svg.replace("<svg", '<svg style="width:100%;height:auto"');
        setSvgContent(responsive);
      });
  }, []);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    if (!document.getElementById("plants-fadein-style")) {
      const style = document.createElement("style");
      style.id = "plants-fadein-style";
      style.textContent = `@keyframes plantsFadeIn { from { opacity: 0; } to { opacity: 1; } }`;
      document.head.appendChild(style);
    }

    const elements = containerRef.current.querySelectorAll(
      "path, circle, rect, ellipse, polygon, polyline"
    );
    elements.forEach((el, i) => {
      const s = (el as SVGElement).style;
      s.opacity = "0";
      s.animation = `plantsFadeIn 0.4s ease-out ${i * 0.005}s forwards`;
    });
  }, [svgContent]);

  return (
    <div
      ref={containerRef}
      className="w-[400px] mx-auto"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export default function Gallery() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-12 ${darkMode ? "bg-[#210E4A]" : "bg-[#F4E5FB]"}`}>
      <Navbar />

      {/* Stacked swiveling SVGs */}
      <div className="relative w-72 h-72">
        <motion.img
          src="/images/flora-outside.svg"
          alt=""
          className="absolute inset-0 w-full h-full"
          animate={{ rotate: 20 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 3, ease: "easeInOut" }}
        />
        <motion.img
          src="/images/flora-inside.svg"
          alt=""
          className="absolute inset-0 w-full h-full"
          animate={{ rotate: -20 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 3, ease: "easeInOut" }}
        />
      </div>

      {/* Wave animation */}
      <svg viewBox="0 0 1898 903" className="w-full" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          fill="#A8F6F3"
          animate={{
            d: [
              "M0 100.046C0 100.046 241.195 381.251 1002.1 132.897C1763 -115.457 1898 60.4376 1898 60.4376L1889.08 902.676H0V100.046Z",
              "M0 60.4376C0 60.4376 241.195 -115.457 1002.1 132.897C1763 381.251 1898 100.046 1898 100.046L1889.08 902.676H0V60.4376Z",
              "M0 100.046C0 100.046 241.195 381.251 1002.1 132.897C1763 -115.457 1898 60.4376 1898 60.4376L1889.08 902.676H0V100.046Z",
            ],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
      </svg>

      {/* Vector - cosmic color cycling with shine */}
      <div className="relative w-48">
        {/* color + glow */}
        <motion.div
          animate={{
            filter: [
              "hue-rotate(0deg)   saturate(100%) brightness(1)   drop-shadow(0 0 18px rgba(197,96,58,0.55))",
              "hue-rotate(60deg)  saturate(140%) brightness(1.15) drop-shadow(0 0 28px rgba(100,220,120,0.75))",
              "hue-rotate(160deg) saturate(120%) brightness(1.05) drop-shadow(0 0 22px rgba(58,180,200,0.65))",
              "hue-rotate(260deg) saturate(150%) brightness(1.15) drop-shadow(0 0 32px rgba(160,80,240,0.85))",
              "hue-rotate(360deg) saturate(100%) brightness(1)   drop-shadow(0 0 18px rgba(197,96,58,0.55))",
            ],
            scale: [1, 1.03, 1, 1.03, 1],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        >
          <img src="/images/Vector.svg" className="w-full" alt="" />
        </motion.div>

        {/* shimmer sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.55) 50%, transparent 75%)",
            mixBlendMode: "screen",
          }}
          animate={{ x: ["-100%", "160%"] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 3 }}
        />
      </div>

      {/* Plants self-draw animation */}
      <PlantsDraw />

      {/* Animated title */}
      <h1 className="flex font-caveat text-[clamp(4rem,12vw,9rem)]">
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: 0,
              color: darkMode ? "#65F0CD" : "#210E4A",
              animation: "letterDrop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
              animationDelay: `${i * 0.08}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </h1>

      <style>{`
        @keyframes letterDrop {
          0%   { opacity: 0; transform: translateY(-40px) rotate(-8deg); }
          60%  { opacity: 1; transform: translateY(6px) rotate(2deg); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

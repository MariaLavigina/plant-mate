"use client";

import { useContext, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";
import { pageBg } from "../../lib/styles";

const TIMELINE = [
  {
    id: 1,
    date: "2014",
    label: "Central Saint Martins",
    text: "Built a foundation in visual thinking, typography, and design systems that informs everything since.",
  },
  {
    id: 2,
    date: "2016",
    label: "National Museum of Scotland",
    text: "Commissioned to create five original illustrations, each two metres tall, for the permanent fashion exhibition. Introduced herself directly to the museum's CEO. The first sketch was accepted without revision.",
  },
  {
    id: 3,
    date: "2023",
    label: "Edinburgh",
    text: "Made a deliberate pivot toward technology - convinced that creativity and coding were not opposites, and determined to find out what she could build.",
  },
  {
    id: 4,
    date: "2023",
    label: "Learning to Code",
    text: "Started from scratch, working through a lifelong belief that coding required a kind of intelligence she didn't have. Three years later, that belief is completely gone.",
  },
  {
    id: 5,
    date: "2023 – Present",
    label: "Postcode Lottery",
    sublabel: "Edinburgh Napier University",
    text: "Working as a junior developer at Postcode Lottery and building full-stack projects from the ground up.",
  },
  {
    id: 6,
    date: "2026",
    label: "PlantMate+",
    text: "Built an app that matches people to plants. Real auth, real database, real UX - and a personality quiz that will tell you, with full confidence, that you are a monstera. Design experience and coding ability, finally in the same room.",
  },
];

export default function About() {
  const { darkMode } = useContext(DarkModeContext);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={`relative min-h-screen overflow-x-hidden ${pageBg(darkMode)}`}>
      <Navbar />

      <div className="flex flex-col items-center min-h-screen pt-16 pb-20 px-6">

        {/* Heading */}
        <motion.h1
          className={`font-heading text-[clamp(2.5rem,5vw,4rem)] mb-1 text-center ${darkMode ? "text-[#65F0CD]" : "text-[#1E3D2A]"}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          About Me
        </motion.h1>

        <motion.p
          className={`font-comic text-center whitespace-nowrap text-[clamp(1rem,1.8vw,1.3rem)] mb-10 ${darkMode ? "text-white/45" : "text-[#1E3D2A]/55"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Designer turned developer. Edinburgh-based. Thinking visually.
        </motion.p>

        {/* DESKTOP TIMELINE (lg+) */}
        <div className="hidden lg:block w-full max-w-6xl relative" style={{ minHeight: "440px" }}>

          {/* The line - draws left to right on scroll */}
          <motion.div
            className={`absolute left-0 right-0 h-[5px] ${darkMode ? "bg-[#FFBD06]" : "bg-[#1E3D2A]"}`}
            style={{ top: "50%", originX: 0 }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />

          <div className="flex items-stretch h-full" style={{ minHeight: "440px" }}>
            {TIMELINE.map((item, i) => {
              const isAbove = i % 2 === 0;
              const isLast = i === TIMELINE.length - 1;
              return (
                <div
                  key={item.id}
                  className="flex-1 relative"
                >

                  {/* Normal flower node */}
                  <div
                    className="absolute w-14 h-14 z-10 cursor-pointer"
                    style={isAbove
                      ? { bottom: "50%", left: "50%", transform: "translateX(-50%) rotate(180deg)" }
                      : { top: "50%", left: "50%", transform: "translateX(-50%)" }
                    }
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <motion.div
                      className="relative w-full h-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 320, damping: 22, delay: i * 0.1 }}
                    >
                      <img src={darkMode ? "/images/desktop-images/aboutMeFlora-darkMode.svg" : "/images/desktop-images/aboutMeFlora-lightMode.svg"} alt="" className="absolute inset-0 w-full h-full transition-opacity duration-300" style={{ opacity: hoveredIndex === i ? 0 : 1 }} />
                    </motion.div>
                  </div>

                  {/* Hover flower - positioned independently so rotation doesn't affect it */}
                  <img
                    src={darkMode ? "/images/desktop-images/aboutMeFlorahover-darkMode.svg" : "/images/desktop-images/aboutMeFlorahover-lightMode.svg"}
                    alt=""
                    className="absolute pointer-events-none transition-opacity duration-300"
                    style={{
                      ...(isAbove
                        ? { bottom: "50%", transform: "translateX(-50%) rotate(180deg)" }
                        : { top: "50%", transform: "translateX(-50%)" }),
                      left: "50%",
                      width: "61px",
                      height: "70px",
                      zIndex: 11,
                      opacity: hoveredIndex === i ? 1 : 0,
                    }}
                  />

                  {/* Text - absolutely positioned above or below the line */}
                  <motion.div
                    className="absolute px-2 text-left cursor-default z-20"
                    style={isAbove
                      ? { bottom: "calc(50% + 62px)", left: "-3rem", right: "-3rem" }
                      : { top: "calc(50% + 62px)", left: "-3rem", right: "-3rem" }
                    }
                    initial={{ opacity: 0, y: isAbove ? 18 : -18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <p className={`font-comic font-semibold text-[clamp(0.6rem,0.7vw,0.72rem)] mb-1 ${darkMode ? "text-[#FFBD06]/60" : "text-[#1E3D2A]/90"}`}>
                      {item.date}
                    </p>
                    <p className={`font-heading text-[clamp(0.88rem,1.15vw,1.1rem)] mb-0.5 ${darkMode ? "text-[#FFBD06]" : "text-[#1E3D2A]"}`}>
                      {item.label}
                    </p>
                    {item.sublabel && (
                      <p className={`font-heading text-[clamp(0.75rem,0.95vw,0.9rem)] mb-2 ${darkMode ? "text-[#FFBD06]/70" : "text-[#1E3D2A]/70"}`}>
                        {item.sublabel}
                      </p>
                    )}
                    <p className={`font-comic text-[clamp(0.85rem,1.1vw,1rem)] leading-snug ${darkMode ? "text-white/50" : "text-[#1E3D2A]/60"}`}>
                      {item.text}
                    </p>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE / TABLET TIMELINE (< lg) */}
        <div className="lg:hidden w-full max-w-md relative pl-10">

          {/* Vertical line - draws top to bottom on scroll */}
          <motion.div
            className={`absolute left-3 top-0 bottom-0 w-[5px] ${darkMode ? "bg-[#FFBD06]" : "bg-[#1E3D2A]"}`}
            style={{ originY: 0 }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />

          <div className="flex flex-col gap-12">
            {TIMELINE.map((item, i) => {
              const isLast = i === TIMELINE.length - 1;
              return (
                <div
                  key={item.id}
                  className="relative flex items-start"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >

                  {/* Node */}
                  <motion.div
                    className="absolute w-14 h-14 shrink-0 z-10" style={{ left: "-53.5px", top: "-8px" }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.1 }}
                  >
                    <img src={darkMode ? "/images/mobile-images/mobile-aboutMe-darkMode.svg" : "/images/mobile-images/mobile-aboutMe-lightMode.svg"} alt="" className="absolute inset-0 w-full h-full transition-opacity duration-300" style={{ opacity: hoveredIndex === i ? 0 : 1 }} />
                    <img src={darkMode ? "/images/mobile-images/mobile-aboutMe-darkMode-hover.svg" : "/images/mobile-images/mobile-aboutMe-lightMode-hover.svg"} alt="" className="absolute w-20 h-20 transition-opacity duration-300" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: hoveredIndex === i ? 1 : 0 }} />
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    className="pl-2"
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                  >
                    <p className={`font-comic font-semibold text-xs mb-0.5 ${darkMode ? "text-[#FFBD06]/60" : "text-[#1E3D2A]/90"}`}>
                      {item.date}
                    </p>
                    <p className={`font-heading text-lg mb-0.5 ${darkMode ? "text-[#FFBD06]" : "text-[#1E3D2A]"}`}>
                      {item.label}
                    </p>
                    {item.sublabel && (
                      <p className={`font-heading text-sm mb-1.5 ${darkMode ? "text-[#FFBD06]/70" : "text-[#1E3D2A]/70"}`}>
                        {item.sublabel}
                      </p>
                    )}
                    <p className={`font-comic text-sm leading-relaxed ${darkMode ? "text-white/50" : "text-[#1E3D2A]/60"}`}>
                      {item.text}
                    </p>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed CTA bar */}
        <div className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-4 px-6 py-3 backdrop-blur-sm border-t ${darkMode ? "bg-[#210E4A]/85 border-white/10" : "bg-white/85 border-[#1E3D2A]/10"}`}>
          <p className={`font-comic text-sm hidden sm:block ${darkMode ? "text-white/45" : "text-[#1E3D2A]/50"}`}>
            Curious what plant matches your personality?
          </p>
          <Link
            href="/quiz"
            className={`font-heading text-sm px-5 py-2 rounded-full transition-all duration-200 ${darkMode ? "bg-[#65F0CD] text-[#210E4A] hover:bg-[#FFBD06]" : "bg-[#1E3D2A] text-white hover:bg-[#FFBD06] hover:text-[#1E3D2A]"}`}
          >
            Take the Quiz
          </Link>
          <Link
            href="/contact"
            className={`font-heading text-sm px-5 py-2 rounded-full border transition-all duration-200 ${darkMode ? "border-[#65F0CD]/40 text-[#65F0CD] hover:border-[#65F0CD]" : "border-[#1E3D2A]/40 text-[#1E3D2A] hover:border-[#1E3D2A]"}`}
          >
            Get in Touch
          </Link>
        </div>

      </div>
    </div>
  );
}

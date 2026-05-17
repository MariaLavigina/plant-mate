"use client";

import { useContext } from "react";
import { motion } from "motion/react";
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";
import { pageBg } from "../../lib/styles";

const TIMELINE = [
  {
    id: 1,
    label: "Central Saint Martins",
    text: "Graduated with a BA in Design from one of the world's most respected art schools in London. Built a foundation in visual thinking, typography, and design systems that informs everything since.",
  },
  {
    id: 2,
    label: "National Museum of Scotland",
    text: "Commissioned to create five original illustrations, each two metres tall, for the permanent fashion exhibition. Introduced herself directly to the museum's CEO. The first sketch was accepted without revision.",
  },
  {
    id: 3,
    label: "Edinburgh",
    text: "Moved to Edinburgh city centre and made a deliberate pivot toward technology - convinced that creativity and coding were not opposites, and determined to find out what she could build.",
  },
  {
    id: 4,
    label: "Learning to Code",
    text: "Started from scratch, working through a lifelong belief that coding required a kind of intelligence she didn't have. Three years later, that belief is completely gone.",
  },
  {
    id: 5,
    label: "Edinburgh Napier University",
    text: "Currently in her third year of a software development degree, working professionally as a junior developer and building full-stack projects from the ground up.",
  },
  {
    id: 6,
    label: "PlantMate+",
    text: "A full-stack plant matching app built to portfolio standard. Real auth, real database, real UX. The project where design experience and coding ability finally meet.",
  },
];

export default function About() {
  const { darkMode } = useContext(DarkModeContext);

  const nodeBase = `w-4 h-4 rounded-full border-2 shrink-0 z-10`;
  const nodeColor = (isLast: boolean) =>
    darkMode
      ? isLast
        ? "border-[#65F0CD] bg-[#65F0CD]"
        : "border-[#65F0CD] bg-[#210E4A]"
      : isLast
      ? "border-[#1E3D2A] bg-[#1E3D2A]"
      : "border-[#1E3D2A] bg-[#F4FBF0]";

  return (
    <div className={`relative min-h-screen ${pageBg(darkMode)}`}>
      <Navbar />

      <div className="flex flex-col items-center min-h-screen pt-28 pb-24 px-6">

        {/* Heading */}
        <motion.h1
          className={`font-heading text-[clamp(2.5rem,5vw,4rem)] mb-3 text-center ${darkMode ? "text-[#65F0CD]" : "text-[#1E3D2A]"}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          About Me
        </motion.h1>

        <motion.p
          className={`font-comic text-center max-w-lg text-[clamp(0.9rem,1.4vw,1.05rem)] mb-20 ${darkMode ? "text-white/45" : "text-[#1E3D2A]/55"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Designer turned developer. Edinburgh-based. Thinking visually, building seriously.
        </motion.p>

        {/* DESKTOP TIMELINE (lg+) */}
        <div className="hidden lg:block w-full max-w-6xl relative" style={{ minHeight: "440px" }}>

          {/* The line - draws left to right on scroll */}
          <motion.div
            className="absolute left-0 right-0 h-[3px] bg-[#FFBD06]"
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
                <div key={item.id} className="flex-1 flex flex-col items-center">

                  {/* Top half - text if isAbove */}
                  <div className="flex-1 flex items-end pb-7 px-3">
                    {isAbove && (
                      <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
                      >
                        <p className={`font-heading text-[clamp(0.78rem,1vw,0.95rem)] mb-2 ${darkMode ? "text-[#65F0CD]" : "text-[#1E3D2A]"}`}>
                          {item.label}
                        </p>
                        <p className={`font-comic text-[clamp(0.68rem,0.8vw,0.82rem)] leading-snug ${darkMode ? "text-white/50" : "text-[#1E3D2A]/60"}`}>
                          {item.text}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Node */}
                  <motion.img
                    src="/images/aboutMeFlora.svg"
                    alt=""
                    className="w-8 h-8 shrink-0 z-10"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 22, delay: i * 0.1 }}
                  />

                  {/* Bottom half - text if !isAbove */}
                  <div className="flex-1 flex items-start pt-7 px-3">
                    {!isAbove && (
                      <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: -18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
                      >
                        <p className={`font-heading text-[clamp(0.78rem,1vw,0.95rem)] mb-2 ${darkMode ? "text-[#65F0CD]" : "text-[#1E3D2A]"}`}>
                          {item.label}
                        </p>
                        <p className={`font-comic text-[clamp(0.68rem,0.8vw,0.82rem)] leading-snug ${darkMode ? "text-white/50" : "text-[#1E3D2A]/60"}`}>
                          {item.text}
                        </p>
                      </motion.div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE / TABLET TIMELINE (< lg) */}
        <div className="lg:hidden w-full max-w-md relative pl-10">

          {/* Vertical line - draws top to bottom on scroll */}
          <motion.div
            className={`absolute left-3 top-0 bottom-0 w-px ${darkMode ? "bg-white/15" : "bg-[#1E3D2A]/15"}`}
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
                <div key={item.id} className="relative flex items-start">

                  {/* Node */}
                  <motion.img
                    src="/images/aboutMeFlora.svg"
                    alt=""
                    className="absolute -left-7 top-1 w-8 h-8 shrink-0 z-10"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.1 }}
                  />

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                  >
                    <p className={`font-heading text-lg mb-1.5 ${darkMode ? "text-[#65F0CD]" : "text-[#1E3D2A]"}`}>
                      {item.label}
                    </p>
                    <p className={`font-comic text-sm leading-relaxed ${darkMode ? "text-white/50" : "text-[#1E3D2A]/60"}`}>
                      {item.text}
                    </p>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

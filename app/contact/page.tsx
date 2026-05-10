"use client";

import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";
import { pageBg, primaryText, primaryButton } from "../../lib/styles";

const IMAGES = [
  "/images/desktop-images/contactMe_01.svg",
  "/images/desktop-images/contactMe_02.svg",
  "/images/desktop-images/contactMe_03.svg",
  "/images/desktop-images/contactMe_04.svg",
  "/images/desktop-images/contactMe_05.svg",
  "/images/desktop-images/contactMe_06.svg",
  "/images/desktop-images/contactMe_07.svg",
];

export default function Contact() {
  const { darkMode } = useContext(DarkModeContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveIndex(1), 1000),
      setTimeout(() => setActiveIndex(2), 1800),
      setTimeout(() => setActiveIndex(3), 2600),
      setTimeout(() => setActiveIndex(4), 3400),
      setTimeout(() => setActiveIndex(5), 4200),
      setTimeout(() => setActiveIndex(6), 5000),
      setTimeout(() => setIsBreathing(true), 5800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`relative min-h-screen ${pageBg(darkMode)}`}>
      <Navbar />

      <div className="flex min-h-screen md:pl-16">
        {/* Left — animated illustration, desktop only */}
        <div
          className="hidden md:block relative w-2/5 overflow-hidden"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePos({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100,
            });
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="absolute inset-0 w-full h-full select-none pointer-events-none"
              style={{
                objectFit: "contain",
                objectPosition: "center",
                opacity: isBreathing ? (i === 5 || i === 6 ? 1 : 0) : i === activeIndex ? 1 : 0,
                zIndex: isBreathing ? (i === 6 ? 6 : i === 5 ? 5 : i) : i === activeIndex ? 10 : i,
                transition: isBreathing
                  ? "none"
                  : i === activeIndex
                  ? "opacity 0.7s ease-in-out"
                  : i === activeIndex - 1
                  ? "opacity 0.7s ease-in-out 0.55s"
                  : "none",
                animationName: isBreathing && i === 6 ? "breathe" : "none",
                animationDuration: "3.5s",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                // start at 40% of cycle so image 7 is already visible when breathing begins
                animationDelay: isBreathing && i === 6 ? "-1.4s" : "0s",
                animationPlayState: isHovering ? "paused" : "running",
              }}
            />
          ))}

          {/* Image 8 — spotlight reveal on hover */}
          <img
            src="/images/desktop-images/contactMe_08-onlyhover.svg"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 w-full h-full select-none pointer-events-none"
            style={{
              objectFit: "contain",
              objectPosition: "center",
              zIndex: 20,
              opacity: isHovering ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              maskImage: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, black 40%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, black 40%, transparent 100%)`,
            }}
          />
        </div>

        {/* Right — contact form */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 pt-24 pb-10 md:py-0">
          <div className="w-full max-w-sm">
            <h1
              className={`text-[clamp(2rem,3vw,2.75rem)] font-caveat mb-2 ${primaryText(darkMode)}`}
            >
              Get in Touch
            </h1>
            <p className={`text-sm mb-8 ${primaryText(darkMode)} opacity-70`}>
              Drop me a message — I&apos;d love to hear from you!
            </p>

            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${primaryText(darkMode)}`}
                >
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:ring-2 transition-all ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-white/40 focus:ring-[#65F0CD]/60"
                      : "bg-white/60 border-[#210E4A]/20 text-[#1E3D2A] placeholder-[#1E3D2A]/40 focus:ring-[#210E4A]/40"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${primaryText(darkMode)}`}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:ring-2 transition-all ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-white/40 focus:ring-[#65F0CD]/60"
                      : "bg-white/60 border-[#210E4A]/20 text-[#1E3D2A] placeholder-[#1E3D2A]/40 focus:ring-[#210E4A]/40"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${primaryText(darkMode)}`}
                >
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:ring-2 transition-all resize-none ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-white/40 focus:ring-[#65F0CD]/60"
                      : "bg-white/60 border-[#210E4A]/20 text-[#1E3D2A] placeholder-[#1E3D2A]/40 focus:ring-[#210E4A]/40"
                  }`}
                />
              </div>

              <button
                type="submit"
                className={`py-3 px-8 rounded-2xl font-semibold text-sm transition-all border-2 ${primaryButton(darkMode)}`}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

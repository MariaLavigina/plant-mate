"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";
import { pageBg, primaryText } from "../../lib/styles";

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
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState({ name: false, email: false, message: false });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "contact",
          name: form.name,
          email: form.email,
          message: form.message,
        }).toString(),
      });
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

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
    <div className={`relative h-screen overflow-hidden ${pageBg(darkMode)}`}>
      <Navbar />

      <div className="flex h-full md:pl-16 max-w-[1400px] mx-auto w-full">
        {/* Left - animated illustration, desktop only */}
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

          {/* Image 8 - spotlight reveal on hover */}
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
              opacity: isHovering && isBreathing ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              maskImage: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, black 40%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, black 40%, transparent 100%)`,
            }}
          />
        </div>

        {/* Right - contact form */}
        <div className="flex-1 flex items-start md:items-center justify-center px-6 sm:px-10 pt-20 pb-4 md:py-0 md:overflow-y-auto md:max-h-full">
          <div className="w-full max-w-md">
            {!submitted && (
              <>
                <h1 className={`text-[clamp(2rem,3vw,2.75rem)] font-caveat mb-2 ${darkMode ? "text-[#00D0FF]" : "text-[#210E4A]"}`}>
                  Get in Touch
                </h1>
              </>
            )}

            {submitted ? (
              <div className="flex flex-col gap-3 py-8">
                <h1 className={`text-[clamp(2.5rem,4vw,3.5rem)] font-caveat leading-tight ${primaryText(darkMode)}`}>
                  Message sent!
                </h1>
                <p className={`text-base ${primaryText(darkMode)} opacity-60`}>
                  Thanks for reaching out. I'll get back to you soon.
                </p>
              </div>
            ) : (
              <form name="contact" data-netlify="true" netlify-honeypot="bot-field" className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input type="hidden" name="form-name" value="contact" />
                <input type="hidden" name="bot-field" />

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-[#00D0FF]" : "text-[#210E4A]"}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
                    onFocus={() => setFocused(s => ({ ...s, name: true }))}
                    onBlur={() => setFocused(s => ({ ...s, name: false }))}
                    className={`w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200 border ${
                      darkMode
                        ? `bg-white/8 text-white placeholder-white/25 ${focused.name ? "border-[#00D0FF] shadow-[0_0_0_2px_rgba(0,208,255,0.15)]" : "border-[#00D0FF]/30"}`
                        : `bg-white/60 text-[#1E3D2A] placeholder-[#1E3D2A]/30 ${focused.name ? "border-[#210E4A] shadow-[0_0_0_2px_rgba(33,14,74,0.15)]" : "border-[#210E4A]/30"}`
                    }`}
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-[#00D0FF]" : "text-[#210E4A]"}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
                    onFocus={() => setFocused(s => ({ ...s, email: true }))}
                    onBlur={() => setFocused(s => ({ ...s, email: false }))}
                    className={`w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200 border ${
                      darkMode
                        ? `bg-white/8 text-white placeholder-white/25 ${focused.email ? "border-[#00D0FF] shadow-[0_0_0_2px_rgba(0,208,255,0.15)]" : "border-[#00D0FF]/30"}`
                        : `bg-white/60 text-[#1E3D2A] placeholder-[#1E3D2A]/30 ${focused.email ? "border-[#210E4A] shadow-[0_0_0_2px_rgba(33,14,74,0.15)]" : "border-[#210E4A]/30"}`
                    }`}
                    placeholder="your@email.com"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-[#00D0FF]" : "text-[#210E4A]"}`}>
                    Message
                  </label>
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={e => setForm(s => ({ ...s, message: e.target.value }))}
                    onFocus={() => setFocused(s => ({ ...s, message: true }))}
                    onBlur={() => setFocused(s => ({ ...s, message: false }))}
                    className={`w-full rounded-lg px-4 py-3 text-sm outline-none resize-none transition-all duration-200 border ${
                      darkMode
                        ? `bg-white/8 text-white placeholder-white/25 ${focused.message ? "border-[#00D0FF] shadow-[0_0_0_2px_rgba(0,208,255,0.15)]" : "border-[#00D0FF]/30"}`
                        : `bg-white/60 text-[#1E3D2A] placeholder-[#1E3D2A]/30 ${focused.message ? "border-[#210E4A] shadow-[0_0_0_2px_rgba(33,14,74,0.15)]" : "border-[#210E4A]/30"}`
                    }`}
                    placeholder="What's on your mind?"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-xs text-center">Something went wrong. Please try again.</p>
                )}

                <div className="flex justify-start mt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`group flex items-center gap-2.5 px-6 py-2 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border-2 ${
                      darkMode
                        ? "bg-white/5 border-[#00D0FF] text-[#00D0FF] hover:bg-[#00D0FF]/15"
                        : "bg-white/5 border-[#210E4A] text-[#210E4A] hover:bg-[#210E4A]/10"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Sending
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

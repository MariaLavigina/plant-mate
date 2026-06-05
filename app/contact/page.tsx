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
    <div className={`relative min-h-screen ${pageBg(darkMode)}`}>
      <Navbar />

      <div className="flex min-h-screen md:pl-16">
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
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 pt-24 pb-10 md:py-0">
          <div className="w-full max-w-md">
            {!submitted && (
              <>
                <h1 className={`text-[clamp(2rem,3vw,2.75rem)] font-caveat mb-2 ${primaryText(darkMode)}`}>
                  Get in Touch
                </h1>
                <p className={`text-sm mb-10 ${primaryText(darkMode)} opacity-60`}>
                  Drop me a message - I&apos;d love to hear from you!
                </p>
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
              <form name="contact" data-netlify="true" netlify-honeypot="bot-field" className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <input type="hidden" name="form-name" value="contact" />
                <input type="hidden" name="bot-field" />

                {/* Name */}
                <div className="relative">
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
                    onFocus={() => setFocused(s => ({ ...s, name: true }))}
                    onBlur={() => setFocused(s => ({ ...s, name: false }))}
                    className={`w-full bg-transparent border-0 border-b-2 pb-2 pt-5 text-sm outline-none transition-all duration-300 ${
                      darkMode
                        ? `text-white ${focused.name ? "border-[#65F0CD]" : "border-white/20"}`
                        : `text-[#1E3D2A] ${focused.name ? "border-[#1E3D2A]" : "border-[#1E3D2A]/25"}`
                    }`}
                  />
                  <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    focused.name || form.name
                      ? `top-0 text-[10px] uppercase tracking-[0.18em] font-semibold ${darkMode ? "text-[#65F0CD]" : "text-[#1E3D2A]/60"}`
                      : `top-5 text-sm ${darkMode ? "text-white/35" : "text-[#1E3D2A]/40"}`
                  }`}>Name</label>
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
                    onFocus={() => setFocused(s => ({ ...s, email: true }))}
                    onBlur={() => setFocused(s => ({ ...s, email: false }))}
                    className={`w-full bg-transparent border-0 border-b-2 pb-2 pt-5 text-sm outline-none transition-all duration-300 ${
                      darkMode
                        ? `text-white ${focused.email ? "border-[#65F0CD]" : "border-white/20"}`
                        : `text-[#1E3D2A] ${focused.email ? "border-[#1E3D2A]" : "border-[#1E3D2A]/25"}`
                    }`}
                  />
                  <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    focused.email || form.email
                      ? `top-0 text-[10px] uppercase tracking-[0.18em] font-semibold ${darkMode ? "text-[#65F0CD]" : "text-[#1E3D2A]/60"}`
                      : `top-5 text-sm ${darkMode ? "text-white/35" : "text-[#1E3D2A]/40"}`
                  }`}>Email</label>
                </div>

                {/* Message */}
                <div className="relative">
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(s => ({ ...s, message: e.target.value }))}
                    onFocus={() => setFocused(s => ({ ...s, message: true }))}
                    onBlur={() => setFocused(s => ({ ...s, message: false }))}
                    className={`w-full bg-transparent border-0 border-b-2 pb-2 pt-5 text-sm outline-none resize-none transition-all duration-300 ${
                      darkMode
                        ? `text-white ${focused.message ? "border-[#65F0CD]" : "border-white/20"}`
                        : `text-[#1E3D2A] ${focused.message ? "border-[#1E3D2A]" : "border-[#1E3D2A]/25"}`
                    }`}
                  />
                  <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    focused.message || form.message
                      ? `top-0 text-[10px] uppercase tracking-[0.18em] font-semibold ${darkMode ? "text-[#65F0CD]" : "text-[#1E3D2A]/60"}`
                      : `top-5 text-sm ${darkMode ? "text-white/35" : "text-[#1E3D2A]/40"}`
                  }`}>Message</label>
                </div>

                {error && (
                  <p className="text-red-400 text-xs text-center -mt-2">Something went wrong. Please try again.</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`mt-2 w-full py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode
                      ? "bg-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3] shadow-[#65F0CD]/20"
                      : "bg-[#1E3D2A] text-white hover:bg-[#2D5A3D] shadow-[#1E3D2A]/20"
                  }`}
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

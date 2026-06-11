"use client";
import { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { DarkModeContext } from "../app/ClientProviders";

export default function RegisterWelcomeAnimation({ userName, onClose }) {
  const { darkMode } = useContext(DarkModeContext);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false); // stays false until images are in memory

  useEffect(() => { setMounted(true); }, []);

  // Preload the right images for the current viewport, then show the animation
  useEffect(() => {
    if (!mounted) return;

    const isMobile = window.innerWidth < 768;
    const srcs = isMobile
      ? ["/images/logIn-floraBaseMobile.svg", "/images/logIn-floraOnTop.svg"]
      : ["/images/logIn-floraBaseDesktop.svg", "/images/logIn-floraOnTop.svg"];

    let loaded = 0;
    const onDone = () => {
      loaded += 1;
      if (loaded === srcs.length) setVisible(true);
    };

    srcs.forEach(src => {
      const img = new Image();
      img.onload = onDone;
      img.onerror = onDone; // show even if a file fails
      img.src = src;
    });
  }, [mounted]);

  // Auto-dismiss after 3.8 s once visible
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 3800);
    return () => clearTimeout(t);
  }, [visible]);

  if (!mounted) return null;

  const backdropStyle = { background: darkMode ? "rgba(33,14,74,0.75)" : "rgba(167,91,43,0.65)" };

  return createPortal(
    <AnimatePresence onExitComplete={onClose}>
      {visible && (
        <>
          {/* ── MOBILE only ── */}
          <motion.div
            className="fixed inset-0 z-[300] md:hidden flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={() => setVisible(false)}
          >
            <div className="absolute inset-0 backdrop-blur-sm" style={backdropStyle} />

            <motion.div
              className="relative z-10 flex flex-col items-center gap-5 px-8"
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ position: "relative", width: "min(280px, 78vw)" }}>
                <img
                  src="/images/logIn-floraBaseMobile.svg"
                  alt=""
                  style={{ width: "100%", display: "block" }}
                />
                <div style={{
                  position: "absolute",
                  left: "48%",
                  top: "52%",
                  width: "45%",
                  transform: "translate(-50%, -50%)",
                }}>
                  <motion.img
                    src="/images/logIn-floraOnTop.svg"
                    alt=""
                    style={{ width: "100%", display: "block" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 7, ease: "linear", repeat: Infinity }}
                  />
                </div>
              </div>

              <div className="text-center">
                <p className={`font-heading font-bold leading-tight ${darkMode ? "text-[#65F0CD]" : "text-[#F4E5FB]"}`}
                  style={{ fontSize: "clamp(1.9rem,7.5vw,2.4rem)" }}>
                  Welcome,
                </p>
                <p className="font-heading font-bold leading-tight text-[#FFBD06]"
                  style={{ fontSize: "clamp(1.9rem,7.5vw,2.4rem)" }}>
                  {userName}!
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── DESKTOP only ── */}
          <motion.div
            className="fixed inset-0 z-[300] hidden md:flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={() => setVisible(false)}
          >
            <div className="absolute inset-0 backdrop-blur-sm" style={backdropStyle} />

            <motion.div
              className="relative z-10 flex flex-col items-center gap-8"
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ position: "relative", width: "min(740px, 65vw)" }}>
                <img
                  src="/images/logIn-floraBaseDesktop.svg"
                  alt=""
                  style={{ width: "100%", display: "block" }}
                />

                {/* big center flower */}
                <div style={{
                  position: "absolute",
                  left: "46.5%",
                  top: "39%",
                  width: "36%",
                  transform: "translate(-50%, -50%)",
                }}>
                  <motion.img
                    src="/images/logIn-floraOnTop.svg"
                    alt=""
                    style={{ width: "100%", display: "block" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 7, ease: "linear", repeat: Infinity }}
                  />
                </div>

                {/* small lower-right flower */}
                <div style={{
                  position: "absolute",
                  left: "58%",
                  top: "68%",
                  width: "14%",
                  transform: "translate(-50%, -50%)",
                }}>
                  <motion.img
                    src="/images/logIn-floraOnTop.svg"
                    alt=""
                    style={{ width: "100%", display: "block" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                  />
                </div>
              </div>

              <div className="text-center">
                <p className={`font-heading font-bold leading-tight ${darkMode ? "text-[#65F0CD]" : "text-[#F4E5FB]"}`}
                  style={{ fontSize: "3rem" }}>
                  Welcome,
                </p>
                <p className="font-heading font-bold leading-tight text-[#FFBD06]"
                  style={{ fontSize: "3rem" }}>
                  {userName}!
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

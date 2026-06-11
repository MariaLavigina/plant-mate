"use client";
import { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { DarkModeContext } from "../app/ClientProviders";

export default function RegisterWelcomeAnimation({ userName, onClose }) {
  const { darkMode } = useContext(DarkModeContext);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3800);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

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
            transition={{ duration: 0.35 }}
            onClick={() => setVisible(false)}
          >
            <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: darkMode ? "rgba(33,14,74,0.75)" : "rgba(167,91,43,0.65)" }}
          />

            <motion.div
              className="relative z-10 flex flex-col items-center gap-5 px-8"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative" style={{ width: 260, height: 320 }}>
                <motion.img
                  src="/images/logIn-floraBaseMobile.svg"
                  alt=""
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  style={{ width: 150 }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                />
                <motion.img
                  src="/images/logIn-floraOnTop.svg"
                  alt=""
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{ width: 240, top: -18 }}
                  initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: 360 }}
                  transition={{
                    opacity: { delay: 0.25, duration: 0.5 },
                    scale:   { delay: 0.25, duration: 0.5, ease: "easeOut" },
                    rotate:  { delay: 0.25, duration: 7, ease: "linear", repeat: Infinity },
                  }}
                />
              </div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, type: "spring", stiffness: 200, damping: 20 }}
              >
                <p className={`font-heading font-bold leading-tight ${darkMode ? "text-[#65F0CD]" : "text-[#F4E5FB]"}`}
                  style={{ fontSize: "clamp(1.9rem,7.5vw,2.4rem)" }}>
                  Welcome,
                </p>
                <p className="font-heading font-bold leading-tight text-[#FFBD06]"
                  style={{ fontSize: "clamp(1.9rem,7.5vw,2.4rem)" }}>
                  {userName}!
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── DESKTOP only ── */}
          <motion.div
            className="fixed inset-0 z-[300] hidden md:flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setVisible(false)}
          >
            <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: darkMode ? "rgba(33,14,74,0.75)" : "rgba(167,91,43,0.65)" }}
          />

            <motion.div
              className="relative z-10 flex flex-col items-center gap-8"
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/*
                log-in-floraBase.svg is 3283×1507.
                Center flower circle sits at x=1493/3283=45.5%, y=588/1507=39%
                floraOnTop is positioned over that exact spot and spins clockwise.
              */}
              <div style={{ position: "relative", width: "min(740px, 65vw)" }}>
                {/* Full desktop plant scene — base layer */}
                <motion.img
                  src="/images/logIn-floraBaseDesktop.svg"
                  alt=""
                  style={{ width: "100%", display: "block" }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.55, ease: "easeOut" }}
                />

                {/* floraOnTop — big center flower */}
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
                    initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                    animate={{ opacity: 1, scale: 1, rotate: 360 }}
                    transition={{
                      opacity: { delay: 0.25, duration: 0.5 },
                      scale:   { delay: 0.25, duration: 0.5, ease: "easeOut" },
                      rotate:  { delay: 0.25, duration: 7, ease: "linear", repeat: Infinity },
                    }}
                  />
                </div>

                {/* floraOnTop — small lower-right flower */}
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
                    initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                    animate={{ opacity: 1, scale: 1, rotate: 360 }}
                    transition={{
                      opacity: { delay: 0.3, duration: 0.5 },
                      scale:   { delay: 0.3, duration: 0.5, ease: "easeOut" },
                      rotate:  { delay: 0.3, duration: 5, ease: "linear", repeat: Infinity },
                    }}
                  />
                </div>
              </div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, type: "spring", stiffness: 200, damping: 20 }}
              >
                <p className={`font-heading font-bold leading-tight ${darkMode ? "text-[#65F0CD]" : "text-[#F4E5FB]"}`}
                  style={{ fontSize: "3rem" }}>
                  Welcome,
                </p>
                <p className="font-heading font-bold leading-tight text-[#FFBD06]"
                  style={{ fontSize: "3rem" }}>
                  {userName}!
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

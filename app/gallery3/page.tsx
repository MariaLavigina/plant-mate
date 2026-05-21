"use client";

import { useContext, useEffect, useState } from "react";
import { motion } from "motion/react";
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";

// ── Desktop paths (2721-wide coordinate space) ────────────────────────────────
const W1_D1 =
  "M0 236.139C0 236.139 248.739 811.258 1360.5 330.399C2472.26 -150.459 2721 35.2825 2721 35.2825V1844.05C2721 1844.05 2407.56 1443.66 1360.5 1844.05C313.444 2244.44 0 1844.05 0 1844.05V236.139Z";
const W1_D2 =
  "M0 35.2825C0 35.2825 248.739 -150.459 1360.5 330.399C2472.26 811.258 2721 236.139 2721 236.139V1844.05C2721 1844.05 2407.56 1443.66 1360.5 1844.05C313.444 2244.44 0 1844.05 0 1844.05V35.2825Z";

const W2_D1 =
  "M0 91.2122C0 91.2122 483.58 296.44 1360.5 91.2122C2237.42 -114.015 2721 91.2122 2721 91.2122V1745.97C2721 1745.97 2237.42 1464.67 1360.5 1745.97C483.58 2027.28 0 1745.97 0 1745.97V91.2122Z";
const W2_D2 =
  "M0 91.2122C0 91.2122 483.58 -114.015 1360.5 91.2122C2237.42 296.44 2721 91.2122 2721 91.2122V1745.97C2721 1745.97 2237.42 1464.67 1360.5 1745.97C483.58 2027.28 0 1745.97 0 1745.97V91.2122Z";

const W3_D1 =
  "M0 116.761C0 116.761 467.736 731.219 1360.5 288.539C2253.26 -154.141 2721 44.3836 2721 44.3836V1802.94C2721 1802.94 2237.42 1521.56 1360.5 1802.94C483.58 2084.32 0 1802.94 0 1802.94L0 116.761Z";
const W3_D2 =
  "M0 44.3836C0 44.3836 467.736 -154.141 1360.5 288.539C2253.26 731.219 2721 116.761 2721 116.761V1802.94C2721 1802.94 2237.42 1521.56 1360.5 1802.94C483.58 2084.32 0 1802.94 0 1802.94L0 44.3836Z";

// ── Mobile paths (400×800 coordinate space, portrait-optimised) ───────────────
const MW1_D1 =
  "M0 200C0 200 100 520 200 200C300 -120 400 80 400 80V800C400 800 300 640 200 800C100 960 0 800 0 800V200Z";
const MW1_D2 =
  "M0 80C0 80 100 -120 200 200C300 520 400 200 400 200V800C400 800 300 640 200 800C100 960 0 800 0 800V80Z";

const MW2_D1 =
  "M0 160C0 160 133 320 200 160C267 0 400 175 400 175V800C400 800 267 640 200 800C133 960 0 800 0 800V160Z";
const MW2_D2 =
  "M0 175C0 175 133 0 200 160C267 320 400 160 400 160V800C400 800 267 640 200 800C133 960 0 800 0 800V175Z";

const MW3_D1 =
  "M0 240C0 240 80 580 200 260C320 -60 400 120 400 120V800C400 800 267 640 200 800C133 960 0 800 0 800V240Z";
const MW3_D2 =
  "M0 120C0 120 80 -60 200 260C320 580 400 240 400 240V800C400 800 267 640 200 800C133 960 0 800 0 800V120Z";


export default function Gallery3() {
  const { darkMode } = useContext(DarkModeContext);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      className={`h-screen overflow-hidden flex flex-col ${darkMode ? "bg-[#210E4A]" : "bg-[#F4E5FB]"}`}
    >
      <Navbar />

      <div className="relative flex-1 overflow-hidden">
        {isMobile ? (
          // ── Mobile: portrait-optimised waves stacked ────────────────────────
          <>
            <svg
              viewBox="0 0 400 800"
              preserveAspectRatio="xMidYMin slice"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="mw1grad" x1="200" y1="0" x2="200" y2="800" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00EEFF" />
                  <stop offset="1" stopColor="#004C5B" />
                </linearGradient>
              </defs>
              <motion.path
                fill="url(#mw1grad)"
                fillOpacity={0.6}
                opacity={0.4}
                animate={{ d: [MW1_D1, MW1_D2, MW1_D1] }}
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              />
            </svg>

            <svg
              viewBox="0 0 400 800"
              preserveAspectRatio="xMidYMin slice"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="mw2grad" x1="0" y1="0" x2="400" y2="800" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00EEFF" />
                  <stop offset="1" stopColor="#015056" />
                </linearGradient>
              </defs>
              <motion.path
                fill="url(#mw2grad)"
                fillOpacity={0.6}
                opacity={0.4}
                animate={{ d: [MW2_D2, MW2_D1, MW2_D2] }}
                transition={{ repeat: Infinity, duration: 13, ease: "easeInOut" }}
              />
            </svg>

            <svg
              viewBox="0 0 400 800"
              preserveAspectRatio="xMidYMin slice"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="mw3grad" x1="200" y1="0" x2="200" y2="800" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00EEFF" />
                  <stop offset="1" stopColor="#004C5B" />
                </linearGradient>
              </defs>
              <motion.path
                fill="url(#mw3grad)"
                fillOpacity={0.6}
                opacity={0.4}
                animate={{ d: [MW3_D1, MW3_D2, MW3_D1] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              />
            </svg>
          </>
        ) : (
          // ── Desktop: full-width centered waves ──────────────────────────────
          <>
            <svg
              viewBox="0 -500 2721 2022"
              preserveAspectRatio="xMidYMin slice"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="w1grad" x1="1360.5" y1="-52.256" x2="1360.5" y2="1874.79" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00EEFF" />
                  <stop offset="1" stopColor="#004C5B" />
                </linearGradient>
              </defs>
              <motion.path
                fill="url(#w1grad)"
                fillOpacity={0.6}
                opacity={0.4}
                animate={{ d: [W1_D1, W1_D2, W1_D1] }}
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              />
            </svg>

            <svg
              viewBox="0 -500 2721 1871"
              preserveAspectRatio="xMidYMin slice"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="w2grad" x1="2674.16" y1="-48.9605" x2="223.016" y2="1543.42" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00EEFF" />
                  <stop offset="1" stopColor="#015056" />
                </linearGradient>
              </defs>
              <motion.path
                fill="url(#w2grad)"
                fillOpacity={0.6}
                opacity={0.4}
                animate={{ d: [W2_D2, W2_D1, W2_D2] }}
                transition={{ repeat: Infinity, duration: 13, ease: "easeInOut" }}
              />
            </svg>

            <svg
              viewBox="0 -500 2721 1928"
              preserveAspectRatio="xMidYMin slice"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="w3grad" x1="1360.5" y1="0" x2="1360.5" y2="1928" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00EEFF" />
                  <stop offset="1" stopColor="#004C5B" />
                </linearGradient>
              </defs>
              <motion.path
                fill="url(#w3grad)"
                fillOpacity={0.6}
                opacity={0.4}
                animate={{ d: [W3_D1, W3_D2, W3_D1] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              />
            </svg>
          </>
        )}

      </div>
    </div>
  );
}

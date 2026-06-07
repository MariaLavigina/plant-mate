"use client";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import AuthModal from "./AuthModal";
import { DarkModeContext } from "../app/ClientProviders";
import { USER_KEY, QUIZ_RESULTS_KEY } from "../lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Me" },
  { href: "/contact", label: "Contact Me" },
];

const MOBILE_LINKS = NAV_LINKS.filter(l => !l.desktopOnly);

function DarkModeIcon({ darkMode }) {
  return darkMode ? (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ) : (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    localStorage.removeItem(USER_KEY);
    const stored = sessionStorage.getItem(USER_KEY);
    if (stored) setUser(JSON.parse(stored));

    const onLogin = () => {
      const s = sessionStorage.getItem(USER_KEY);
      if (s) setUser(JSON.parse(s));
    };
    const onLogout = () => setUser(null);
    window.addEventListener("plant-mate-login", onLogin);
    window.addEventListener("plant-mate-logout", onLogout);
    return () => {
      window.removeEventListener("plant-mate-login", onLogin);
      window.removeEventListener("plant-mate-logout", onLogout);
    };
  }, []);

  const handleAuthClose = () => {
    setAuthModal(null);
    const stored = sessionStorage.getItem(USER_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
      window.dispatchEvent(new Event("plant-mate-login"));
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(QUIZ_RESULTS_KEY);
    setUser(null);
    window.dispatchEvent(new Event("plant-mate-logout"));
  };

  const navLinkClass = darkMode ? "text-[clamp(0.7rem,1.1vw,1rem)] text-[#E2CFFA] hover:text-[#65F0CD]" : "text-[clamp(0.7rem,1.1vw,1rem)] text-[#1E3D2A] hover:text-[#4CAF82]";
  const authButtonClass = darkMode ? "text-[clamp(0.6rem,0.9vw,0.875rem)] text-[#65F0CD] hover:text-[#E2CFFA] font-semibold uppercase tracking-widest" : "text-[clamp(0.6rem,0.9vw,0.875rem)] text-[#3A8A52] hover:text-[#4CAF82] font-semibold uppercase tracking-widest";
  const welcomeClass = darkMode ? "text-[clamp(0.65rem,1vw,0.95rem)] text-[#FFBD06] font-semibold" : "text-[clamp(0.65rem,1vw,0.95rem)] text-[#6B2FA0] font-semibold";
  const signOutClass = darkMode ? "text-[clamp(0.55rem,0.8vw,0.8rem)] text-white/40 hover:text-white/70 transition-colors duration-200" : "text-[clamp(0.55rem,0.8vw,0.8rem)] text-[#1E3D2A]/40 hover:text-[#1E3D2A]/80 transition-colors duration-200";
  const separatorClass = darkMode ? "text-white/20" : "text-[#1E3D2A]/20";
  const iconClass = darkMode ? "text-[#65F0CD] hover:text-[#E2CFFA]" : "text-[#1E3D2A] hover:text-[#4CAF82]";

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? "bg-gradient-to-b from-[#210E4A]/90 to-transparent backdrop-blur-sm" : "bg-white/70 backdrop-blur-md"}`}>
        <div className="pl-8 md:pl-12 lg:pl-16 xl:pl-20 2xl:pl-28 pr-4 sm:pr-6 lg:pr-8 max-w-[1600px] mx-auto">
          <div className="flex items-center h-16">

            {/* Mobile/Tablet Hamburger */}
            <button
              onClick={() => setIsOpen(true)}
              className={`lg:hidden focus:outline-none mr-4 ${iconClass}`}
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center w-full">
              {/* Logo */}
              <Link href="/" className={`mr-8 shrink-0 font-heading text-xl ${darkMode ? "text-[#65F0CD]" : "text-[#1E3D2A]"}`}>
                PlantMate+
              </Link>

              {/* Nav links - left */}
              <div className="flex items-center space-x-8">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link key={href} href={href} className={navLinkClass}>{label}</Link>
                ))}
              </div>

              {/* Auth + dark mode - far right */}
              <div className="ml-auto flex items-center gap-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={darkMode ? "text-[#FFBD06]" : "text-[#6B2FA0]"}>
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                      <Link href="/profile" className={welcomeClass}>Welcome, {user.first_name}</Link>
                    </div>
                    <span className={separatorClass}>|</span>
                    <button onClick={handleLogout} className={signOutClass}>Sign out</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setAuthModal("register")} className={authButtonClass}>Register</button>
                    <button onClick={() => setAuthModal("login")} className={authButtonClass}>Login</button>
                  </>
                )}
                <button onClick={toggleDarkMode} className={`focus:outline-none p-2 ${iconClass}`} aria-label="Toggle dark mode">
                  <DarkModeIcon darkMode={darkMode} />
                </button>
              </div>
            </div>

            {/* Mobile/Tablet Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className={`lg:hidden ml-auto focus:outline-none p-2 ${iconClass}`} aria-label="Toggle dark mode">
              <DarkModeIcon darkMode={darkMode} />
            </button>
          </div>
        </div>

      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="lg:hidden fixed inset-0 z-[60] flex flex-col"
            style={{ background: darkMode ? "linear-gradient(160deg, #210E4A 0%, #5A1B27 100%)" : "linear-gradient(160deg, #A75B2B 0%, #F4E5FB 100%)" }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 h-16 shrink-0">
              <button onClick={() => setIsOpen(false)} className={`focus:outline-none ${darkMode ? "text-[#65F0CD] hover:text-[#E2CFFA]" : "text-[#210E4A] hover:text-[#210E4A]/60"}`}>
                <svg className="h-7 w-7" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Link href="/" onClick={() => setIsOpen(false)} className={`absolute left-1/2 -translate-x-1/2 font-heading text-xl ${darkMode ? "text-[#65F0CD]" : "text-[#210E4A]"}`}>
                PlantMate+
              </Link>
              <button onClick={toggleDarkMode} className={`focus:outline-none p-2 ${iconClass}`} aria-label="Toggle dark mode">
                <DarkModeIcon darkMode={darkMode} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex flex-col flex-1 justify-center px-8 gap-1 pb-8">
              {MOBILE_LINKS.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.15, duration: 0.3, ease: "easeOut" }}
                >
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`block font-heading py-3 transition-colors duration-200 ${
                      darkMode ? "text-white/80 hover:text-[#65F0CD]" : "text-[#210E4A]/80 hover:text-[#210E4A]"
                    }`}
                    style={{ fontSize: "clamp(1.8rem,7vw,2.4rem)" }}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Auth section */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.3 }}
              className={`px-8 py-8 shrink-0 border-t ${darkMode ? "border-white/10" : "border-[#210E4A]/15"}`}
            >
              {user ? (
                <div className="flex items-center justify-between">
                  <Link href="/profile" onClick={() => setIsOpen(false)} className={welcomeClass}>
                    Welcome, {user.first_name}
                  </Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className={signOutClass}>
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => { setAuthModal("register"); setIsOpen(false); }}
                    className={`flex-1 py-3 rounded-full font-heading text-sm font-bold tracking-wide border-2 transition-all duration-200 ${
                      darkMode
                        ? "border-[#65F0CD] text-[#65F0CD] hover:bg-[#65F0CD] hover:text-[#210E4A]"
                        : "border-[#210E4A] text-[#210E4A] hover:bg-[#210E4A] hover:text-white"
                    }`}
                  >
                    Register
                  </button>
                  <button
                    onClick={() => { setAuthModal("login"); setIsOpen(false); }}
                    className={`flex-1 py-3 rounded-full font-heading text-sm font-bold tracking-wide border-2 transition-all duration-200 ${
                      darkMode
                        ? "border-white/30 text-white/60 hover:border-white/60 hover:text-white"
                        : "border-[#210E4A]/40 text-[#210E4A]/70 hover:border-[#210E4A] hover:text-[#210E4A]"
                    }`}
                  >
                    Login
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {authModal && <AuthModal type={authModal} onClose={handleAuthClose} />}
    </>
  );
}

"use client";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import AuthModal from "./AuthModal";
import { DarkModeContext } from "../app/ClientProviders";
import { USER_KEY, QUIZ_RESULTS_KEY } from "../lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Me" },
  { href: "/contact", label: "Contact Me" },
  { href: "/quiz", label: "Plant Match" },
  { href: "/quiz/badge", label: "Play & Win" },
  { href: "/gallery", label: "Gallery" },
  { href: "/gallery2", label: "Gallery 2" },
  { href: "/gallery3", label: "Gallery 3" },
];

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
    const stored = localStorage.getItem(USER_KEY);
    if (stored) setUser(JSON.parse(stored));

    const onLogin = () => {
      const s = localStorage.getItem(USER_KEY);
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
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
      window.dispatchEvent(new Event("plant-mate-login"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(QUIZ_RESULTS_KEY);
    setUser(null);
    window.dispatchEvent(new Event("plant-mate-logout"));
  };

  const navLinkClass = darkMode ? "text-[clamp(0.7rem,1.1vw,1rem)] text-[#E2CFFA] hover:text-[#65F0CD]" : "text-[clamp(0.7rem,1.1vw,1rem)] text-[#1E3D2A] hover:text-[#4CAF82]";
  const authButtonClass = darkMode ? "text-[clamp(0.6rem,0.9vw,0.875rem)] text-[#65F0CD] hover:text-[#E2CFFA] font-semibold uppercase tracking-widest" : "text-[clamp(0.6rem,0.9vw,0.875rem)] text-[#3A8A52] hover:text-[#4CAF82] font-semibold uppercase tracking-widest";
  const welcomeClass = darkMode ? "text-[clamp(0.65rem,1vw,0.95rem)] text-[#FFBD06] font-semibold" : "text-[clamp(0.65rem,1vw,0.95rem)] text-[#00FF88] font-semibold";
  const signOutClass = darkMode ? "text-[clamp(0.55rem,0.8vw,0.8rem)] text-white/40 hover:text-white/70 transition-colors duration-200" : "text-[clamp(0.55rem,0.8vw,0.8rem)] text-[#1E3D2A]/40 hover:text-[#1E3D2A]/80 transition-colors duration-200";
  const separatorClass = darkMode ? "text-white/20" : "text-[#1E3D2A]/20";
  const iconClass = darkMode ? "text-[#65F0CD] hover:text-[#E2CFFA]" : "text-[#1E3D2A] hover:text-[#4CAF82]";

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? "bg-gradient-to-b from-[#210E4A]/90 to-transparent backdrop-blur-sm" : "bg-[#F4FBF0]"}`}>
        <div className="pl-8 md:pl-12 lg:pl-16 xl:pl-20 2xl:pl-28 pr-4 sm:pr-6 lg:pr-8">
          <div className="flex items-center h-16">

            {/* Mobile/Tablet Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden focus:outline-none mr-4 ${iconClass}`}
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center w-full">
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={darkMode ? "text-[#FFBD06]" : "text-[#00FF88]"}>
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

        {/* Mobile Menu - full width, outside the padded container */}
        {isOpen && (
          <div className="lg:hidden flex flex-col px-6 pb-4" style={{ backgroundColor: darkMode ? "rgba(33,14,74,0.97)" : "rgba(244,251,240,0.97)" }}>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`${navLinkClass} py-4 border-b ${darkMode ? "border-white/10" : "border-[#1E3D2A]/15"} tracking-wide`}
              >{label}</Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 py-4 border-b ${darkMode ? "border-white/10" : "border-[#1E3D2A]/15"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={darkMode ? "text-[#FFBD06]" : "text-[#00FF88]"}>
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  <span className={welcomeClass}>Welcome, {user.first_name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${signOutClass} py-4 text-left`}
                >Sign out</button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAuthModal("register")}
                  className={`${authButtonClass} py-4 border-b ${darkMode ? "border-white/10" : "border-[#1E3D2A]/15"} text-left tracking-wide`}
                >Register</button>
                <button
                  onClick={() => setAuthModal("login")}
                  className={`${authButtonClass} py-4 text-left tracking-wide`}
                >Login</button>
              </>
            )}
          </div>
        )}
      </nav>

      {authModal && <AuthModal type={authModal} onClose={handleAuthClose} />}
    </>
  );
}

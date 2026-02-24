"use client"
import { useState } from "react";
import Link from "next/link";
import AuthModal from "./AuthModal"; // adjust path if needed

export default function Navbar({ darkMode, toggleDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#210E4A]/90 to-transparent backdrop-blur-sm">
        <div className="pl-8 md:pl-12 lg:pl-16 xl:pl-20 2xl:pl-28 pr-4 sm:pr-6 lg:pr-8">
          <div className="flex items-center h-16">

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-[#65F0CD] focus:outline-none mr-4"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-[#E2CFFA] hover:text-[#65F0CD] font-medium">Home</Link>
              <Link href="/about" className="text-[#E2CFFA] hover:text-[#65F0CD] font-medium">About Me</Link>
              <Link href="/contact" className="text-[#E2CFFA] hover:text-[#65F0CD] font-medium">Contact Me</Link>
              <Link href="/quiz" className="text-[#E2CFFA] hover:text-[#65F0CD] font-medium">Take Quiz</Link>

              <button onClick={() => setAuthModal("register")} className="text-[#65F0CD] hover:text-[#E2CFFA] font-medium">Register</button>
              <button onClick={() => setAuthModal("login")} className="text-[#65F0CD] hover:text-[#E2CFFA] font-medium">Login</button>

              {/* Dark/Light Toggle */}
              <button
                onClick={toggleDarkMode}
                className="text-[#65F0CD] hover:text-[#E2CFFA] focus:outline-none p-2"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="md:hidden ml-auto text-[#65F0CD] hover:text-[#E2CFFA] focus:outline-none p-2"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden pb-4 flex flex-col space-y-4">
              <Link href="/" onClick={() => setIsOpen(false)} className="text-[#E2CFFA] hover:text-[#65F0CD] font-medium">Home</Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="text-[#E2CFFA] hover:text-[#65F0CD] font-medium">About Me</Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="text-[#E2CFFA] hover:text-[#65F0CD] font-medium">Contact Me</Link>
              <Link href="/quiz" onClick={() => setIsOpen(false)} className="text-[#E2CFFA] hover:text-[#65F0CD] font-medium">Take Quiz</Link>
              <button onClick={() => setAuthModal("register")} className="text-[#65F0CD] hover:text-[#E2CFFA] font-medium">Register</button>
              <button onClick={() => setAuthModal("login")} className="text-[#65F0CD] hover:text-[#E2CFFA] font-medium">Login</button>
            </div>
          )}
        </div>
      </nav>
      {/* Auth Modal */}
      {authModal && <AuthModal type={authModal} onClose={() => setAuthModal(null)} />}
    </>
  );
}

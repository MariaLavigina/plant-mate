"use client";

import { useContext } from "react";
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";
import { pageBg, primaryText } from "../../lib/styles";

export default function Contact() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={`relative min-h-screen ${pageBg(darkMode)}`}>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-12 pt-20">
        <div className="max-w-3xl">
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-caveat text-center ${primaryText(darkMode)}`}>
            Contact Me
          </h1>
          <p className={`text-lg sm:text-xl ${primaryText(darkMode)}`}>
            Add your contact information here - email, social media links, etc.
          </p>
        </div>
      </div>
    </div>
  );
}

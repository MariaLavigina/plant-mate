"use client"; // run this in the browser, not on the server

import { createContext, useState, useEffect, ReactNode } from "react";
import { DARK_MODE_KEY } from "../lib/constants"; // the localStorage key string "darkMode"

// the shared dark mode box - every page in the app can reach in and grab darkMode from here
export const DarkModeContext = createContext({
  darkMode: false,        // ignored - just tells TypeScript this will be a boolean
  toggleDarkMode: () => {}, // ignored - just tells TypeScript this will be a function
});

interface ClientProvidersProps {
  children: ReactNode; // anything between <ClientProviders> and </ClientProviders> - could be <Navbar />, <Footer />, pages, anything
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [darkMode, setDarkMode] = useState(true); // default to dark mode

  // runs once on page load - reads saved preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(DARK_MODE_KEY) === "true"; // "true" string → boolean
    setDarkMode(stored); // update state with saved value
  }, []); // empty [] means run once only

  // runs every time darkMode changes - saves the new value to localStorage
  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, darkMode.toString()); // boolean → "true"/"false" string
  }, [darkMode]); // [darkMode] means run whenever darkMode changes

  const toggleDarkMode = () => setDarkMode(!darkMode); // flips true→false or false→true

  return (
    // wraps all pages and shares darkMode + toggleDarkMode with every child
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

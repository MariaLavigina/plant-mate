"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { DARK_MODE_KEY } from "../lib/constants";

export const DarkModeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(DARK_MODE_KEY) === "true";
    setDarkMode(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
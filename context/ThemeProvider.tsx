"use client";

import { createContext, useContext, ReactNode, useSyncExternalStore, useCallback } from "react";

// --- 1. External Store Logic (Reads from localStorage) ---

// This runs on the client to get the current theme
const getSnapshot = () => {
  if (typeof window === "undefined") return false;
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark" || 
    (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
};

// This runs on the server (where window doesn't exist)
const getServerSnapshot = () => false;

// This tells React when to re-check the theme
const subscribe = (callback: () => void) => {
  window.addEventListener("theme-change", callback);
  return () => window.removeEventListener("theme-change", callback);
};

// --- 2. Context Setup ---

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// --- 3. The Provider ---

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Read directly from localStorage! No useEffect, no setState!
  const isDarkMode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Toggle function
  const toggleTheme = useCallback(() => {
    const newValue = !isDarkMode;
    
    if (newValue) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    // Tell React the theme changed so it updates the UI
    window.dispatchEvent(new Event("theme-change"));
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
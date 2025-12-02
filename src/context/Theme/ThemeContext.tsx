// src/theme/ThemeProvider.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./theme-context";
import type { Theme } from "./theme-types";

const THEME_STORAGE_KEY = "theme";

type Props = React.PropsWithChildren<unknown>;

const getInitialTheme = (): Theme => {
  // 1. localStorage if present
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore (e.g. SSR or storage blocked) */
  }

  // 2. system preference
  if (typeof window !== "undefined" && window.matchMedia) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  // 3. default
  return "light";
};

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Keep html root class in sync and persist to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState((prev) => (prev === "light" ? "dark" : "light"));

  // memoize value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
// src/theme/useTheme.ts
import { useContext } from "react";
import { ThemeContext } from "./theme-context";
import type { ThemeContextType } from "./theme-types";

export const useTheme = (): ThemeContextType => {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within a ThemeProvider. Wrap your app in <ThemeProvider />");
    }
    return ctx;
};
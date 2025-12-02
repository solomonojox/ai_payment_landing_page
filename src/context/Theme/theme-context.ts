// src/theme/theme-context.ts
import { createContext } from "react";
import type { ThemeContextType } from "./theme-types";

// Intentionally create a context that may be undefined — the hook will guard for that.
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
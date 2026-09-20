import React, { createContext, useContext, useMemo, useState } from "react";
import { LIGHT_COLORS, DARK_COLORS } from "./colors";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const value = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      colors: darkMode ? DARK_COLORS : LIGHT_COLORS,
    }),
    [darkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

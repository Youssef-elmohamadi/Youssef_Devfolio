"use client";
type Theme = "light" | "dark";

type ThemeContextProps = {
  theme: Theme;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
};

import { createContext, useContext, useState } from "react";

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeContextProvider = ({children}: {
  children: React.ReactNode;
}) => {
  const [theme, setThemeState] = useState<Theme>("light");

  const setTheme = (theme: string) => {
    setThemeState(theme as Theme);
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
}

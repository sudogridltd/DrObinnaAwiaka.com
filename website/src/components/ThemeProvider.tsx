import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to dark; actual stored value is applied by the inline script in +Head.tsx
  // to avoid flash. We sync with localStorage on mount (client only).
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Read from localStorage after hydration to sync with the inline script
    const stored = localStorage.getItem("drobinna-theme") as Theme | null;
    const resolved = stored ?? "dark";
    setTheme(resolved);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("drobinna-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}

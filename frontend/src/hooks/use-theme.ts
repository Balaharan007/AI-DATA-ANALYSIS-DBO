import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "ada.theme";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (typeof window !== "undefined" &&
      localStorage.getItem(STORAGE_KEY)) as Theme | null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial: Theme = stored ?? (prefersDark ? "dark" : "light");
    apply(initial);
    setThemeState(initial);
  }, []);

  const apply = (t: Theme) => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", t === "dark");
  };

  const setTheme = useCallback((t: Theme) => {
    apply(t);
    localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggle, mounted };
}

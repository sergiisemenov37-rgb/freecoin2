"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeMode, getStoredTheme, setStoredTheme, applyTheme, getEffectiveTheme } from '../lib/theme';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedThemeMode = getStoredTheme();
    setThemeModeState(storedThemeMode);
    const effectiveTheme = getEffectiveTheme(storedThemeMode);
    setThemeState(effectiveTheme);
    applyTheme(effectiveTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
    applyTheme(newTheme);
    setThemeModeState(newTheme);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    setStoredTheme(mode);
    const effectiveTheme = getEffectiveTheme(mode);
    setThemeState(effectiveTheme);
    applyTheme(effectiveTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

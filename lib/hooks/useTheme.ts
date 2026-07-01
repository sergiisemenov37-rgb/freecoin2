import { useState, useEffect } from 'react';
import { ThemeMode, getStoredTheme, setStoredTheme, applyTheme, getEffectiveTheme, type Theme } from '../theme';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setStoredTheme(mode);
    const effectiveTheme = getEffectiveTheme(mode);
    applyTheme(effectiveTheme);
    setTheme(mode);
  };

  return {
    theme,
    setTheme: setThemeMode,
    effectiveTheme: getEffectiveTheme(theme)
  };
}

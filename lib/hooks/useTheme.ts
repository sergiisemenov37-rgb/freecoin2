import { useState, useEffect } from 'react';
import { ThemeMode } from '../types/theme';
import { themeManager } from '../theme';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    setTheme(themeManager.getTheme());
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    themeManager.setTheme(mode);
    setTheme(mode);
  };

  return {
    theme,
    setTheme: setThemeMode,
    effectiveTheme: themeManager.getEffectiveTheme()
  };
}

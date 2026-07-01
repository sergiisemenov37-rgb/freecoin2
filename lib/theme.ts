export type Theme = 'dark' | 'light';
export type ThemeMode = 'dark' | 'light' | 'auto';

export const THEME_STORAGE_KEY = 'freecoin-theme';

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'dark' || stored === 'light' || stored === 'auto') return stored as ThemeMode;
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  
  return 'dark';
}

export function setStoredTheme(theme: ThemeMode) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const effectiveTheme = getEffectiveTheme(theme);
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }
}

function getEffectiveTheme(mode: ThemeMode): Theme {
  if (mode === 'auto') {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }
  return mode;
}

export { getEffectiveTheme };

export function applyTheme(theme: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

export const themeColors = {
  dark: {
    background: '#000000',
    surface: '#09090b',
    surfaceLight: '#18181b',
    border: '#27272a',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    accent: '#a855f7',
    accentHover: '#9333ea',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b'
  },
  light: {
    background: '#ffffff',
    surface: '#f4f4f5',
    surfaceLight: '#e4e4e7',
    border: '#d4d4d8',
    text: '#18181b',
    textSecondary: '#71717a',
    accent: '#a855f7',
    accentHover: '# 9333ea',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b'
  }
};

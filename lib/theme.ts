import { ThemeMode } from './types/theme';

class ThemeManager {
  private currentTheme: ThemeMode = 'dark';

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) {
        this.currentTheme = saved as ThemeMode;
      } else if (this.currentTheme === 'auto') {
        this.applyAutoTheme();
      }
      this.applyTheme();
    }
  }

  private applyAutoTheme(): void {
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = isDark ? 'dark' : 'light';
    }
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme = theme;
    if (theme === 'auto') {
      this.applyAutoTheme();
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    this.applyTheme();
  }

  private applyTheme(): void {
    if (typeof window === 'undefined') return;

    const html = document.documentElement;
    if (this.getEffectiveTheme() === 'dark') {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
    }
  }

  getTheme(): ThemeMode {
    return this.currentTheme;
  }

  getEffectiveTheme(): 'light' | 'dark' {
    if (this.currentTheme === 'auto') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'dark';
    }
    return this.currentTheme as 'light' | 'dark';
  }
}

export const themeManager = new ThemeManager();

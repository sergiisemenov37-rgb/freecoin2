export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  mode: ThemeMode;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

export interface UserThemePreference {
  user_id: string;
  theme_mode: ThemeMode;
  custom_colors: boolean;
  created_at: string;
  updated_at: string;
}

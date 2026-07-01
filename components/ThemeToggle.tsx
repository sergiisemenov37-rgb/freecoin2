"use client";

import { useTheme } from '../lib/hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme('light')}
        className={`px-3 py-1 rounded ${
          theme === 'light' ? 'bg-yellow-400 text-black' : 'bg-gray-600 text-white'
        }`}
      >
        ☀️
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-3 py-1 rounded ${
          theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
        }`}
      >
        🌙
      </button>
      <button
        onClick={() => setTheme('auto')}
        className={`px-3 py-1 rounded ${
          theme === 'auto' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-white'
        }`}
      >
        🔄
      </button>
    </div>
  );
}

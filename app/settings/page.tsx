"use client";

import { useState } from "react";

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-zinc-400 mb-8">⚙️ Settings</h1>

      {/* Notifications */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">🔔 Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Push Notifications</p>
              <p className="text-zinc-500 text-sm">Receive notifications about rewards and events</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-14 h-8 rounded-full transition-colors ${
                notifications ? 'bg-green-600' : 'bg-zinc-700'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                notifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Mining Alerts</p>
              <p className="text-zinc-500 text-sm">Get notified when mining milestones are reached</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-14 h-8 rounded-full transition-colors ${
                notifications ? 'bg-green-600' : 'bg-zinc-700'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                notifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Sound */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">🔊 Sound</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Sound Effects</p>
              <p className="text-zinc-500 text-sm">Play sounds for games and mining</p>
            </div>
            <button
              onClick={() => setSoundEffects(!soundEffects)}
              className={`w-14 h-8 rounded-full transition-colors ${
                soundEffects ? 'bg-green-600' : 'bg-zinc-700'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                soundEffects ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Volume</p>
              <p className="text-zinc-500 text-sm">Adjust sound volume</p>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="70"
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">🎨 Appearance</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Animations</p>
              <p className="text-zinc-500 text-sm">Enable UI animations</p>
            </div>
            <button
              onClick={() => setAnimations(!animations)}
              className={`w-14 h-8 rounded-full transition-colors ${
                animations ? 'bg-green-600' : 'bg-zinc-700'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                animations ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Theme</p>
              <p className="text-zinc-500 text-sm">Choose app theme</p>
            </div>
            <button
              onClick={toggleTheme}
              className="bg-zinc-800 hover:bg-zinc-700 rounded-lg px-4 py-2 font-medium transition"
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">👤 Account</h2>
        
        <div className="space-y-4">
          <button className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-xl py-3 font-medium transition">
            Edit Profile
          </button>
          <button className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-xl py-3 font-medium transition">
            Change Language
          </button>
          <button className="w-full bg-red-600 hover:bg-red-500 rounded-xl py-3 font-medium transition">
            Log Out
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">ℹ️ About</h2>
        
        <div className="space-y-2 text-zinc-400">
          <p>FREECOIN v1.0.0</p>
          <p>Telegram Web3 Mining Platform</p>
          <p className="text-sm">© 2026 FREECOIN</p>
        </div>
      </div>
    </main>
  );
}

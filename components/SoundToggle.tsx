"use client";

import { useState } from 'react';
import { useSound } from '../lib/hooks/useSound';

export function SoundToggle() {
  const { toggle, isEnabled, setVolume } = useSound();
  const [volumeOpen, setVolumeOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        className={`px-3 py-1 rounded ${
          isEnabled ? 'bg-green-600' : 'bg-red-600'
        } text-white`}
      >
        {isEnabled ? '🔊' : '🔇'}
      </button>
      {isEnabled && (
        <div className="relative">
          <button
            onClick={() => setVolumeOpen(!volumeOpen)}
            className="px-2 py-1 text-white"
          >
            ⚙️
          </button>
          {volumeOpen && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue="0.5"
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute top-10 left-0"
            />
          )}
        </div>
      )}
    </div>
  );
}

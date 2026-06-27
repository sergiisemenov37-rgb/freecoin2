"use client";

import { useState } from "react";
import { TROPHIES, getTrophyRarityColor, getTrophyCategoryIcon, filterTrophiesByCategory, getUnlockedTrophiesCount, type Trophy } from "../../lib/trophies";

export default function TrophiesPage() {
  const [filter, setFilter] = useState<'all' | 'mining' | 'social' | 'achievement' | 'special'>('all');
  const [userTrophies, setUserTrophies] = useState<Set<string>>(new Set(['first_mine']));
  
  const filteredTrophies = filter === 'all' 
    ? TROPHIES 
    : filterTrophiesByCategory(TROPHIES, filter);

  const unlockedCount = getUnlockedTrophiesCount(TROPHIES.map(t => 
    userTrophies.has(t.id) ? { ...t, unlocked: true } : t
  ));

  function toggleTrophy(trophyId: string) {
    setUserTrophies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trophyId)) {
        newSet.delete(trophyId);
      } else {
        newSet.add(trophyId);
      }
      return newSet;
    });
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-amber-400 mb-6">🏆 Trophies & Medals</h1>

      {/* Progress */}
      <div className="bg-zinc-950 border border-amber-700 rounded-3xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Collection Progress</h2>
          <span className="text-amber-400 font-bold">{unlockedCount}/{TROPHIES.length}</span>
        </div>
        
        <div className="w-full bg-zinc-800 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-amber-600 to-yellow-500 h-3 rounded-full transition-all"
            style={{ width: `${(unlockedCount / TROPHIES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'mining', 'social', 'achievement', 'special'].map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category as any)}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
              filter === category
                ? 'bg-amber-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {category !== 'all' && getTrophyCategoryIcon(category as Trophy['category'])}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Trophies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrophies.map((trophy) => {
          const isUnlocked = userTrophies.has(trophy.id);
          const rarityColor = getTrophyRarityColor(trophy.rarity);
          
          return (
            <div
              key={trophy.id}
              className={`bg-zinc-950 border rounded-3xl p-6 ${isUnlocked ? rarityColor.split(' ')[1] : 'border-zinc-800 opacity-60'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-5xl ${isUnlocked ? '' : 'grayscale'}`}>{trophy.icon}</div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{trophy.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${rarityColor}`}>
                      {trophy.rarity}
                    </span>
                  </div>
                  
                  <p className="text-zinc-500 text-sm mb-2">{trophy.description}</p>
                  
                  <div className="bg-zinc-900 rounded-xl p-2 mb-3">
                    <p className="text-zinc-400 text-xs">Requirement: {trophy.requirement}</p>
                  </div>

                  {isUnlocked && (
                    <div className="bg-green-950 border border-green-700 rounded-lg p-2 text-center">
                      <p className="text-green-400 text-sm font-bold">✓ Unlocked</p>
                    </div>
                  )}

                  {!isUnlocked && (
                    <button
                      onClick={() => toggleTrophy(trophy.id)}
                      className="w-full bg-zinc-700 hover:bg-zinc-600 rounded-lg py-2 text-sm font-bold transition"
                    >
                      🔓 Unlock (Demo)
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrophies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500">No trophies in this category</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4">Rarity Legend</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-zinc-400" />
            <span className="text-zinc-400 text-sm">Common</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-400" />
            <span className="text-blue-400 text-sm">Rare</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-400" />
            <span className="text-purple-400 text-sm">Epic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-400" />
            <span className="text-amber-400 text-sm">Legendary</span>
          </div>
        </div>
      </div>
    </main>
  );
}

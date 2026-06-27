"use client";

import { getCurrentSeason, getTimeUntilSeasonEnd, getSeasonProgress } from "../lib/seasons";

export default function SeasonCard() {
  const season = getCurrentSeason();
  const timeUntilEnd = getTimeUntilSeasonEnd();
  const progress = getSeasonProgress();

  return (
    <div className="bg-zinc-950 border border-amber-700 rounded-3xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-amber-400">{season.name}</h2>
        <div className="text-right">
          <p className="text-zinc-500 text-xs">Season ends in</p>
          <p className="text-lg font-bold text-white">{timeUntilEnd}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-zinc-400">Season Progress</span>
          <span className="text-amber-400 font-bold">{progress.toFixed(0)}%</span>
        </div>
        
        <div className="w-full bg-zinc-800 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-amber-600 to-yellow-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-4">
        <h3 className="font-bold text-white mb-3">Season Rewards</h3>
        
        <div className="space-y-2">
          {season.rewards.slice(0, 4).map((reward, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">{reward.rank}</span>
              <span className="text-green-400 font-bold">{reward.reward.toLocaleString()} FREE</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

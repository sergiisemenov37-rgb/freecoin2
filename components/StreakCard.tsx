"use client";

import { calculateStreakBonus, getStreakReward, getStreakMilestone } from "../lib/streaks";

type Props = {
  streak: number;
  onClaimBonus: () => void;
  canClaim: boolean;
};

export default function StreakCard({ streak, onClaimBonus, canClaim }: Props) {
  const bonusMultiplier = calculateStreakBonus(streak);
  const reward = getStreakReward(streak + 1);
  const milestone = getStreakMilestone(streak);

  return (
    <div className="bg-zinc-950 border border-orange-700 rounded-3xl p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-orange-400">🔥 Daily Streak</h2>
        <span className="text-zinc-400 text-sm">{streak} days</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
          <div key={i} className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
            🔥
          </div>
        ))}
        {streak < 7 && Array.from({ length: 7 - streak }).map((_, i) => (
          <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
            •
          </div>
        ))}
      </div>

      {milestone && (
        <div className="bg-orange-950 border border-orange-700 rounded-2xl p-3 mb-4 text-center">
          <p className="text-orange-400 font-bold">{milestone}</p>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <p className="text-zinc-400 text-sm">
          Mining Bonus: <span className="text-white font-bold">{bonusMultiplier}x</span>
        </p>
        <p className="text-zinc-400 text-sm">
          Next Reward: <span className="text-green-400 font-bold">{reward} FREE</span>
        </p>
      </div>

      {canClaim && (
        <button
          onClick={onClaimBonus}
          className="w-full bg-orange-600 hover:bg-orange-500 rounded-2xl py-3 font-bold text-lg transition"
        >
          Claim Daily Reward
        </button>
      )}

      {!canClaim && (
        <div className="w-full bg-zinc-800 rounded-2xl py-3 text-center text-zinc-500">
          Come back tomorrow
        </div>
      )}
    </div>
  );
}

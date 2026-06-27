"use client";

import { achievements, checkAchievement } from "../lib/achievements";

type Props = {
  level: number;
  balance: number;
  referrals: number;
  tasksCompleted: number;
};

export default function AchievementsCard({
  level,
  balance,
  referrals,
  tasksCompleted,
}: Props) {
  const levelAchievements = checkAchievement('level', level);
  const balanceAchievements = checkAchievement('balance', Math.floor(balance));
  const referralAchievements = checkAchievement('referrals', referrals);
  const taskAchievements = checkAchievement('tasks', tasksCompleted);

  const allAchievements = [
    ...levelAchievements,
    ...balanceAchievements,
    ...referralAchievements,
    ...taskAchievements,
  ];

  const totalAchievements = achievements.length;
  const unlockedCount = allAchievements.length;
  const progress = (unlockedCount / totalAchievements) * 100;

  return (
    <div className="bg-zinc-950 border border-yellow-700 rounded-3xl p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-400">🏆 Achievements</h2>
        <span className="text-zinc-400 text-sm">
          {unlockedCount}/{totalAchievements}
        </span>
      </div>

      <div className="w-full bg-zinc-800 rounded-full h-3 mb-6">
        <div 
          className="bg-yellow-500 h-3 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {allAchievements.slice(0, 6).map((achievement) => (
          <div 
            key={achievement.id}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4"
          >
            <div className="text-3xl mb-2">{achievement.icon}</div>
            <h3 className="font-bold text-white text-sm">{achievement.name}</h3>
            <p className="text-zinc-500 text-xs mt-1">{achievement.description}</p>
            <p className="text-green-400 text-xs mt-2">+{achievement.reward} FREE</p>
          </div>
        ))}
      </div>

      {allAchievements.length > 6 && (
        <p className="text-zinc-500 text-sm text-center mt-4">
          +{allAchievements.length - 6} more achievements unlocked
        </p>
      )}

      {allAchievements.length === 0 && (
        <div className="text-center py-8">
          <p className="text-zinc-500">Complete tasks to unlock achievements!</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { upgradeMiner } from "../lib/api";
import { getLevelInfo, getNextLevel, getMaxLevel } from "../lib/miningLevels";

type Props = {
  level: number;
  power: number;
  balance: number;
  onUpgrade: (level: number, power: number, balance: number) => void;
};

export default function UpgradeCard({
  level,
  power,
  balance,
  onUpgrade,
}: Props) {
  const currentLevelInfo = getLevelInfo(level);
  const nextLevelInfo = getNextLevel(level);
  const maxLevel = getMaxLevel();
  const canAfford = nextLevelInfo && balance >= nextLevelInfo.price;
  const isMaxLevel = level >= maxLevel;

  async function handleUpgrade() {
    const result = await upgradeMiner();

    if (!result.success) {
      alert(result.error);
      return;
    }

    const { level: newLevel, power: newPower, balance: newBalance } =
      result;

    onUpgrade(newLevel, newPower, newBalance);
    alert(`🚀 Miner upgraded to ${getLevelInfo(newLevel).name}`);
  }

  return (
    <div className="bg-zinc-950 border border-green-700 rounded-3xl p-6 mt-8">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <p className="text-zinc-500">Upgrade Miner</p>

          <h2 className="text-2xl font-bold text-green-400 mt-2">
            {currentLevelInfo.name}
          </h2>

          <div className="mt-3 space-y-2">
            <p className="text-zinc-400 text-sm">
              Power: <span className="text-white font-bold">{power.toFixed(3)}</span> FREE/min
            </p>

            {!isMaxLevel && nextLevelInfo && (
              <>
                <p className="text-zinc-400 text-sm">
                  Next: <span className="text-green-400 font-bold">{nextLevelInfo.power.toFixed(3)}</span> FREE/min
                </p>
                <p className="text-yellow-400 text-sm font-bold">
                  Cost: {nextLevelInfo.price.toLocaleString()} FREE
                </p>
                <p className="text-zinc-500 text-xs">
                  Balance: {balance.toFixed(2)} FREE
                </p>
                <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((balance / nextLevelInfo.price) * 100, 100)}%` }}
                  />
                </div>
              </>
            )}

            {isMaxLevel && (
              <p className="text-yellow-400 font-bold text-sm mt-2">
                🏆 MAX LEVEL REACHED!
              </p>
            )}
          </div>

          <p className="text-zinc-500 text-xs mt-3">
            Level {level} / {maxLevel}
          </p>
        </div>

        {!isMaxLevel && (
          <button
            onClick={handleUpgrade}
            disabled={!canAfford}
            className={`px-6 py-4 rounded-2xl font-bold text-lg transition shrink-0 ${
              canAfford
                ? "bg-green-600 hover:bg-green-500"
                : "bg-zinc-700 cursor-not-allowed"
            }`}
          >
            UPGRADE
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

type Props = {
  level: number;
  power: number;
};

export default function UpgradeCard({
  level,
  power,
}: Props) {

  const nextPower =
    power + 0.20;

  const price =
    level * 500;

  return (

    <div className="bg-zinc-950 border border-green-700 rounded-3xl p-6 mt-8">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-zinc-500">

            Upgrade Miner

          </p>

          <h2 className="text-3xl font-bold text-green-400 mt-2">

            LVL {level}

          </h2>

          <p className="text-zinc-400 mt-2">

            {power.toFixed(2)}

            {" → "}

            {nextPower.toFixed(2)}

            {" FREE/min"}

          </p>

          <p className="mt-2 text-yellow-400">

            Cost: {price} FREE

          </p>

        </div>

        <button className="bg-green-600 hover:bg-green-500 px-8 py-4 rounded-2xl font-bold text-xl">

          UPGRADE

        </button>

      </div>

    </div>

  );
}
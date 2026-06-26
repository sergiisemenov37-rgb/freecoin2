"use client";

type Props = {
  balance: number;
  power: number;
};

export default function MiningStats({
  balance,
  power,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5">

        <p className="text-zinc-500 text-sm">
          BALANCE
        </p>

        <p className="text-4xl font-bold text-green-400 mt-2">
          {balance.toFixed(2)}
        </p>

        <p className="text-zinc-400 mt-1">
          FREE
        </p>

      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5">

        <p className="text-zinc-500 text-sm">
          MINING POWER
        </p>

        <p className="text-4xl font-bold text-green-400 mt-2">
          +{power.toFixed(2)}
        </p>

        <p className="text-zinc-400 mt-1">
          FREE / min
        </p>

      </div>

    </div>
  );
}
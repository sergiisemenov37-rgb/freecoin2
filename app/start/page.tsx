"use client";

export default function StartPage() {
return (
<main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

  <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-8 text-center">

    <h1 className="text-5xl font-bold text-green-400 mb-4">
      FREECOIN
    </h1>

    <p className="text-zinc-400 mb-8">
      Telegram Web3 Reward Platform
    </p>

    <a
      href="/"
      className="block w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-bold text-xl"
    >
      🚀 Open FREECOIN
    </a>

    <div className="mt-8 grid grid-cols-3 gap-3">

      <div className="bg-black border border-zinc-800 rounded-2xl p-4">
        <p className="text-green-400 text-2xl">
          🎯
        </p>

        <p className="text-sm mt-2">
          Tasks
        </p>
      </div>

      <div className="bg-black border border-zinc-800 rounded-2xl p-4">
        <p className="text-green-400 text-2xl">
          👥
        </p>

        <p className="text-sm mt-2">
          Referrals
        </p>
      </div>

      <div className="bg-black border border-zinc-800 rounded-2xl p-4">
        <p className="text-green-400 text-2xl">
          💰
        </p>

        <p className="text-sm mt-2">
          Earn
        </p>
      </div>

    </div>

  </div>

</main>

);
}
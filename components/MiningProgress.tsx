"use client";

import { useEffect, useState } from "react";

export default function MiningProgress() {

  const [progress, setProgress] =
    useState(0);

  useEffect(() => {

    const timer =
      setInterval(() => {

        setProgress((prev) => {

          if (prev >= 100)
            return 0;

          return prev + 1;

        });

      }, 600);

    return () =>
      clearInterval(timer);

  }, []);

  return (

    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mt-6">

      <div className="flex justify-between mb-3">

        <span className="text-green-400 font-bold">

          ● MINING...

        </span>

        <span>

          {progress}%

        </span>

      </div>

      <div className="w-full h-4 rounded-full bg-zinc-800 overflow-hidden">

        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <p className="text-center text-zinc-400 mt-4">

        Your ASIC miner is working

      </p>

    </div>

  );
}
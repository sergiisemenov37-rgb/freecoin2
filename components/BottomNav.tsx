"use client";

import Link from "next/link";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 flex justify-around py-3 z-50">

      <Link href="/">
        🏠
      </Link>

      <Link href="/tasks">
        🎯
      </Link>

      <Link href="/referrals">
        👥
      </Link>

      <Link href="/leaderboard">
        🏆
      </Link>

      <Link href="/profile">
        👤
      </Link>

    </div>
  );
}
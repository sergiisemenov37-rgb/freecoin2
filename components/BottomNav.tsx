"use client";

import Link from "next/link";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 flex justify-around py-3 z-50 overflow-x-auto">

      <Link href="/">
        🏠
      </Link>

      <Link href="/tasks">
        🎯
      </Link>

      <Link href="/daily-tasks">
        📋
      </Link>

      <Link href="/games">
        🎮
      </Link>

      <Link href="/lottery">
        🎰
      </Link>

      <Link href="/shop">
        🛒
      </Link>

      <Link href="/guilds">
        🏰
      </Link>

      <Link href="/tournaments">
        🏆
      </Link>

      <Link href="/friends">
        👥
      </Link>

      <Link href="/profile">
        👤
      </Link>

    </div>
  );
}
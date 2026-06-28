"use client";

import Link from "next/link";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 flex justify-around py-3 z-50">

      <Link href="/" className="text-2xl">
        🏠
      </Link>

      <Link href="/games" className="text-2xl">
        🎮
      </Link>

      <Link href="/lottery" className="text-2xl">
        🎰
      </Link>

      <Link href="/profile" className="text-2xl">
        👤
      </Link>

    </div>
  );
}
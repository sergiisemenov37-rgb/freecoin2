"use client";

import { useEffect, useState } from "react";
import { registerUser } from "../../lib/api";
import { getTelegramUser, TelegramUser } from "../../lib/telegramUser";

export default function TelegramPage() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    async function initTelegram() {
      try {
        const telegramUser = getTelegramUser();

        if (!telegramUser) {
          setLoading(false);
          return;
        }

        setUser(telegramUser);

        const referrerId = localStorage.getItem("ref");
        const registered = await registerUser(referrerId);

        setSynced(!!registered);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    initTelegram();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-green-400 mb-10">
        📱 FREECOIN Telegram
      </h1>

      {loading && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
          Loading...
        </div>
      )}

      {!loading && !user && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-4">Telegram not detected</h2>
          <p className="text-zinc-400">Open FREECOIN from Telegram Bot.</p>
        </div>
      )}

      {!loading && user && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-bold mb-6">
            Welcome {user.first_name}
          </h2>

          <div className="space-y-3">
            <p>Telegram ID: {user.id}</p>
            <p>Username: @{user.username}</p>
          </div>

          {synced && (
            <div className="mt-6 bg-green-950 border border-green-700 rounded-2xl p-4">
              ✅ User synced with Supabase
            </div>
          )}
        </div>
      )}
    </main>
  );
}

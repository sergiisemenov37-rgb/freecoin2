"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function HistoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'mining' | 'upgrade' | 'task' | 'lottery' | 'guild'>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const tg = (window as any)?.Telegram?.WebApp;
    const telegramUser = tg?.initDataUnsafe?.user;

    if (!telegramUser) return;

    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("telegram_id", telegramUser.id.toString())
      .order("created_at", { ascending: false });

    setItems(data || []);
  }

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, string> = {
      mining: '⛏️',
      upgrade: '🚀',
      task: '✅',
      lottery: '🎰',
      guild: '🏰',
      referral: '👥',
      reward: '💰',
      purchase: '🛒'
    };
    return icons[type] || '📄';
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold mb-6">📜 History</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'mining', 'upgrade', 'task', 'lottery', 'guild'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              filter === type
                ? 'bg-green-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{getTransactionIcon(item.type)}</div>
              
              <div className="flex-1">
                <p className="font-bold text-white">{item.description}</p>
                <p className="text-zinc-500 text-sm">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              <div
                className={
                  item.amount >= 0
                    ? "text-green-400 font-bold text-xl"
                    : "text-red-400 font-bold text-xl"
                }
              >
                {item.amount >= 0 ? '+' : ''}{item.amount.toLocaleString()}
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No transactions found</p>
          </div>
        )}
      </div>
    </main>
  );
}
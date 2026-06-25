"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function HistoryPage() {
const [items, setItems] =
useState<any[]>([]);

useEffect(() => {
loadHistory();
}, []);

async function loadHistory() {
const tg =
(window as any)
?.Telegram
?.WebApp;

const telegramUser =
  tg?.initDataUnsafe?.user;

if (!telegramUser)
  return;

const { data } =
  await supabase
    .from("transactions")
    .select("*")
    .eq(
      "telegram_id",
      telegramUser.id.toString()
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

setItems(data || []);

}

return (
<main className="min-h-screen bg-black text-white p-6">

  <h1 className="text-5xl font-bold mb-10">
    📜 History
  </h1>

  <div className="grid gap-4">

    {items.map((item) => (
      <div
        key={item.id}
        className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5"
      >
        <div className="flex justify-between">

          <div>
            <p className="font-bold">
              {item.description}
            </p>

            <p className="text-zinc-500 text-sm">
              {new Date(
                item.created_at
              ).toLocaleString()}
            </p>
          </div>

          <div
            className={
              item.amount >= 0
                ? "text-green-400 font-bold"
                : "text-red-400 font-bold"
            }
          >
            {item.amount}
          </div>

        </div>
      </div>
    ))}

  </div>

</main>

);
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function WithdrawPage() {
const [amount, setAmount] =
useState(100);

const [user, setUser] =
useState<any>(null);

useEffect(() => {
loadUser();
}, []);

async function loadUser() {
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
    .from("users")
    .select("*")
    .eq(
      "telegram_id",
      telegramUser.id.toString()
    )
    .single();

setUser(data);

}

async function requestWithdraw() {
if (!user) return;

if (
  amount >
  user.free_balance
) {
  alert(
    "Not enough FREE"
  );
  return;
}

await supabase
  .from(
    "withdraw_requests"
  )
  .insert([
    {
      telegram_id:
        user.telegram_id,
      amount,
      status:
        "pending",
    },
  ]);

alert(
  "Withdraw request sent"
);

}

return (
<main className="min-h-screen bg-black text-white p-6">

  <h1 className="text-5xl font-bold mb-10">
    💸 Withdraw
  </h1>

  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-xl">

    <p className="text-zinc-400">
      FREE Balance
    </p>

    <p className="text-5xl font-bold text-green-400 mb-8">
      {user?.free_balance ||
        0}
    </p>

    <input
      type="number"
      value={amount}
      onChange={(e) =>
        setAmount(
          Number(
            e.target.value
          )
        )
      }
      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-5"
    />

    <button
      onClick={
        requestWithdraw
      }
      className="bg-green-600 px-6 py-3 rounded-2xl font-bold"
    >
      Request Withdraw
    </button>

  </div>

</main>

);
}
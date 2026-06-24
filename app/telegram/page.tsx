"use client";

import { useEffect, useState } from "react";

export default function TelegramPage() {
const [user, setUser] =
useState<any>(null);

useEffect(() => {
if (
typeof window !==
"undefined"
) {
const tg =
(window as any)
.Telegram
?.WebApp;

  tg?.ready();

  if (
    tg?.initDataUnsafe
      ?.user
  ) {
    setUser(
      tg.initDataUnsafe
        .user
    );
  }
}

}, []);

return (
<main className="min-h-screen bg-black text-white p-6">

  <h1 className="text-5xl font-bold text-green-400 mb-10">
    📱 Telegram Mini App
  </h1>

  {!user ? (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

      <p className="text-zinc-400">
        Open this page
        from Telegram
        WebApp
      </p>

    </div>
  ) : (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

      <h2 className="text-3xl font-bold mb-6">
        Welcome
      </h2>

      <p>
        ID: {user.id}
      </p>

      <p>
        Username:
        {" "}
        @{user.username}
      </p>

      <p>
        First Name:
        {" "}
        {user.first_name}
      </p>

      <p>
        Last Name:
        {" "}
        {user.last_name}
      </p>

      <div className="mt-6 p-4 rounded-2xl bg-black border border-zinc-800">

        <pre>
          {JSON.stringify(
            user,
            null,
            2
          )}
        </pre>

      </div>

    </div>
  )}

</main>

);
}
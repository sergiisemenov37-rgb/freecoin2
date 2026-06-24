"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const ADMIN_WALLET =
"HhZz13BAsk4peMTL1mwqu7yF2eCZJbS8NfJY5SfoApZ2";

export default function AdminPage() {
const [isAdmin, setIsAdmin] =
useState(false);

const [users, setUsers] =
useState<any[]>([]);

const [tasks, setTasks] =
useState<any[]>([]);

const [withdraws, setWithdraws] =
useState<any[]>([]);

useEffect(() => {
const wallet =
localStorage.getItem("wallet");

if (
  wallet === ADMIN_WALLET
) {
  setIsAdmin(true);
  loadData();
}

}, []);

async function loadData() {
const usersData =
await supabase
.from("users")
.select("*");

const tasksData =
  await supabase
    .from("tasks")
    .select("*");

const withdrawData =
  await supabase
    .from("withdraw_requests")
    .select("*");

setUsers(
  usersData.data || []
);

setTasks(
  tasksData.data || []
);

setWithdraws(
  withdrawData.data || []
);

}

async function approveWithdraw(
id: number
) {
await supabase
.from("withdraw_requests")
.update({
status: "approved",
})
.eq("id", id);

loadData();

}

async function rejectWithdraw(
id: number
) {
await supabase
.from("withdraw_requests")
.update({
status: "rejected",
})
.eq("id", id);

loadData();

}

async function deleteTask(
id: number
) {
if (
!confirm(
"Delete task?"
)
)
return;

await supabase
  .from("tasks")
  .delete()
  .eq("id", id);

loadData();

}

async function activateTask(
id: number
) {
await supabase
.from("tasks")
.update({
status: "active",
})
.eq("id", id);

loadData();

}

async function banUser(
wallet: string
) {
if (
!confirm(
"Ban user?"
)
)
return;

await supabase
  .from("users")
  .update({
    banned: true,
  })
  .eq("wallet", wallet);

loadData();

}

if (!isAdmin) {
return (
<main className="min-h-screen bg-black text-white flex items-center justify-center">
<h1 className="text-4xl text-red-500">
🚫 Access Denied
</h1>
</main>
);
}

return (
<main className="min-h-screen bg-black text-white p-6">

  <h1 className="text-5xl font-bold text-green-400 mb-10">
    🛠 FREECOIN Admin
  </h1>

  <div className="grid md:grid-cols-3 gap-6 mb-10">

    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
      <p>Total Users</p>

      <p className="text-4xl font-bold text-green-400">
        {users.length}
      </p>
    </div>

    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
      <p>Total Tasks</p>

      <p className="text-4xl font-bold text-yellow-400">
        {tasks.length}
      </p>
    </div>

    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
      <p>Withdraw Requests</p>

      <p className="text-4xl font-bold text-purple-400">
        {withdraws.length}
      </p>
    </div>

  </div>

  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-10">

    <h2 className="text-3xl font-bold mb-6">
      👤 Users
    </h2>

    {users.map((user) => (
      <div
        key={user.wallet}
        className="border-b border-zinc-800 py-4"
      >
        <p className="text-green-400 break-all">
          {user.wallet}
        </p>

        <p>
          FREE: {user.free_balance}
        </p>

        <p>
          Tasks: {user.tasks_completed}
        </p>

        <button
          onClick={() =>
            banUser(
              user.wallet
            )
          }
          className="mt-2 bg-red-600 px-4 py-2 rounded-xl"
        >
          Ban User
        </button>

      </div>
    ))}

  </div>

  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-10">

    <h2 className="text-3xl font-bold mb-6">
      🎯 Tasks
    </h2>

    {tasks.map((task) => (
      <div
        key={task.id}
        className="border-b border-zinc-800 py-4"
      >
        <p className="font-bold">
          {task.title}
        </p>

        <p>
          Reward: {task.reward}
        </p>

        <p>
          Budget: {task.budget}
        </p>

        <p>
          Status: {task.status}
        </p>

        <div className="flex gap-3 mt-3">

          <button
            onClick={() =>
              activateTask(
                task.id
              )
            }
            className="bg-green-600 px-4 py-2 rounded-xl"
          >
            Activate
          </button>

          <button
            onClick={() =>
              deleteTask(
                task.id
              )
            }
            className="bg-red-600 px-4 py-2 rounded-xl"
          >
            Delete
          </button>

        </div>

      </div>
    ))}

  </div>

  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

    <h2 className="text-3xl font-bold mb-6">
      💸 Withdraw Requests
    </h2>

    {withdraws.map((withdraw) => (
      <div
        key={withdraw.id}
        className="border-b border-zinc-800 py-4"
      >
        <p className="break-all">
          {withdraw.wallet}
        </p>

        <p>
          Amount: {withdraw.amount}
        </p>

        <p>
          Status: {withdraw.status}
        </p>

        {withdraw.status ===
          "pending" && (
          <div className="flex gap-3 mt-3">

            <button
              onClick={() =>
                approveWithdraw(
                  withdraw.id
                )
              }
              className="bg-green-600 px-4 py-2 rounded-xl"
            >
              Approve
            </button>

            <button
              onClick={() =>
                rejectWithdraw(
                  withdraw.id
                )
              }
              className="bg-red-600 px-4 py-2 rounded-xl"
            >
              Reject
            </button>

          </div>
        )}

      </div>
    ))}

  </div>

</main>

);
}
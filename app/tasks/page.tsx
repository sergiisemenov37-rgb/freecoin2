"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TasksPage() {
const [tasks, setTasks] = useState<any[]>([]);

useEffect(() => {
loadTasks();
}, []);

async function loadTasks() {
const { data } = await supabase
.from("tasks")
.select("*")
.eq("status", "active")
.order("id", {
ascending: false,
});

if (data) {
  setTasks(data);
}

}

async function completeTask(
task: any
) {
const wallet =
localStorage.getItem(
"wallet"
);

if (!wallet) {
  alert(
    "Connect wallet"
  );
  return;
}

const { data: user } =
  await supabase
    .from("users")
    .select("*")
    .eq(
      "wallet",
      wallet
    )
    .single();

if (!user) {
  alert(
    "User not found"
  );
  return;
}

if (user.banned) {
  alert(
    "Account banned"
  );
  return;
}

const {
  data: existing,
} = await supabase
  .from(
    "task_completions"
  )
  .select("*")
  .eq(
    "task_id",
    task.id
  )
  .eq(
    "user_wallet",
    wallet
  )
  .maybeSingle();

if (existing) {
  alert(
    "Task already completed"
  );
  return;
}

window.open(
  task.url,
  "_blank"
);

await supabase
  .from(
    "task_completions"
  )
  .insert([
    {
      task_id: task.id,
      user_wallet:
        wallet,
      reward:
        task.reward,
    },
  ]);

await supabase
  .from("users")
  .update({
    free_balance:
      (user.free_balance ||
        0) +
      task.reward,

    tasks_completed:
      (user.tasks_completed ||
        0) +
      1,
  })
  .eq(
    "wallet",
    wallet
  );

alert(
  `You earned ${task.reward} FREE`
);

}

return (
<main className="min-h-screen bg-black text-white p-6">

  <h1 className="text-5xl font-bold mb-10">
    🎯 Tasks
  </h1>

  <div className="grid gap-6">

    {tasks.map(
      (task) => (
        <div
          key={
            task.id
          }
          className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6"
        >
          <div className="flex justify-between items-center">

            <div>

              <h2 className="text-2xl font-bold">
                {
                  task.title
                }
              </h2>

              <p className="text-zinc-400 mt-2">
                {
                  task.description
                }
              </p>

            </div>

            <div className="text-green-400 text-3xl font-bold">
              +
              {
                task.reward
              }
            </div>

          </div>

          <button
            onClick={() =>
              completeTask(
                task
              )
            }
            className="mt-6 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-2xl font-bold"
          >
            Complete Task
          </button>

        </div>
      )
    )}

  </div>

</main>

);
}
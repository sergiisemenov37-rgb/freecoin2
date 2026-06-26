"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TasksPage() {
const [tasks, setTasks] =
useState<any[]>([]);

const [activeTask, setActiveTask] =
useState<any>(null);

const [timer, setTimer] =
useState(0);

useEffect(() => {
loadTasks();
}, []);

useEffect(() => {
if (timer <= 0) return;

const interval =
  setInterval(() => {
    setTimer(
      (prev) => prev - 1
    );
  }, 1000);

return () =>
  clearInterval(interval);

}, [timer]);

async function loadTasks() {

const tg =
  (window as any)
    ?.Telegram
    ?.WebApp;

const telegramUser =
  tg?.initDataUnsafe?.user;

if (!telegramUser)
  return;

const telegramId =
  telegramUser.id.toString();

const {
  data: completed,
} =
  await supabase
    .from(
      "task_completions"
    )
    .select("task_id")
    .eq(
      "telegram_id",
      telegramId
    );

const completedIds =
  completed?.map(
    (item) => item.task_id
  ) || [];

const { data } =
  await supabase
    .from("tasks")
    .select("*")
    .eq(
      "status",
      "active"
    )
    .order("id", {
      ascending: false,
    });

const filtered =
  (data || []).filter(
    (task) =>
      !completedIds.includes(
        task.id
      )
  );

setTasks(filtered);

}

function startTask(
task: any
) {
setActiveTask(task);
setTimer(15);

window.open(
  task.url,
  "_blank"
);

}

async function claimReward() {

if (!activeTask)
  return;

const tg =
  (window as any)
    ?.Telegram
    ?.WebApp;

const telegramUser =
  tg?.initDataUnsafe?.user;

if (!telegramUser)
  return;

const telegramId =
  telegramUser.id.toString();

const { data: user } =
  await supabase
    .from("users")
    .select("*")
    .eq(
      "telegram_id",
      telegramId
    )
    .single();

if (!user)
  return;

if (user.banned) {
  alert(
    "Account banned"
  );
  return;
}

const {
  data: existing,
} =
  await supabase
    .from(
      "task_completions"
    )
    .select("*")
    .eq(
      "task_id",
      activeTask.id
    )
    .eq(
      "telegram_id",
      telegramId
    )
    .maybeSingle();

if (existing) {
  alert(
    "Already completed"
  );
  return;
}

await supabase
  .from(
    "task_completions"
  )
  .insert([
    {
      task_id:
        activeTask.id,

      telegram_id:
        telegramId,

      reward:
        activeTask.reward,
    },
  ]);

await supabase
  .from("users")
  .update({
    free_balance:
      (user.free_balance || 0) +
      activeTask.reward,

    tasks_completed:
      (user.tasks_completed || 0) +
      1,
  })
  .eq(
    "telegram_id",
    telegramId
  );

await supabase
  .from("transactions")
  .insert([
    {
      telegram_id:
        telegramId,

      type: "task",

      amount:
        activeTask.reward,

      description:
        `Task: ${activeTask.title}`,
    },
  ]);

alert(
  `+${activeTask.reward} FREE`
);

setActiveTask(null);
setTimer(0);

loadTasks();

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
          key={task.id}
          className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6"
        >
          <h2 className="text-2xl font-bold">
            {task.title}
          </h2>

          <p className="text-zinc-400 mt-2">
            {task.description}
          </p>

          <div className="mt-4 text-green-400 text-2xl font-bold">
            +{task.reward} FREE
          </div>

          <button
            onClick={() =>
              startTask(task)
            }
            className="mt-5 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-2xl font-bold"
          >
            Open Task
          </button>

        </div>
      )
    )}

  </div>

  {activeTask && (

    <div className="fixed bottom-24 left-4 right-4 bg-zinc-950 border border-green-500 rounded-3xl p-5">

      <h3 className="font-bold text-xl mb-3">
        {activeTask.title}
      </h3>

      {timer > 0 ? (

        <div className="text-center">

          <p className="text-yellow-400 text-4xl font-bold">
            {timer}
          </p>

          <p>
            Wait before claiming
          </p>

        </div>

      ) : (

        <button
          onClick={
            claimReward
          }
          className="w-full bg-green-600 py-4 rounded-2xl font-bold"
        >
          Claim Reward
        </button>

      )}

    </div>

  )}

</main>

);
}
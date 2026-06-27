"use client";

import { useState, useEffect } from "react";
import { getDailyTasks, completeDailyTask, syncMining } from "../../lib/api";
import { calculateTaskCompletionReward, getTimeUntilReset, getTaskProgressPercentage, type DailyTask } from "../../lib/dailyTasks";

export default function DailyTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    const user = await syncMining();
    if (user) {
      setBalance(user.free_balance);
    }
    
    const tasksData = await getDailyTasks();
    setTasks(tasksData);
    setLoading(false);
  }

  const completedTasks = tasks.filter(t => t.completed);
  const totalReward = calculateTaskCompletionReward(tasks);
  const timeUntilReset = getTimeUntilReset();

  async function completeTask(taskId: string) {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    setCompleting(taskId);

    const result = await completeDailyTask(taskId);
    
    if (result) {
      setBalance(prev => prev + result.reward);
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, progress: t.requirement, completed: true }
          : t
      ));
      
      // Reload to get updated user data
      const user = await syncMining();
      if (user) {
        setBalance(user.free_balance);
      }
    }

    setCompleting(null);
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-blue-400 mb-8">📋 Daily Tasks</h1>

      {/* Progress Overview */}
      <div className="bg-zinc-950 border border-blue-700 rounded-3xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-400">Today's Progress</h2>
          <div className="text-right">
            <p className="text-zinc-500 text-sm">Resets in</p>
            <p className="text-xl font-bold text-white">{timeUntilReset}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-zinc-900 rounded-2xl p-4 text-center">
            <p className="text-4xl font-bold text-green-400">{completedTasks.length}/{tasks.length}</p>
            <p className="text-zinc-500 text-sm">Tasks Completed</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-4 text-center">
            <p className="text-4xl font-bold text-yellow-400">{totalReward}</p>
            <p className="text-zinc-500 text-sm">FREE Earned</p>
          </div>
        </div>

        <div className="w-full bg-zinc-800 rounded-full h-3">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all"
            style={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-zinc-950 border rounded-3xl p-6 ${
              task.completed ? 'border-green-700' : 'border-zinc-800'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{task.icon}</div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{task.name}</h3>
                <p className="text-zinc-500 text-sm mt-1">{task.description}</p>

                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">Progress</span>
                    <span className="text-white">{task.progress}/{task.requirement}</span>
                  </div>

                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        task.completed ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${getTaskProgressPercentage(task)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">+{task.reward}</p>
                <p className="text-zinc-500 text-xs">FREE</p>

                {!task.completed && task.progress >= task.requirement && (
                  <button
                    onClick={() => completeTask(task.id)}
                    disabled={loading}
                    className="mt-2 bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 rounded-xl px-4 py-2 font-bold text-sm transition"
                  >
                    Claim
                  </button>
                )}

                {task.completed && (
                  <div className="mt-2 bg-green-950 border border-green-700 rounded-xl px-4 py-2 text-center">
                    <p className="text-green-400 text-sm font-bold">✓ Done</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {completedTasks.length === tasks.length && (
        <div className="mt-6 bg-green-950 border border-green-700 rounded-3xl p-6 text-center">
          <p className="text-3xl mb-2">🎉</p>
          <h3 className="text-2xl font-bold text-green-400">All Tasks Completed!</h3>
          <p className="text-zinc-400 mt-2">Come back tomorrow for new tasks</p>
        </div>
      )}
    </main>
  );
}

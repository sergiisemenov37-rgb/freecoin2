export interface DailyTask {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  reward: number;
  type: 'mine' | 'upgrade' | 'referral' | 'task' | 'social';
  progress: number;
  completed: boolean;
}

export function generateDailyTasks(): DailyTask[] {
  return [
    {
      id: 'mine_100',
      name: 'Mine 100 FREE',
      description: 'Earn 100 FREE from mining',
      icon: '⛏️',
      requirement: 100,
      reward: 25,
      type: 'mine',
      progress: 0,
      completed: false
    },
    {
      id: 'upgrade_once',
      name: 'Upgrade Miner',
      description: 'Upgrade your miner at least once',
      icon: '🚀',
      requirement: 1,
      reward: 50,
      type: 'upgrade',
      progress: 0,
      completed: false
    },
    {
      id: 'complete_5_tasks',
      name: 'Complete 5 Tasks',
      description: 'Complete 5 tasks from the tasks page',
      icon: '✅',
      requirement: 5,
      reward: 75,
      type: 'task',
      progress: 0,
      completed: false
    },
    {
      id: 'share_telegram',
      name: 'Share on Telegram',
      description: 'Share FREECOIN with friends',
      icon: '📢',
      requirement: 1,
      reward: 30,
      type: 'social',
      progress: 0,
      completed: false
    },
    {
      id: 'login_3_times',
      name: 'Login 3 Times',
      description: 'Log in to the app 3 times today',
      icon: '🔐',
      requirement: 3,
      reward: 40,
      type: 'social',
      progress: 0,
      completed: false
    }
  ];
}

export function updateTaskProgress(
  tasks: DailyTask[],
  type: DailyTask['type'],
  amount: number = 1
): DailyTask[] {
  return tasks.map(task => {
    if (task.type === type && !task.completed) {
      const newProgress = Math.min(task.progress + amount, task.requirement);
      return {
        ...task,
        progress: newProgress,
        completed: newProgress >= task.requirement
      };
    }
    return task;
  });
}

export function calculateTaskCompletionReward(tasks: DailyTask[]): number {
  return tasks
    .filter(task => task.completed)
    .reduce((total, task) => total + task.reward, 0);
}

export function getTaskProgressPercentage(task: DailyTask): number {
  return (task.progress / task.requirement) * 100;
}

export function resetDailyTasks(): DailyTask[] {
  return generateDailyTasks();
}

export function getTimeUntilReset(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

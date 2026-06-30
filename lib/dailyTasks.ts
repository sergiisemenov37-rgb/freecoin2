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
  difficulty?: 'easy' | 'medium' | 'hard';
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
      completed: false,
      difficulty: 'easy'
    },
    {
      id: 'mine_500',
      name: 'Mine 500 FREE',
      description: 'Earn 500 FREE from mining',
      icon: '⛏️',
      requirement: 500,
      reward: 100,
      type: 'mine',
      progress: 0,
      completed: false,
      difficulty: 'medium'
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
      completed: false,
      difficulty: 'easy'
    },
    {
      id: 'upgrade_3_times',
      name: 'Upgrade 3 Times',
      description: 'Upgrade your miner 3 times',
      icon: '🚀',
      requirement: 3,
      reward: 150,
      type: 'upgrade',
      progress: 0,
      completed: false,
      difficulty: 'medium'
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
      completed: false,
      difficulty: 'medium'
    },
    {
      id: 'play_3_games',
      name: 'Play 3 Games',
      description: 'Play 3 casino or mini games',
      icon: '🎮',
      requirement: 3,
      reward: 60,
      type: 'task',
      progress: 0,
      completed: false,
      difficulty: 'easy'
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
      completed: false,
      difficulty: 'easy'
    },
    {
      id: 'invite_friend',
      name: 'Invite a Friend',
      description: 'Invite at least 1 friend',
      icon: '👥',
      requirement: 1,
      reward: 100,
      type: 'referral',
      progress: 0,
      completed: false,
      difficulty: 'medium'
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
      completed: false,
      difficulty: 'easy'
    },
    {
      id: 'claim_streak',
      name: 'Claim Daily Streak',
      description: 'Claim your daily streak reward',
      icon: '🔥',
      requirement: 1,
      reward: 50,
      type: 'social',
      progress: 0,
      completed: false,
      difficulty: 'easy'
    },
    {
      id: 'win_casino',
      name: 'Win Casino Game',
      description: 'Win at least 1 casino game',
      icon: '🎰',
      requirement: 1,
      reward: 80,
      type: 'task',
      progress: 0,
      completed: false,
      difficulty: 'medium'
    },
    {
      id: 'join_guild',
      name: 'Join a Guild',
      description: 'Join or create a guild',
      icon: '🏰',
      requirement: 1,
      reward: 120,
      type: 'social',
      progress: 0,
      completed: false,
      difficulty: 'medium'
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

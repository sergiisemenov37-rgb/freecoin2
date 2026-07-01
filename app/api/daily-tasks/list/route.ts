import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

const DAILY_TASKS = [
  { id: 'login', name: 'Login', description: 'Log in to the game', reward: 100, target: 1 },
  { id: 'mine_100', name: 'Mine 100 coins', description: 'Mine 100 coins', reward: 200, target: 100 },
  { id: 'referral', name: 'Refer a friend', description: 'Refer a new friend', reward: 500, target: 1 },
  { id: 'upgrade', name: 'Upgrade miner', description: 'Upgrade your miner', reward: 300, target: 1 },
  { id: 'play_game', name: 'Play a game', description: 'Play one of the mini-games', reward: 150, target: 1 },
];

export async function GET(req: NextRequest) {
  try {
    const initData = req.nextUrl.searchParams.get('initData') || '';
    const user = await verifyTelegramInit(initData);

    const today = new Date().toISOString().split('T')[0];

    const { data: userTasks } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('telegram_id', user.id)
      .eq('date', today);

    const tasks = DAILY_TASKS.map(task => {
      const userTask = userTasks?.find(t => t.task_id === task.id);
      return {
        ...task,
        progress: userTask?.progress || 0,
        completed: userTask?.completed || false,
      };
    });

    return NextResponse.json({ tasks });
  } catch (error: any) {
    logger.error('Failed to fetch daily tasks', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

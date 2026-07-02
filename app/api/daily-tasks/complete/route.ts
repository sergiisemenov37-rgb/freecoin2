import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

const TASK_REWARDS: Record<string, number> = {
  login: 100,
  mine_100: 200,
  referral: 500,
  upgrade: 300,
  play_game: 150,
  youtube_subscribe: 300,
};

export async function POST(req: NextRequest) {
  try {
    const { initData, taskId } = await req.json();
    const user = await verifyTelegramInit(initData);

    const today = new Date().toISOString().split('T')[0];
    const reward = TASK_REWARDS[taskId] || 100;

    // Get or create task
    const { data: existingTask } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('telegram_id', user.id)
      .eq('task_id', taskId)
      .eq('date', today)
      .single();

    if (existingTask?.completed) {
      return NextResponse.json({ error: 'Task already completed' }, { status: 400 });
    }

    if (existingTask) {
      // Update existing task
      await supabase
        .from('daily_tasks')
        .update({ completed: true, progress: existingTask.target })
        .eq('id', existingTask.id);
    } else {
      // Create new task
      await supabase.from('daily_tasks').insert({
        telegram_id: user.id,
        task_id: taskId,
        progress: 1,
        completed: true,
        date: today,
      });
    }

    // Add reward to user balance
    const { data: userData } = await supabase
      .from('users')
      .select('free_balance')
      .eq('telegram_id', user.id)
      .single();

    const newBalance = (userData?.free_balance || 0) + reward;
    await supabase.from('users').update({ free_balance: newBalance }).eq('telegram_id', user.id);

    logger.info('Task completed', { user_id: user.id, task_id: taskId, reward });

    return NextResponse.json({ success: true, reward });
  } catch (error: any) {
    logger.error('Failed to complete task', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

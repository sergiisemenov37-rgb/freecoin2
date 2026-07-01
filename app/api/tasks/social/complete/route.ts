import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/server/apiAuth";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { completeSocialMediaTask, generateDailyTasks } from "@/lib/dailyTasks";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body: { taskId: string } = await req.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get user's current tasks
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("daily_tasks")
      .eq("telegram_id", auth.telegramId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let currentTasks = user.daily_tasks ? JSON.parse(user.daily_tasks as string) : generateDailyTasks();
    
    // Complete the social media task
    const updatedTasks = completeSocialMediaTask(currentTasks, taskId);
    
    // Find the completed task to get reward
    const completedTask = updatedTasks.find((t: any) => t.id === taskId);
    
    if (!completedTask || !completedTask.completed) {
      return NextResponse.json({ error: "Task could not be completed" }, { status: 400 });
    }

    // Update user balance
    await supabase
      .from("users")
      .update({ 
        free_balance: supabase.raw(`free_balance + ${completedTask.reward}`),
        daily_tasks: JSON.stringify(updatedTasks)
 })
      .eq("telegram_id", auth.telegramId);

    // Record transaction
    await supabase.from("transactions").insert({
      telegram_id: auth.telegramId,
      type: "task_reward",
      amount: completedTask.reward,
      description: `Social media task: ${completedTask.name}`
    });

    return NextResponse.json({ 
      success: true, 
      reward: completedTask.reward,
      message: `Task completed! You earned ${completedTask.reward} FREE`
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to complete task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

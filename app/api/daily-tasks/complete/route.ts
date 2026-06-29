import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { calculateTaskCompletionReward } from "../../../../lib/dailyTasks";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await req.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const today = new Date().toISOString().split('T')[0];

    // Get the task
    const { data: task, error: fetchError } = await supabase
      .from("daily_tasks")
      .select("*")
      .eq("telegram_id", auth.telegramId)
      .eq("task_id", taskId)
      .eq("date", today)
      .single();

    if (fetchError || !task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.completed) {
      return NextResponse.json({ error: "Task already completed" }, { status: 400 });
    }

    // Get task details from lib
    const allTasks = await import("../../../../lib/dailyTasks").then(m => m.generateDailyTasks());
    const taskDetails = allTasks.find((t: any) => t.id === taskId);

    if (!taskDetails) {
      return NextResponse.json({ error: "Task details not found" }, { status: 404 });
    }

    // Calculate reward
    const reward = calculateTaskCompletionReward([taskDetails]);

    // Update task as completed
    const { error: updateError } = await supabase
      .from("daily_tasks")
      .update({ completed: true, progress: taskDetails.requirement })
      .eq("id", task.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Add reward to user balance
    const { error: balanceError } = await supabase
      .from("users")
      .update({ free_balance: supabase.rpc('increment', { amount: reward }) })
      .eq("telegram_id", auth.telegramId);

    if (balanceError) {
      // Rollback task completion if balance update fails
      await supabase
        .from("daily_tasks")
        .update({ completed: false })
        .eq("id", task.id);
      
      return NextResponse.json({ error: balanceError.message }, { status: 500 });
    }

    // Add transaction record
    await supabase.from("transactions").insert([{
      telegram_id: auth.telegramId,
      type: "task",
      amount: reward,
      description: `Daily task: ${taskDetails.name}`
    }]);

    return NextResponse.json({ 
      success: true, 
      reward,
      task: { ...task, completed: true, progress: taskDetails.requirement }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to complete task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

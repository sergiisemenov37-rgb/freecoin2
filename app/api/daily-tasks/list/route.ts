import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";
import { generateDailyTasks } from "../../../../lib/dailyTasks";

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = getSupabaseAdmin();
    const today = new Date().toISOString().split('T')[0];

    // Get existing tasks for today
    const { data: existingTasks, error: fetchError } = await supabase
      .from("daily_tasks")
      .select("*")
      .eq("telegram_id", auth.telegramId)
      .eq("date", today);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // If tasks exist, return them
    if (existingTasks && existingTasks.length > 0) {
      return NextResponse.json({ tasks: existingTasks });
    }

    // Otherwise, generate new tasks for today
    const newTasks = generateDailyTasks();
    
    // Insert new tasks into database
    const tasksToInsert = newTasks.map(task => ({
      telegram_id: auth.telegramId,
      task_id: task.id,
      progress: 0,
      completed: false,
      date: today
    }));

    const { error: insertError } = await supabase
      .from("daily_tasks")
      .insert(tasksToInsert);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Return the generated tasks with progress
    const tasksWithProgress = newTasks.map((task, index) => ({
      ...task,
      progress: 0,
      completed: false,
      date: today
    }));

    return NextResponse.json({ tasks: tasksWithProgress });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load daily tasks";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

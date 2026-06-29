import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await req.json();
    const { taskId, progress } = body;

    if (!taskId || progress === undefined) {
      return NextResponse.json({ error: "Task ID and progress are required" }, { status: 400 });
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

    // Get task details to check max progress
    const allTasks = await import("../../../../lib/dailyTasks").then(m => m.generateDailyTasks());
    const taskDetails = allTasks.find((t: any) => t.id === taskId);

    if (!taskDetails) {
      return NextResponse.json({ error: "Task details not found" }, { status: 404 });
    }

    if (progress > taskDetails.requirement) {
      return NextResponse.json({ error: "Progress exceeds requirement" }, { status: 400 });
    }

    // Update progress
    const { error: updateError } = await supabase
      .from("daily_tasks")
      .update({ progress })
      .eq("id", task.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Check if task is now complete
    const isComplete = progress >= taskDetails.requirement;

    return NextResponse.json({ 
      success: true, 
      progress,
      completed: isComplete
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update progress";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

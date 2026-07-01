import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { monitoring } from "../../../../lib/monitoring";
import { logger } from "../../../../lib/logger";

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const metrics = monitoring.getAllMetrics();
    const performanceMetrics = monitoring.getPerformanceMetrics();
    const logCount = logger.getLogCount();

    return NextResponse.json({
      metrics,
      performanceMetrics: performanceMetrics.slice(-100), // Last 100
      logCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch metrics";
    logger.error("Failed to fetch monitoring metrics", { error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

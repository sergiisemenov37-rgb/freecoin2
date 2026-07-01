import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { cacheManager } from "../../../../lib/cache";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    cacheManager.clear();
    return NextResponse.json({ success: true, message: "Cache cleared" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to clear cache";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

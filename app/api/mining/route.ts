import { NextResponse } from "next/server";

import { authenticateRequest } from "../../../lib/server/apiAuth";
import { updateMining } from "../../../lib/server/miningService";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    if (!auth.telegramId) {
      return NextResponse.json({ error: "Invalid telegram ID" }, { status: 400 });
    }
    
    const user = await updateMining(auth.telegramId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Mining update failed";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

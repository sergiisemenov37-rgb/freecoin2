import { NextResponse } from "next/server";

import { authenticateRequest } from "../../../lib/server/apiAuth";
import { upgradeMiner } from "../../../lib/server/miningService";

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  if (!auth.telegramId) {
    return NextResponse.json({ error: "Invalid telegram ID" }, { status: 400 });
  }

  const result = await upgradeMiner(auth.telegramId);

  if (!result.success) {
    const status = result.error === "User not found" ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result);
}

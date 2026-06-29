import { NextResponse } from "next/server";

import { authenticateRegisterRequest } from "../../../lib/server/apiAuth";
import { ensureUserRegistered } from "../../../lib/server/userService";

export async function POST(req: Request) {
  const auth = await authenticateRegisterRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const user = await ensureUserRegistered(auth.user, auth.referrerId);

    if (!user) {
      return NextResponse.json(
        { error: "Failed to register user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

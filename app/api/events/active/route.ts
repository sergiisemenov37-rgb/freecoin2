import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/server/apiAuth";
import { getSupabaseAdmin } from "../../../../lib/server/supabaseAdmin";

// Event definitions (in production, these would be stored in database)
const EVENTS = [
  {
    id: "mining_boost",
    name: "Mining Boost Weekend",
    description: "2x mining power all weekend!",
    icon: "⚡",
    bonusMultiplier: 2,
    bonusType: "mining",
    startDate: "2026-07-01T00:00:00Z",
    endDate: "2026-07-03T23:59:59Z",
    isActive: true
  },
  {
    id: "casino_bonus",
    name: "Casino Fever",
    description: "1.5x rewards on all casino games!",
    icon: "🎰",
    bonusMultiplier: 1.5,
    bonusType: "casino",
    startDate: "2026-07-05T00:00:00Z",
    endDate: "2026-07-07T23:59:59Z",
    isActive: false
  },
  {
    id: "referral_bonus",
    name: "Friend Frenzy",
    description: "Double referral bonuses!",
    icon: "👥",
    bonusMultiplier: 2,
    bonusType: "referral",
    startDate: "2026-07-10T00:00:00Z",
    endDate: "2026-07-12T23:59:59Z",
    isActive: false
  }
];

export async function GET(req: Request) {
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const now = new Date().toISOString();

    // Filter active events
    const activeEvents = EVENTS.filter(event => {
      if (!event.isActive) return false;
      return now >= event.startDate && now <= event.endDate;
    });

    // Calculate remaining time for each event
    const eventsWithTime = activeEvents.map(event => {
      const endTime = new Date(event.endDate);
      const nowTime = new Date();
      const remainingMs = endTime.getTime() - nowTime.getTime();
      const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
      const remainingDays = Math.floor(remainingHours / 24);

      return {
        ...event,
        remainingTime: remainingMs > 0 ? {
          days: remainingDays,
          hours: remainingHours % 24,
          totalHours: remainingHours
        } : null
      };
    });

    return NextResponse.json({ events: eventsWithTime });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch events";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

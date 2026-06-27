import type { AppUser, UpgradeResult } from "./types/user";
import { getTelegramInitData } from "./telegramUser";

type ApiError = { error: string };

async function postApi<T>(
  path: string,
  body: Record<string, unknown> = {}
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const initData = getTelegramInitData();

  if (!initData) {
    return { ok: false, error: "Telegram not available" };
  }

  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, initData }),
  });

  const payload = (await response.json()) as T & ApiError;

  if (!response.ok) {
    return {
      ok: false,
      error: payload.error || "Request failed",
    };
  }

  return { ok: true, data: payload };
}

async function getApi<T>(
  path: string
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const initData = getTelegramInitData();

  if (!initData) {
    return { ok: false, error: "Telegram not available" };
  }

  const response = await fetch(`${path}?initData=${encodeURIComponent(initData)}`, {
    method: "GET",
  });

  const payload = (await response.json()) as T & ApiError;

  if (!response.ok) {
    return {
      ok: false,
      error: payload.error || "Request failed",
    };
  }

  return { ok: true, data: payload };
}

export async function registerUser(
  referrerId: string | null
): Promise<AppUser | null> {
  const result = await postApi<{ user: AppUser }>("/api/register", {
    referrerId,
  });

  return result.ok ? result.data.user : null;
}

export async function syncMining(): Promise<AppUser | null> {
  const result = await postApi<{ user: AppUser }>("/api/mining");

  return result.ok ? result.data.user : null;
}

export async function upgradeMiner(): Promise<UpgradeResult> {
  const result = await postApi<UpgradeResult>("/api/upgrade");

  if (!result.ok) {
    return { success: false, error: result.error };
  }

  return result.data;
}

// Daily Tasks
export async function getDailyTasks() {
  const result = await getApi<{ tasks: any[] }>("/api/daily-tasks/list");
  return result.ok ? result.data.tasks : [];
}

export async function completeDailyTask(taskId: string) {
  const result = await postApi<{ success: boolean; reward: number }>("/api/daily-tasks/complete", { taskId });
  return result.ok ? result.data : null;
}

export async function updateDailyTaskProgress(taskId: string, progress: number) {
  const result = await postApi<{ success: boolean; completed: boolean }>("/api/daily-tasks/progress", { taskId, progress });
  return result.ok ? result.data : null;
}

// Friends
export async function addFriend(friendTelegramId: string) {
  const result = await postApi<{ success: boolean }>("/api/friends/add", { friendTelegramId });
  return result.ok ? result.data : null;
}

export async function acceptFriendRequest(requestId: string) {
  const result = await postApi<{ success: boolean }>("/api/friends/accept", { requestId });
  return result.ok ? result.data : null;
}

export async function rejectFriendRequest(requestId: string) {
  const result = await postApi<{ success: boolean }>("/api/friends/reject", { requestId });
  return result.ok ? result.data : null;
}

export async function getFriends() {
  const result = await getApi<{ friends: any[] }>("/api/friends/list");
  return result.ok ? result.data.friends : [];
}

export async function getFriendRequests() {
  const result = await getApi<{ requests: any[] }>("/api/friends/requests");
  return result.ok ? result.data.requests : [];
}

export async function sendMessage(toTelegramId: string, content: string) {
  const result = await postApi<{ success: boolean }>("/api/friends/message", { toTelegramId, content });
  return result.ok ? result.data : null;
}

export async function getMessages(friendTelegramId: string) {
  const result = await getApi<{ messages: any[] }>(`/api/friends/messages?friend=${friendTelegramId}`);
  return result.ok ? result.data.messages : [];
}

// Guilds
export async function createGuild(name: string, description: string, emblem: string) {
  const result = await postApi<{ success: boolean; guild: any }>("/api/guilds/create", { name, description, emblem });
  return result.ok ? result.data : null;
}

export async function joinGuild(guildId: number) {
  const result = await postApi<{ success: boolean; guild: any }>("/api/guilds/join", { guildId });
  return result.ok ? result.data : null;
}

export async function getGuilds() {
  const result = await getApi<{ guilds: any[] }>("/api/guilds/list");
  return result.ok ? result.data.guilds : [];
}

export async function getMyGuild() {
  const result = await getApi<{ guild: any }>("/api/guilds/my");
  return result.ok ? result.data.guild : null;
}

export async function sendGuildMessage(content: string) {
  const result = await postApi<{ success: boolean }>("/api/guilds/message", { content });
  return result.ok ? result.data : null;
}

// Tournaments
export async function getTournaments() {
  const result = await getApi<{ tournaments: any[] }>("/api/tournaments/list");
  return result.ok ? result.data.tournaments : [];
}

export async function joinTournament(tournamentId: number) {
  const result = await postApi<{ success: boolean; tournament: any }>("/api/tournaments/join", { tournamentId });
  return result.ok ? result.data : null;
}

export async function getMyTournaments() {
  const result = await getApi<{ tournaments: any[] }>("/api/tournaments/my");
  return result.ok ? result.data.tournaments : [];
}

// Games
export async function getGames() {
  const result = await getApi<{ games: any[] }>("/api/games/list");
  return result.ok ? result.data.games : [];
}

export async function playGame(gameId: string, score?: number, clicks?: number, attempts?: number) {
  const result = await postApi<{ success: boolean; reward: number; completed: boolean }>("/api/games/play", { gameId, score, clicks, attempts });
  return result.ok ? result.data : null;
}

// Voting
export async function getProposals() {
  const result = await getApi<{ proposals: any[] }>("/api/voting/list");
  return result.ok ? result.data.proposals : [];
}

export async function createProposal(title: string, description: string, type: string) {
  const result = await postApi<{ success: boolean }>("/api/voting/create", { title, description, type });
  return result.ok ? result.data : null;
}

export async function vote(proposalId: number, choice: string) {
  const result = await postApi<{ success: boolean; proposal: any }>("/api/voting/vote", { proposalId, choice });
  return result.ok ? result.data : null;
}

// Shop
export async function purchaseItem(itemId: string) {
  const result = await postApi<{ success: boolean; item: any }>("/api/shop/purchase", { itemId });
  return result.ok ? result.data : null;
}

export async function getMyPurchases() {
  const result = await getApi<{ items: any[] }>("/api/shop/my");
  return result.ok ? result.data.items : [];
}

// Promo Codes
export async function redeemPromoCode(code: string) {
  const result = await postApi<{ success: boolean; reward: number; type: string }>("/api/promo-codes/redeem", { code });
  return result.ok ? result.data : null;
}

// Lottery
export async function buyLotteryTickets(count: number) {
  const result = await postApi<{ success: boolean; count: number; totalCost: number; drawId: number }>("/api/lottery/buy-ticket", { count });
  return result.ok ? result.data : null;
}

export async function getMyLotteryTickets() {
  const result = await getApi<{ tickets: any[] }>("/api/lottery/my-tickets");
  return result.ok ? result.data.tickets : [];
}

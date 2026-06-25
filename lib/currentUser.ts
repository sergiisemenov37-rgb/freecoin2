import { supabase } from "./supabase";

export async function getCurrentUser() {
const tg =
(window as any)
?.Telegram
?.WebApp;

const telegramUser =
tg?.initDataUnsafe?.user;

if (!telegramUser)
return null;

const { data } =
await supabase
.from("users")
.select("*")
.eq(
"telegram_id",
telegramUser.id.toString()
)
.single();

return data;
}
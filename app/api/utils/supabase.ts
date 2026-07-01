import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function verifyTelegramInit(initData: string): Promise<any> {
  // Verify Telegram init data signature
  const data = new URLSearchParams(initData);
  const hash = data.get('hash');
  data.delete('hash');

  const checkString = Array.from(data.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const crypto = require('crypto');
  const secret = crypto.createHmac('sha256', 'WebAppData').update(process.env.TELEGRAM_BOT_TOKEN || '').digest();
  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');

  if (hmac !== hash) {
    throw new Error('Invalid Telegram init data');
  }

  const user = JSON.parse(data.get('user') || '{}');
  return user;
}

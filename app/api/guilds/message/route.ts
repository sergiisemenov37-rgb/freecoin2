import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { initData, guildId, content } = await req.json();
    const user = await verifyTelegramInit(initData);

    // Check if user is member of guild
    const { data: member } = await supabase
      .from('guild_members')
      .select('id')
      .eq('guild_id', guildId)
      .eq('telegram_id', user.id)
      .single();

    if (!member) {
      return NextResponse.json({ error: 'Not a guild member' }, { status: 403 });
    }

    const { error } = await supabase.from('guild_messages').insert({
      guild_id: guildId,
      from_telegram_id: user.id,
      content,
      type: 'text',
    });

    if (error) throw error;

    logger.info('Guild message sent', { user_id: user.id, guild_id: guildId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Failed to send guild message', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

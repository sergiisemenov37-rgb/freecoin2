import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { initData, guildId } = await req.json();
    const user = await verifyTelegramInit(initData);

    // Check if already in guild
    const { data: existingMember } = await supabase
      .from('guild_members')
      .select('id')
      .eq('guild_id', guildId)
      .eq('telegram_id', user.id)
      .single();

    if (existingMember) {
      return NextResponse.json({ error: 'Already in guild' }, { status: 400 });
    }

    // Add to guild
    await supabase.from('guild_members').insert({
      guild_id: guildId,
      telegram_id: user.id,
      role: 'member',
      contribution: 0,
    });

    // Update user guild_id
    await supabase.from('users').update({ guild_id: guildId }).eq('telegram_id', user.id);

    logger.info('User joined guild', { user_id: user.id, guild_id: guildId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Failed to join guild', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

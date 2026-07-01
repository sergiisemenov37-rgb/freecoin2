import { NextRequest, NextResponse } from 'next/server';
import { supabase, verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { initData, name, description, emblem } = await req.json();
    const user = await verifyTelegramInit(initData);

    if (!name || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create guild
    const { data: guild, error: guildError } = await supabase
      .from('guilds')
      .insert({
        name,
        description,
        emblem,
        leader_id: user.id,
        level: 1,
        total_power: 0,
        total_balance: 0,
      })
      .select()
      .single();

    if (guildError) throw guildError;

    // Add leader as member
    await supabase.from('guild_members').insert({
      guild_id: guild.id,
      telegram_id: user.id,
      role: 'leader',
      contribution: 0,
    });

    // Update user guild_id
    await supabase.from('users').update({ guild_id: guild.id }).eq('telegram_id', user.id);

    logger.info('Guild created', { guild_id: guild.id, leader: user.id });

    return NextResponse.json({ success: true, guild });
  } catch (error: any) {
    logger.error('Failed to create guild', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

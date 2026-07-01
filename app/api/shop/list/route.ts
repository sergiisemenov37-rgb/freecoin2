import { NextRequest, NextResponse } from 'next/server';
import { verifyTelegramInit } from '../../utils/supabase';
import { logger } from '@/lib/logger';

const SHOP_ITEMS = [
  { id: 'skin_red', name: 'Red Miner Skin', description: 'Make your miner red', price: 500, type: 'cosmetic', icon: '🔴' },
  { id: 'skin_blue', name: 'Blue Miner Skin', description: 'Make your miner blue', price: 500, type: 'cosmetic', icon: '🔵' },
  { id: 'boost_2x', name: '2x Mining Boost', description: 'Double mining rewards for 1 hour', price: 1000, type: 'boost', icon: '⚡' },
  { id: 'energy_pack', name: 'Energy Pack', description: 'Restore energy', price: 300, type: 'consumable', icon: '🔋' },
];

export async function GET(req: NextRequest) {
  try {
    const initData = req.nextUrl.searchParams.get('initData') || '';
    await verifyTelegramInit(initData);

    return NextResponse.json({ items: SHOP_ITEMS });
  } catch (error: any) {
    logger.error('Failed to fetch shop items', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

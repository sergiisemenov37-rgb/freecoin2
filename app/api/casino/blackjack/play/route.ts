import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/server/apiAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { logger } from '@/lib/logger';

interface BlackjackCard {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: string;
}

function createDeck(): BlackjackCard[] {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: BlackjackCard[] = [];
  
  for (let i = 0; i < 6; i++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }
  }
  
  return deck.sort(() => Math.random() - 0.5);
}

function getCardValue(rank: string): number {
  if (rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank, 10);
}

function calculateHandValue(hand: BlackjackCard[]): { value: number; isAce: boolean } {
  let value = 0;
  let aces = 0;
  
  for (const card of hand) {
    value += getCardValue(card.rank);
    if (card.rank === 'A') aces++;
  }
  
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  
  return { value, isAce: aces > 0 };
}

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.ok) {
      return auth.response as NextResponse;
    }

    const { bet } = await req.json();
    
    if (!bet || bet < 10 || bet > 10000) {
      return NextResponse.json({ error: 'Invalid bet amount' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    
    // Get user balance
    const { data: user } = await supabase
      .from('users')
      .select('free_balance')
      .eq('telegram_id', auth.telegramId)
      .single();

    if (!user || (user.free_balance as number) < bet) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Create game
    const deck = createDeck();
    const playerHand = [deck.pop()!, deck.pop()!];
    const dealerHand = [deck.pop()!, deck.pop()!];

    const playerValue = calculateHandValue(playerHand).value;
    const dealerUpcard = getCardValue(dealerHand[0].rank);

    // Check for blackjack
    const playerBlackjack = playerHand.length === 2 && playerValue === 21;
    const dealerBlackjack = dealerHand.length === 2 && calculateHandValue(dealerHand).value === 21;

    let result = 'active';
    let winnings = 0;

    if (playerBlackjack && dealerBlackjack) {
      result = 'push';
      winnings = bet; // Push - return bet
    } else if (playerBlackjack) {
      result = 'player_win';
      winnings = Math.floor(bet * 2.5); // Blackjack pays 3:2
    } else if (dealerBlackjack) {
      result = 'dealer_win';
      winnings = 0;
    }

    // Save game
    const { data: game } = await supabase
      .from('game_sessions')
      .insert({
        telegram_id: auth.telegramId,
        game_id: 'blackjack',
        score: playerValue,
        reward: winnings > bet ? winnings - bet : 0,
        completed: result !== 'active',
      })
      .select()
      .single();

    // Update balance if game is complete
    if (result !== 'active') {
      const newBalance = (user.free_balance as number) - bet + winnings;
      await supabase
        .from('users')
        .update({ free_balance: newBalance })
        .eq('telegram_id', auth.telegramId);
    }

    logger.info('Blackjack game started', { 
      user_id: auth.telegramId, 
      bet,
      result
    });

    return NextResponse.json({
      success: true,
      gameId: game?.id,
      playerHand,
      dealerUpcard: dealerHand[0],
      result,
      winnings
    });
  } catch (error: any) {
    logger.error('Blackjack game error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

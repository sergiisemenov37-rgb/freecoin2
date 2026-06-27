export interface EasterEgg {
  id: string;
  name: string;
  description: string;
  icon: string;
  trigger: string;
  reward: number;
  type: 'code' | 'action' | 'hidden';
  discovered: boolean;
  discovered_at?: string;
  hint: string;
}

export const EASTER_EGGS: EasterEgg[] = [
  {
    id: 'secret_code_420',
    name: 'Blaze It',
    description: 'Enter the secret code',
    icon: '🌿',
    trigger: '420',
    reward: 69,
    type: 'code',
    discovered: false,
    hint: 'It\'s a time, not just a number...'
  },
  {
    id: 'secret_code_1337',
    name: 'Leet Speak',
    description: 'Enter the hacker code',
    icon: '💻',
    trigger: '1337',
    reward: 100,
    type: 'code',
    discovered: false,
    hint: 'Elite hackers know this one'
  },
  {
    id: 'click_100_times',
    name: 'Clicker Master',
    description: 'Click the miner 100 times',
    icon: '👆',
    trigger: 'click_100',
    reward: 50,
    type: 'action',
    discovered: false,
    hint: 'Keep clicking...'
  },
  {
    id: 'mining_at_midnight',
    name: 'Night Owl',
    description: 'Mine at midnight',
    icon: '🦉',
    trigger: 'midnight_mining',
    reward: 75,
    type: 'action',
    discovered: false,
    hint: 'The night is young...'
  },
  {
    id: 'konami_code',
    name: 'Gamer',
    description: 'Enter the Konami code',
    icon: '🎮',
    trigger: '↑↑↓↓←→←→BA',
    reward: 200,
    type: 'code',
    discovered: false,
    hint: 'Up, Up, Down, Down, Left, Right, Left, Right, B, A'
  },
  {
    id: 'level_100',
    name: 'Max Level',
    description: 'Reach level 100',
    icon: '🏆',
    trigger: 'level_100',
    reward: 1000,
    type: 'hidden',
    discovered: false,
    hint: 'Reach the maximum level'
  },
  {
    id: 'first_of_month',
    name: 'Early Bird',
    description: 'Login on the first day of the month',
    icon: '🐦',
    trigger: 'first_day',
    reward: 100,
    type: 'action',
    discovered: false,
    hint: 'Be the first...'
  },
  {
    id: 'referral_100',
    name: 'Influencer',
    description: 'Refer 100 users',
    icon: '📢',
    trigger: 'referral_100',
    reward: 5000,
    type: 'hidden',
    discovered: false,
    hint: 'Build your army'
  }
];

export function checkEasterEgg(trigger: string): EasterEgg | null {
  return EASTER_EGGS.find(egg => egg.trigger === trigger && !egg.discovered) || null;
}

export function discoverEasterEgg(eggId: string): EasterEgg | null {
  const egg = EASTER_EGGS.find(e => e.id === eggId);
  if (egg) {
    egg.discovered = true;
    egg.discovered_at = new Date().toISOString();
  }
  return egg || null;
}

export function getDiscoveredEggsCount(): number {
  return EASTER_EGGS.filter(egg => egg.discovered).length;
}

export function getTotalEggsCount(): number {
  return EASTER_EGGS.length;
}

export function getEasterEggProgress(): number {
  return (getDiscoveredEggsCount() / getTotalEggsCount()) * 100;
}

export function getRandomHint(): string {
  const undiscovered = EASTER_EGGS.filter(egg => !egg.discovered);
  if (undiscovered.length === 0) return 'All eggs discovered!';
  
  const randomEgg = undiscovered[Math.floor(Math.random() * undiscovered.length)];
  return randomEgg.hint;
}

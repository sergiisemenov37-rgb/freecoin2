# Database Schema Guide

## Current Working Tables

### users
- telegram_id (string, primary key)
- wallet (string)
- free_balance (number)
- tasks_completed (number)
- miner_level (number)
- miner_power (number)
- last_mining (timestamp)
- banned (boolean)
- referred_by (string, nullable)

### telegram_users
- telegram_id (string, primary key)
- username (string)
- first_name (string)

### referrals
- referrer_id (string)
- invited_id (string)
- reward (number)

### transactions
- telegram_id (string)
- type (string)
- amount (number)
- description (string)
- created_at (timestamp)

## Required New Tables for Enhanced Features

### 1. Friends System
```sql
CREATE TABLE friends (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  friend_telegram_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(telegram_id, friend_telegram_id)
);

CREATE TABLE friend_requests (
  id SERIAL PRIMARY KEY,
  from_telegram_id VARCHAR(255),
  to_telegram_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_telegram_id VARCHAR(255),
  to_telegram_id VARCHAR(255),
  content TEXT,
  type VARCHAR(50) DEFAULT 'text',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Guilds System
```sql
CREATE TABLE guilds (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  emblem VARCHAR(50),
  leader_id VARCHAR(255),
  level INTEGER DEFAULT 1,
  total_power INTEGER DEFAULT 0,
  total_balance INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE guild_members (
  id SERIAL PRIMARY KEY,
  guild_id INTEGER,
  telegram_id VARCHAR(255),
  role VARCHAR(50) DEFAULT 'member',
  contribution INTEGER DEFAULT 0,
  joined_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (guild_id) REFERENCES guilds(id)
);

CREATE TABLE guild_messages (
  id SERIAL PRIMARY KEY,
  guild_id INTEGER,
  from_telegram_id VARCHAR(255),
  content TEXT,
  type VARCHAR(50) DEFAULT 'text',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (guild_id) REFERENCES guilds(id)
);
```

### 3. Tournaments System
```sql
CREATE TABLE tournaments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  type VARCHAR(50),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  prize_pool INTEGER,
  entry_fee INTEGER,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'upcoming'
);

CREATE TABLE tournament_participants (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER,
  telegram_id VARCHAR(255),
  score INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
);
```

### 4. Reputation System
```sql
CREATE TABLE reputation_actions (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  action VARCHAR(50),
  from_telegram_id VARCHAR(255),
  weight INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Trophies and Achievements
```sql
CREATE TABLE user_trophies (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  trophy_id VARCHAR(255),
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP,
  UNIQUE(telegram_id, trophy_id)
);

CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  achievement_id VARCHAR(255),
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP,
  UNIQUE(telegram_id, achievement_id)
);
```

### 6. Mini Games
```sql
CREATE TABLE game_sessions (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  game_id VARCHAR(255),
  score INTEGER,
  reward INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

### 7. Voting System
```sql
CREATE TABLE vote_proposals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  type VARCHAR(50),
  proposer_id VARCHAR(255),
  proposer_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  ends_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  min_votes_required INTEGER DEFAULT 10
);

CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  proposal_id INTEGER,
  voter_id VARCHAR(255),
  choice VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (proposal_id) REFERENCES vote_proposals(id)
);
```

### 8. Shop and Purchases
```sql
CREATE TABLE user_purchases (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  item_id VARCHAR(255),
  item_type VARCHAR(50),
  price INTEGER,
  purchased_at TIMESTAMP DEFAULT NOW()
);
```

### 9. Promo Codes
```sql
CREATE TABLE promo_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) UNIQUE,
  reward INTEGER,
  type VARCHAR(50),
  duration INTEGER,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_promo_uses (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  promo_code_id INTEGER,
  used_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id)
);
```

### 10. Lottery System
```sql
CREATE TABLE lottery_draws (
  id SERIAL PRIMARY KEY,
  draw_date TIMESTAMP,
  prize_pool INTEGER,
  winning_number INTEGER,
  ticket_price INTEGER DEFAULT 50,
  total_tickets INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'upcoming'
);

CREATE TABLE lottery_tickets (
  id SERIAL PRIMARY KEY,
  draw_id INTEGER,
  telegram_id VARCHAR(255),
  ticket_number INTEGER,
  purchased_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (draw_id) REFERENCES lottery_draws(id)
);
```

### 11. Daily Tasks
```sql
CREATE TABLE daily_tasks (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  task_id VARCHAR(255),
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  date DATE DEFAULT CURRENT_DATE,
  UNIQUE(telegram_id, task_id, date)
);
```

## Required Updates to Existing Tables

### users table - Add new columns:
```sql
ALTER TABLE users ADD COLUMN streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN last_streak_date TIMESTAMP;
ALTER TABLE users ADD COLUMN guild_id VARCHAR(255) REFERENCES guilds(id);
ALTER TABLE users ADD COLUMN reputation_score INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN total_mined INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE users ADD COLUMN vip_level INTEGER DEFAULT 0;
```

## API Endpoints Needed

### Existing (Working):
- POST /api/register
- POST /api/mining  
- POST /api/upgrade

### Needed for New Features:
- POST /api/friends/add
- POST /api/friends/accept
- POST /api/friends/message
- POST /api/guilds/create
- POST /api/guilds/join
- POST /api/tournaments/join
- POST /api/games/play
- POST /api/voting/vote
- POST /api/shop/purchase
- POST /api/promo-codes/redeem
- POST /api/lottery/buy-ticket
- POST /api/daily-tasks/complete
- POST /api/reputation/give

## Current Status

✅ **Working:**
- Basic user registration
- Mining system
- Miner upgrades
- Wallet connection
- Transaction history

⚠️ **Frontend Only (Mock Data):**
- Friends system (UI complete, needs backend)
- Guilds system (UI complete, needs backend)
- Tournaments (UI complete, needs backend)
- Mini-games (UI complete, needs backend)
- Voting system (UI complete, needs backend)
- Shop (UI complete, needs backend)
- Promo codes (UI complete, needs backend)
- Trophies (UI complete, needs backend)
- Daily tasks (UI complete, needs backend)
- Lottery (UI complete, needs backend)

## Next Steps

1. Create the database tables listed above
2. Implement API endpoints for each feature
3. Add proper error handling and validation
4. Test all features end-to-end
5. Add database indexes for performance
6. Implement proper authentication for all endpoints

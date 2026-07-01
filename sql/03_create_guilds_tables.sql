-- Этап 1.3: Создать таблицы для гильдий
-- Выполнить в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS guilds (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  emblem VARCHAR(50),
  leader_id VARCHAR(255),
  level INTEGER DEFAULT 1,
  total_power INTEGER DEFAULT 0,
  total_balance INTEGER DEFAULT 0,
  experience INTEGER DEFAULT 0,
  reputation INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guild_members (
  id SERIAL PRIMARY KEY,
  guild_id INTEGER,
  telegram_id VARCHAR(255),
  role VARCHAR(50) DEFAULT 'member',
  contribution INTEGER DEFAULT 0,
  joined_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (guild_id) REFERENCES guilds(id)
);

CREATE TABLE IF NOT EXISTS guild_messages (
  id SERIAL PRIMARY KEY,
  guild_id INTEGER,
  from_telegram_id VARCHAR(255),
  content TEXT,
  type VARCHAR(50) DEFAULT 'text',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (guild_id) REFERENCES guilds(id)
);

CREATE TABLE IF NOT EXISTS guild_quests (
  id SERIAL PRIMARY KEY,
  guild_id INTEGER,
  name VARCHAR(255),
  description TEXT,
  type VARCHAR(50),
  requirement INTEGER,
  reward INTEGER,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (guild_id) REFERENCES guilds(id)
);

CREATE TABLE IF NOT EXISTS guild_donations (
  id SERIAL PRIMARY KEY,
  guild_id INTEGER,
  telegram_id VARCHAR(255),
  amount INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (guild_id) REFERENCES guilds(id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_guilds_leader_id ON guilds(leader_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_guild_id ON guild_members(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_telegram_id ON guild_members(telegram_id);
CREATE INDEX IF NOT EXISTS idx_guild_messages_guild_id ON guild_messages(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_quests_guild_id ON guild_quests(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_donations_guild_id ON guild_donations(guild_id);

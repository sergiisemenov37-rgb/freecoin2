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

-- Этап 1.2: Создать таблицы для системы друзей
-- Выполнить в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS friends (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  friend_telegram_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(telegram_id, friend_telegram_id)
);

CREATE TABLE IF NOT EXISTS friend_requests (
  id SERIAL PRIMARY KEY,
  from_telegram_id VARCHAR(255),
  to_telegram_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  from_telegram_id VARCHAR(255),
  to_telegram_id VARCHAR(255),
  content TEXT,
  type VARCHAR(50) DEFAULT 'text',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

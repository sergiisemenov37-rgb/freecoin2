-- Этап 1.7: Создать таблицы для мини-игр
-- Выполнить в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS game_sessions (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  game_id VARCHAR(255),
  score INTEGER,
  reward INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

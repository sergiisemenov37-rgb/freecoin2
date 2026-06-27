-- Этап 1.6: Создать таблицы для трофеев
-- Выполнить в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_trophies (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  trophy_id VARCHAR(255),
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP,
  UNIQUE(telegram_id, trophy_id)
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  achievement_id VARCHAR(255),
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP,
  UNIQUE(telegram_id, achievement_id)
);

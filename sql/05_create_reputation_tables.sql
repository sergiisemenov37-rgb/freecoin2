-- Этап 1.5: Создать таблицы для репутации
-- Выполнить в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS reputation_actions (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  action VARCHAR(50),
  from_telegram_id VARCHAR(255),
  weight INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Этап 1.9: Создать таблицы для магазина
-- Выполнить в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_purchases (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  item_id VARCHAR(255),
  item_type VARCHAR(50),
  price INTEGER,
  purchased_at TIMESTAMP DEFAULT NOW()
);

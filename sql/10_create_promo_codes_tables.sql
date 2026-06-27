-- Этап 1.10: Создать таблицы для промокодов
-- Выполнить в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS promo_codes (
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

CREATE TABLE IF NOT EXISTS user_promo_uses (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  promo_code_id INTEGER,
  used_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id)
);

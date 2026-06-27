-- Этап 1.11: Создать таблицы для лотереи
-- Выполнить в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS lottery_draws (
  id SERIAL PRIMARY KEY,
  draw_date TIMESTAMP,
  prize_pool INTEGER,
  winning_number INTEGER,
  ticket_price INTEGER DEFAULT 50,
  total_tickets INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'upcoming'
);

CREATE TABLE IF NOT EXISTS lottery_tickets (
  id SERIAL PRIMARY KEY,
  draw_id INTEGER,
  telegram_id VARCHAR(255),
  ticket_number INTEGER,
  purchased_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (draw_id) REFERENCES lottery_draws(id)
);

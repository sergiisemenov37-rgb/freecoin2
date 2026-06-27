-- Этап 1.4: Создать таблицы для турниров
-- Выполнить в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS tournaments (
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

CREATE TABLE IF NOT EXISTS tournament_participants (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER,
  telegram_id VARCHAR(255),
  score INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
);

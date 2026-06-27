-- Этап 1.8: Создать таблицы для голосований
-- Выполнить в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS vote_proposals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  type VARCHAR(50),
  proposer_id VARCHAR(255),
  proposer_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  ends_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  min_votes_required INTEGER DEFAULT 10
);

CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  proposal_id INTEGER,
  voter_id VARCHAR(255),
  choice VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (proposal_id) REFERENCES vote_proposals(id)
);

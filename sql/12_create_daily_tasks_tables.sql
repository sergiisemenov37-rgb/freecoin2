-- Этап 1.12: Создать таблицы для ежедневных задач
-- Выполнить в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS daily_tasks (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  task_id VARCHAR(255),
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  date DATE DEFAULT CURRENT_DATE,
  UNIQUE(telegram_id, task_id, date)
);

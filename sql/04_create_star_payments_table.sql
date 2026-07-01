-- Create table for Telegram Stars payments
CREATE TABLE IF NOT EXISTS star_payments (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL,
  telegram_payment_id VARCHAR(255) UNIQUE NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  stars INTEGER NOT NULL,
  reward_free INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_star_payments_telegram_id ON star_payments(telegram_id);
CREATE INDEX IF NOT EXISTS idx_star_payments_payment_id ON star_payments(telegram_payment_id);

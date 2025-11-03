-- WalletConnect Multi-Chain Payment System
-- Run this SQL in your Supabase SQL Editor

-- Table for unlimited access purchases
CREATE TABLE IF NOT EXISTS unlimited_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  chain_id INTEGER NOT NULL,
  signature TEXT NOT NULL,
  request_id TEXT NOT NULL,
  payment_amount DECIMAL(10,2) DEFAULT 50.00,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_unlimited_access_wallet ON unlimited_access(wallet_address);
CREATE INDEX IF NOT EXISTS idx_unlimited_access_created ON unlimited_access(created_at);

-- Table for daily usage tracking (free tier)
CREATE TABLE IF NOT EXISTS daily_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  date DATE NOT NULL,
  request_count INTEGER DEFAULT 0,
  last_request_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, date)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_usage_wallet_date ON daily_usage(wallet_address, date);

-- Table for request logs (optional, for analytics)
CREATE TABLE IF NOT EXISTS request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  request_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  chain_id INTEGER,
  signature TEXT,
  success BOOLEAN DEFAULT true,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for request logs
CREATE INDEX IF NOT EXISTS idx_request_logs_wallet ON request_logs(wallet_address);
CREATE INDEX IF NOT EXISTS idx_request_logs_created ON request_logs(created_at);

-- Enable Row Level Security
ALTER TABLE unlimited_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow service role to read/write)
CREATE POLICY "Allow service role full access to unlimited_access"
  ON unlimited_access
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access to daily_usage"
  ON daily_usage
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access to request_logs"
  ON request_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

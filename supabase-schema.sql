-- =============================================
-- BTCIndexer Unlimited Payment System
-- Database Schema for Supabase
-- =============================================
-- Run this entire file in Supabase SQL Editor
-- =============================================

-- 1. Create unlimited_users table
-- Stores wallet addresses that have paid for unlimited access
CREATE TABLE IF NOT EXISTS unlimited_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  tx_hash TEXT NOT NULL,
  chain TEXT NOT NULL,
  plan TEXT DEFAULT 'unlimited',
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast wallet lookups
CREATE INDEX IF NOT EXISTS idx_unlimited_users_wallet ON unlimited_users(wallet_address);

-- Enable Row Level Security (RLS)
ALTER TABLE unlimited_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Service role can access unlimited_users" ON unlimited_users;

-- Create policy to allow service role to access
CREATE POLICY "Service role can access unlimited_users"
  ON unlimited_users
  FOR ALL
  USING (auth.role() = 'service_role');

-- 2. Create api_usage table
-- Tracks daily API usage for free tier users
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  date DATE NOT NULL,
  request_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, date)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_api_usage_wallet_date ON api_usage(wallet_address, date);

-- Enable Row Level Security (RLS)
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Service role can access api_usage" ON api_usage;

-- Create policy to allow service role to access
CREATE POLICY "Service role can access api_usage"
  ON api_usage
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_api_usage_updated_at ON api_usage;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_api_usage_updated_at
  BEFORE UPDATE ON api_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Verification Query
-- =============================================
-- This will show you if tables were created successfully
SELECT
  table_name,
  table_type,
  (SELECT COUNT(*)
   FROM information_schema.columns
   WHERE columns.table_name = tables.table_name
     AND columns.table_schema = 'public') as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('unlimited_users', 'api_usage')
ORDER BY table_name;

-- =============================================
-- View table structures
-- =============================================
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('unlimited_users', 'api_usage')
ORDER BY table_name, ordinal_position;

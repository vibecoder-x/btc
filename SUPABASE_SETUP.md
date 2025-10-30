# Supabase Database Setup for BTCIndexer

This document contains the SQL queries needed to set up the database tables for the unlimited payment system.

## Prerequisites

1. Create a Supabase project at https://supabase.com
2. Get your project URL and service role key
3. Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_KEY=your-service-role-key
```

## Database Tables

Run these SQL queries in your Supabase SQL Editor:

### 1. Unlimited Users Table

Stores wallet addresses that have paid for unlimited access.

```sql
CREATE TABLE unlimited_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  tx_hash TEXT NOT NULL,
  chain TEXT NOT NULL,
  plan TEXT DEFAULT 'unlimited',
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast wallet lookups
CREATE INDEX idx_unlimited_users_wallet ON unlimited_users(wallet_address);

-- Enable Row Level Security (RLS)
ALTER TABLE unlimited_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to access
CREATE POLICY "Service role can access unlimited_users"
  ON unlimited_users
  FOR ALL
  USING (auth.role() = 'service_role');
```

### 2. API Usage Table

Tracks daily API usage for free tier users.

```sql
CREATE TABLE api_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  date DATE NOT NULL,
  request_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, date)
);

-- Create index for fast lookups
CREATE INDEX idx_api_usage_wallet_date ON api_usage(wallet_address, date);

-- Enable Row Level Security (RLS)
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

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

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_api_usage_updated_at
  BEFORE UPDATE ON api_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Verification

After running the queries, verify the tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('unlimited_users', 'api_usage');
```

## Test Data (Optional)

Add test data to verify the system works:

```sql
-- Insert a test unlimited user
INSERT INTO unlimited_users (wallet_address, tx_hash, chain)
VALUES ('0x1234567890123456789012345678901234567890', 'test_tx_hash', 'base');

-- Insert test usage data
INSERT INTO api_usage (wallet_address, date, request_count)
VALUES ('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', CURRENT_DATE, 50);
```

## Clean Up Test Data

```sql
-- Remove test data
DELETE FROM unlimited_users WHERE tx_hash = 'test_tx_hash';
DELETE FROM api_usage WHERE wallet_address = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
```

## Environment Variables

Make sure your `.env.local` contains:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Payment Recipient Addresses
RECIPIENT_ADDRESS_EVM=0x840820c866fA17eAa7A44f46A3F1849C7860B245
RECIPIENT_ADDRESS_SOLANA=FdhXPvUqCjKVmatszBszzYKUcCBmf8zwqsgPcPKFm9Mw
RECIPIENT_ADDRESS_BITCOIN=bc1qszqgzwx04mlmxuhe3aymhkvpv9ge0q2p37gny5

# RPC URLs (optional - for transaction verification)
ETHEREUM_RPC_URL=https://eth.llamarpc.com
BASE_RPC_URL=https://mainnet.base.org
POLYGON_RPC_URL=https://polygon-rpc.com
```

## Notes

- The `unlimited_users` table stores wallets that have paid for unlimited access
- The `api_usage` table tracks daily usage for free tier users
- Unlimited users bypass the rate limiting completely
- Free tier users have a 100 requests/day limit
- Usage resets daily at midnight UTC

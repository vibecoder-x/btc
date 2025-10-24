# Bitcoin Payment System Setup Guide

## Overview

BTCindexer now supports Bitcoin payments for Premium subscriptions. Users can pay $10/month via Bitcoin and select multiple months in advance.

## Features

✅ **Fixed**: API key regeneration now works properly (no more 409 errors)
✅ **Fixed**: Usage stats reset when regenerating API keys
✅ Bitcoin payment page with real-time BTC price conversion
✅ Support for multi-month subscriptions (1, 3, 6, or 12 months)
✅ Automatic BTC amount calculation based on current market price
✅ Payment verification system
✅ Subscription expiry tracking
✅ Automatic downgrade when subscription expires

## Setup Instructions

### 1. Update Database Schema

Run the migration SQL in your Supabase SQL Editor:

```bash
# If you already have the users_profile table, run:
supabase-subscription-migration.sql

# If this is a fresh setup, run:
supabase-schema.sql
```

This adds:
- `subscription_expires_at` column - tracks when Premium subscription expires
- `payment_status` column - tracks payment status (none, pending, confirmed, expired)

### 2. Configure Your Bitcoin Wallet

Edit `/app/payment/page.tsx` and replace the placeholder wallet address:

```typescript
// Line 26 - Replace with your actual Bitcoin wallet address
const BTC_WALLET = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'; // ← Change this
```

**IMPORTANT**: Use a Bitcoin address you control. Test with small amounts first.

### 3. Payment Flow

1. User clicks "Pay with Bitcoin" on pricing page
2. User selects subscription duration (1, 3, 6, or 12 months)
3. System calculates BTC amount based on:
   - Monthly price: $10 USD
   - Current BTC price (fetched from CoinGecko API)
   - Formula: `(months × $10) / BTC_price`
4. User sends exact BTC amount to the displayed wallet address
5. User clicks "Verify Payment" button
6. System verifies payment and activates Premium subscription
7. User is redirected to dashboard

### 4. Payment Verification (TODO)

Currently, the payment verification is simulated. You need to implement actual blockchain verification.

#### Option A: Blockchain.info API (Free)

```typescript
const checkBitcoinPayment = async (address: string, expectedAmount: number) => {
  try {
    // Check address balance
    const response = await fetch(`https://blockchain.info/q/addressbalance/${address}`);
    const satoshis = await response.text();
    const btc = parseInt(satoshis) / 100000000;

    // Check if payment received
    return btc >= expectedAmount;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};
```

#### Option B: Bitcoin Node (Recommended for Production)

Connect to your own Bitcoin node:

```typescript
import { Client } from 'bitcoin-core';

const client = new Client({
  network: 'mainnet',
  username: 'your-rpc-username',
  password: 'your-rpc-password',
  host: 'your-node-ip',
  port: 8332,
});

const verifyPayment = async (address: string, expectedAmount: number) => {
  const received = await client.getReceivedByAddress(address, 1); // 1 confirmation
  return received >= expectedAmount;
};
```

#### Option C: Third-Party Payment Processor

Use services like:
- **BTCPay Server** (self-hosted, recommended)
- **Coinbase Commerce**
- **BitPay**
- **NOWPayments**

### 5. Automatic Subscription Expiry

The database includes a function to automatically downgrade expired subscriptions:

```sql
-- Run this to check and downgrade expired subscriptions
SELECT public.check_expired_subscriptions();
```

To automate this, enable `pg_cron` extension in Supabase:

1. Go to Supabase Dashboard → Database → Extensions
2. Enable `pg_cron`
3. Run in SQL Editor:

```sql
SELECT cron.schedule(
  'check-expired-subscriptions',
  '0 0 * * *', -- Run daily at midnight
  'SELECT public.check_expired_subscriptions()'
);
```

### 6. Testing the Payment System

#### Test Flow:

1. **Sign up** for a free account
2. Go to **Dashboard** → should show "Free" plan
3. Click **"Upgrade to Premium"** → redirects to `/payment`
4. Select **1 month** subscription
5. Copy the **Bitcoin wallet address**
6. See the calculated **BTC amount** (based on live price)
7. Click **"Verify Payment"** (simulated verification)
8. See **"Payment Confirmed!"** message
9. Redirected to **Dashboard** → should show "Premium" plan
10. Check **subscription expiry date** displayed

#### Test API Key Regeneration:

1. In Dashboard, click **"Generate API Key"**
2. Key is created successfully
3. Click **"Regenerate"** → confirm dialog
4. Old key is revoked, new key is created
5. Usage stats are reset to 0
6. No more 409 errors!

### 7. Security Considerations

**⚠️ IMPORTANT SECURITY NOTES:**

1. **Never commit your Bitcoin wallet private keys** to git
2. **Use environment variables** for sensitive data:
   ```bash
   BITCOIN_WALLET_ADDRESS=your_btc_address
   ```
3. **Implement proper payment verification** before activating subscriptions
4. **Add rate limiting** on payment verification endpoint
5. **Log all payment attempts** for audit trail
6. **Use HTTPS only** for payment pages
7. **Validate BTC amounts** server-side (never trust client calculations)
8. **Implement webhook signatures** if using third-party processors

### 8. Pricing Configuration

Current pricing:
- **Free**: $0 - 1,000 requests/day
- **Premium**: $10/month - 50,000 requests/day (Bitcoin only)
- **Enterprise**: Custom pricing - Unlimited

To change Premium price, update in:
- `/app/payment/page.tsx` (line 23): `MONTHLY_PRICE_USD`
- `/app/pricing/page.tsx` (line 29): `price: '$10'`

### 9. User Experience Features

✅ Real-time BTC price from CoinGecko API
✅ Copy wallet address button
✅ QR code placeholder (add library if needed)
✅ Multi-month discount options
✅ Clear payment instructions
✅ Payment status tracking
✅ Subscription expiry display in dashboard
✅ Automatic usage stats reset on regeneration

### 10. API Endpoints to Implement (Future)

Consider adding these endpoints:

```typescript
// POST /api/payment/verify
// Verify Bitcoin transaction and activate subscription

// POST /api/payment/webhook
// Receive payment notifications from Bitcoin node

// GET /api/payment/status/:transactionId
// Check payment status

// POST /api/subscription/cancel
// Cancel subscription (no refund)

// GET /api/subscription/invoices
// List payment history
```

### 11. Troubleshooting

#### Issue: "409 Conflict" when generating API key

**Fixed!** Now allows regeneration with proper deletion of old keys.

#### Issue: Usage stats not resetting on regeneration

**Fixed!** Usage logs are now deleted when regenerating API key.

#### Issue: BTC price not loading

**Solution**: CoinGecko API fallback is set to $50,000. For production, use multiple price feeds:
- CoinGecko
- CoinMarketCap
- Binance API
- Kraken API

#### Issue: Payment verification not working

**Solution**: Implement actual blockchain verification (see section 4 above).

## Environment Variables

Add to `.env.local`:

```bash
# Bitcoin Wallet
BITCOIN_WALLET_ADDRESS=your_actual_btc_wallet_address

# Bitcoin RPC (if using own node)
BITCOIN_RPC_HOST=your_node_ip
BITCOIN_RPC_PORT=8332
BITCOIN_RPC_USERNAME=your_rpc_username
BITCOIN_RPC_PASSWORD=your_rpc_password

# Payment Processor (if using third-party)
BTCPAY_SERVER_URL=https://your-btcpay-server.com
BTCPAY_API_KEY=your_api_key
```

## Next Steps

1. ✅ Set up your Bitcoin wallet
2. ✅ Replace wallet address in code
3. ⏳ Implement real payment verification
4. ⏳ Enable pg_cron for automatic expiry checks
5. ⏳ Add QR code generation library
6. ⏳ Test with small Bitcoin amounts
7. ⏳ Set up monitoring and alerts
8. ⏳ Create payment receipt emails

## Support

If you need help setting up Bitcoin payments:
- Bitcoin node setup: https://bitcoin.org/en/full-node
- BTCPay Server: https://btcpayserver.org/
- Blockchain.info API: https://www.blockchain.com/api

## License

MIT License - Use at your own risk. Always test with small amounts first.

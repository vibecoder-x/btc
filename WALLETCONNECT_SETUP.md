# 🚀 WalletConnect Multi-Chain Setup Guide

## ✅ What's Implemented

Your BTCindexer now supports:
- **Multi-Chain Wallet Connection**: Ethereum, Polygon, Base, Arbitrum, Optimism, BNB Chain, Avalanche
- **Sign-to-Pay**: No actual crypto transfers required
- **Free Tier**: 100 free requests per day
- **Unlimited Tier**: $50 one-time payment for unlimited access forever
- **300+ Wallets Supported**: MetaMask, Coinbase Wallet, Rainbow, Trust Wallet, and more

---

## 🎯 Setup Instructions

### Step 1: Database Setup (Supabase)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to create the tables

**Tables Created:**
- `unlimited_access` - Tracks users with unlimited API access
- `daily_usage` - Tracks free tier usage (100 requests/day)
- `request_logs` - Optional analytics logs

### Step 2: Environment Variables

Your `.env.local` already has:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=b585bd39b2fef1d000c8502c7741b23d
```

Make sure these are also set:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

### Step 3: Test the Integration

1. **Start the dev server**: `npm run dev`
2. **Open your browser**: http://localhost:3000
3. **Click "Connect Wallet"** in the header
4. **Select your wallet** (MetaMask, Coinbase Wallet, etc.)
5. **Approve the connection**

---

## 📱 How It Works

### Free Tier (100 requests/day)
1. User connects wallet
2. Makes API request
3. Signs a message to authenticate
4. Backend verifies signature
5. Request count increments (max 100/day)

### Unlimited Tier ($50 one-time)
1. User connects wallet
2. Clicks "Get Unlimited Access"
3. Signs a payment authorization message
4. Backend grants unlimited access
5. User can make unlimited requests forever

### No Crypto Transfers Required!
- Users only sign messages (gas-free)
- No actual crypto transfers
- Backend validates signatures
- Access granted based on signature verification

---

## 🎨 Using the Components

### Header with Wallet Button
```tsx
import { MultiChainWalletButton } from '@/components/MultiChainWalletButton';

// In your component
<MultiChainWalletButton />
```

### Make Authenticated API Requests
```tsx
import { useMultiChainPayment } from '@/hooks/useMultiChainPayment';

function MyComponent() {
  const { processPayment, address, isConnected } = useMultiChainPayment();

  const makeRequest = async () => {
    // Sign to authenticate (free tier)
    const result = await processPayment({
      tier: 'free',
      requestId: `req_${Date.now()}`,
    });

    if (result.success) {
      // Make your API call
      const response = await fetch('/api/blocks');
      // ...
    }
  };

  return (
    <button onClick={makeRequest}>
      Make Request
    </button>
  );
}
```

### Buy Unlimited Access
```tsx
const buyUnlimited = async () => {
  const result = await processPayment({
    tier: 'unlimited',
    amount: 50,
    requestId: `unlimited_${Date.now()}`,
  });

  if (result.success) {
    alert('Unlimited access granted!');
  }
};
```

---

## 🔧 Customization

### Add More Chains
Edit `lib/wallet/walletconnect-config.ts`:
```typescript
import { avalanche, fantom, celo } from 'wagmi/chains';

export const chains = [
  mainnet,
  polygon,
  base,
  // Add more here
  avalanche,
  fantom,
  celo,
] as const;
```

### Change Pricing
Edit `lib/wallet/walletconnect-config.ts`:
```typescript
export const PAYMENT_PRICING = {
  unlimitedAccess: 50, // Change this
  perRequest: {
    free: 100, // Free tier limit
    paid: 0.01, // Per-request price
  },
};
```

### Theme Colors
Edit `context/Web3ModalProvider.tsx`:
```typescript
themeVariables: {
  '--w3m-color-mix': '#FFD700', // Your brand color
  '--w3m-accent': '#FFD700',
}
```

---

## 🚀 Testing Checklist

- [ ] Wallet connection works
- [ ] Free tier requests counted correctly
- [ ] Unlimited tier signup works
- [ ] Signature verification works
- [ ] Chain switching works
- [ ] Database tables created
- [ ] Environment variables set

---

## 📦 What's Removed

The old system with:
- ❌ Direct crypto transfers
- ❌ Manual payment tracking
- ❌ Complex transaction handling

Replaced with:
- ✅ Simple signature verification
- ✅ Automatic access management
- ✅ No gas fees for users

---

## 🎉 You're Done!

Your BTCindexer now has professional multi-chain wallet authentication!

**Features:**
- 🌐 7+ blockchain networks
- 👛 300+ wallet providers
- 🆓 100 free requests/day
- ♾️ $50 unlimited forever
- 🔐 Secure signature auth
- ⚡ No gas fees required

---

## 🆘 Need Help?

1. Check console for errors
2. Verify environment variables
3. Confirm database tables exist
4. Test with MetaMask first
5. Check Supabase logs

**Common Issues:**
- "Project ID not set" → Check `.env.local`
- "Table doesn't exist" → Run SQL schema
- "Signature invalid" → Check wallet connection
- "Rate limit exceeded" → Daily limit reached (100)

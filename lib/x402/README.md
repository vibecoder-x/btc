# x402 Payment Protocol Implementation

This directory contains the implementation of the x402 payment protocol for btcindexer.com - a revolutionary pay-per-use API system using Bitcoin inscriptions for authentication.

## Overview

The x402 protocol eliminates the need for:
- ❌ User accounts and registration
- ❌ API keys and secrets
- ❌ Monthly subscriptions
- ❌ Credit-based systems

Instead, it uses:
- ✅ Bitcoin inscriptions for authentication
- ✅ Pay-per-API-call micro-transactions
- ✅ Transparent pricing (10-500 sats per query)
- ✅ Instant access after payment confirmation

## Directory Structure

```
lib/x402/
├── types.ts              # TypeScript types and interfaces
├── payment-service.ts    # Core payment logic and verification
├── middleware.ts         # Next.js API route middleware
├── use-x402-payment.ts   # React hook for client-side integration
├── index.ts             # Main exports
└── README.md            # This file
```

## Quick Start

### Server-Side (API Routes)

Create a protected API route:

```typescript
// app/api/tx/[txid]/route.ts
import { createProtectedRoute } from '@/lib/x402/middleware';
import { NextRequest, NextResponse } from 'next/server';

async function handler(request: NextRequest, { params }: { params: { txid: string } }) {
  const { txid } = params;

  // Your API logic here
  const transaction = await getTransaction(txid);

  return NextResponse.json(transaction);
}

// Export with x402 protection
export const GET = createProtectedRoute(handler, {
  rateLimit: { requests: 100, windowMs: 60000 }
});
```

### Client-Side (React Components)

Use the React hook for automatic payment handling:

```typescript
'use client';

import { useX402Payment } from '@/lib/x402/use-x402-payment';
import { X402PaymentModal } from '@/components/X402PaymentModal';

export function MyComponent() {
  const { makeRequest, isLoading, paymentData, isPaymentModalOpen, closePaymentModal } =
    useX402Payment({
      onPaymentComplete: (data) => console.log('Got data:', data),
    });

  const fetchData = async () => {
    const data = await makeRequest('/api/tx/abc123...');
    if (data) {
      // Payment confirmed, got data
      console.log(data);
    }
  };

  return (
    <>
      <button onClick={fetchData} disabled={isLoading}>
        Fetch Transaction
      </button>

      {paymentData && (
        <X402PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          paymentData={paymentData}
        />
      )}
    </>
  );
}
```

## How It Works

### 1. Initial API Request

When a client makes a request to a protected endpoint:

```bash
GET /api/tx/abc123...
```

The middleware intercepts and returns **402 Payment Required**:

```json
{
  "error": "Payment Required",
  "amount": 10,
  "currency": "SAT",
  "payment_address": "bc1q...",
  "request_id": "unique_request_id",
  "inscription_data": {
    "service": "btcindexer",
    "request_id": "unique_request_id",
    "timestamp": 1234567890
  },
  "instructions": "Create inscription with provided data and send to payment address",
  "expires_at": "2024-01-01T00:00:00Z"
}
```

### 2. Payment Creation

The client:
1. Creates a Bitcoin inscription with the provided `inscription_data`
2. Sends the inscription to the `payment_address`
3. Waits for confirmation

### 3. Payment Verification

The service:
1. Monitors the blockchain for transactions to payment addresses
2. Extracts inscription data from confirmed transactions
3. Validates the inscription matches the request
4. Marks payment as CONFIRMED

### 4. Data Delivery

Once confirmed:
1. The client polls `/api/payment/status` with the `request_id`
2. When status is CONFIRMED, the API response is returned
3. Response is cached for immediate re-delivery if needed

## Pricing Configuration

Pricing is defined in `types.ts` in the `ENDPOINT_PRICING` array:

```typescript
export const ENDPOINT_PRICING: EndpointPricing[] = [
  { path: '/api/tx/:txid', price: 10, method: 'GET', description: 'Get transaction details' },
  { path: '/api/address/:address', price: 50, method: 'GET', description: 'Get address info' },
  { path: '/api/inscription/:id', price: 100, method: 'GET', description: 'Get inscription' },
  // ... more endpoints
];
```

## Payment States

Payments go through these states:

- **PENDING** - Payment request created, awaiting payment
- **DETECTED** - Transaction seen in mempool
- **CONFIRMING** - Transaction in block, waiting for confirmations
- **CONFIRMED** - Payment verified, data delivered
- **EXPIRED** - Payment window (10 minutes) expired
- **INVALID** - Inscription data invalid or amount insufficient

## Security Features

1. **Request ID Validation**: Each payment has a unique request ID that must match
2. **Timestamp Verification**: Inscriptions must be created within 10-minute window
3. **Amount Verification**: Payment must match required amount
4. **Replay Prevention**: Request IDs can't be reused
5. **Rate Limiting**: IP-based rate limiting for 402 responses
6. **Expiration**: Payment requests expire after 10 minutes

## Database Schema (TODO)

The payment system needs these database tables:

```sql
CREATE TABLE payment_requests (
  id UUID PRIMARY KEY,
  request_id VARCHAR(64) UNIQUE NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  payment_address VARCHAR(255) NOT NULL,
  required_amount INTEGER NOT NULL,
  inscription_data JSONB NOT NULL,
  status VARCHAR(20) NOT NULL,
  inscription_id VARCHAR(255),
  payment_txid VARCHAR(64),
  confirmations INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  paid_at TIMESTAMP,
  response_data JSONB
);

CREATE INDEX idx_payment_requests_request_id ON payment_requests(request_id);
CREATE INDEX idx_payment_requests_status ON payment_requests(status);
CREATE INDEX idx_payment_requests_payment_address ON payment_requests(payment_address);
```

## Future Enhancements

### In Progress
- [ ] Real blockchain integration for payment verification
- [ ] Database persistence (currently in-memory)
- [ ] HD wallet for payment address generation

### Planned
- [ ] WebSocket support for real-time updates
- [ ] Batch payment discounts
- [ ] Lightning Network payments (instant confirmation)
- [ ] QR code generation for payments
- [ ] Payment receipt generation
- [ ] Usage analytics per wallet address
- [ ] Automatic refunds for failed requests

## Testing

To test the x402 system:

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Test protected endpoint**:
   ```bash
   curl http://localhost:3000/api/tx/abc123
   ```

3. **Should receive 402 response** with payment details

4. **Use the interactive demo** on `/api` page

## Production Deployment

Before deploying to production:

1. ✅ Implement real Bitcoin node integration
2. ✅ Set up PostgreSQL database
3. ✅ Configure Redis for caching
4. ✅ Implement HD wallet address derivation
5. ✅ Set up blockchain monitoring service
6. ✅ Configure proper rate limiting
7. ✅ Add monitoring and alerting
8. ✅ Test payment flow end-to-end

## Support

For issues or questions about the x402 implementation:
- Create an issue on GitHub
- Contact: support@btcindexer.com
- Documentation: https://docs.btcindexer.com

## License

Proprietary - btcindexer.com

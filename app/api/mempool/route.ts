/**
 * Mempool API Route
 * GET /api/mempool - Get current mempool statistics (50 sats)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/x402/middleware';

async function handler(request: NextRequest) {
  try {
    // TODO: Implement actual mempool data from Bitcoin node

    // Mock response
    const mempoolData = {
      count: 10523,
      vsize: 142000000,
      total_fee: 0.45678,
      fee_histogram: [
        [1, 5000000],
        [2, 10000000],
        [3, 15000000],
        [4, 20000000],
        [5, 25000000],
        [10, 30000000],
        [20, 25000000],
        [30, 12000000],
      ],
      recommended_fees: {
        fastest: 45,
        halfHour: 30,
        hour: 20,
        economy: 12,
        minimum: 1,
      },
      mempool_size: 142000000,
      usage: 0.35, // 35% of max mempool
      max_mempool: 300000000,
      transactions_per_second: 4.2,
      bytes_per_second: 1234,
    };

    return NextResponse.json(mempoolData, { status: 200 });

  } catch (error) {
    console.error('Error fetching mempool data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mempool data' },
      { status: 500 }
    );
  }
}

// Export the protected route with x402 payment
export const GET = createProtectedRoute(handler, {
  skipPayment: process.env.NODE_ENV === 'development', // Skip payment in development
  rateLimit: { requests: 60, windowMs: 60000 },
});

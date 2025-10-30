/**
 * Fee Recommendation API Route
 * GET /api/fees/recommended - Get fee recommendations (10 sats)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/x402/middleware';

async function handler(request: NextRequest) {
  try {
    // TODO: Implement actual fee estimation from Bitcoin node

    // Mock response
    const feeData = {
      timestamp: Date.now(),
      fees: {
        fastest: {
          sat_per_vbyte: 45,
          expected_blocks: 1,
          expected_time_minutes: 10,
        },
        halfHour: {
          sat_per_vbyte: 30,
          expected_blocks: 3,
          expected_time_minutes: 30,
        },
        hour: {
          sat_per_vbyte: 20,
          expected_blocks: 6,
          expected_time_minutes: 60,
        },
        economy: {
          sat_per_vbyte: 12,
          expected_blocks: 24,
          expected_time_minutes: 240,
        },
        minimum: {
          sat_per_vbyte: 1,
          expected_blocks: 144,
          expected_time_minutes: 1440,
        },
      },
      mempool_info: {
        loaded: true,
        size: 10523,
        bytes: 142000000,
        usage: 0.35,
      },
    };

    return NextResponse.json(feeData, { status: 200 });

  } catch (error) {
    console.error('Error fetching fee data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fee recommendations' },
      { status: 500 }
    );
  }
}

// Export the protected route with x402 payment
export const GET = createProtectedRoute(handler, {
  rateLimit: { requests: 120, windowMs: 60000 },
});

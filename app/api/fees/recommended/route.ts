/**
 * Fee Recommendation API Route
 * GET /api/fees/recommended - Get fee recommendations (10 sats)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/x402/middleware';

async function handler(request: NextRequest) {
  try {
    // Fetch recommended fees from Mempool.space
    const feesResponse = await fetch('https://mempool.space/api/v1/fees/recommended', {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!feesResponse.ok) {
      throw new Error(`Mempool.space fees API error: ${feesResponse.status}`);
    }

    const feesData = await feesResponse.json();

    // Format response to match expected structure
    const feeData = {
      timestamp: Date.now(),
      fees: {
        fastest: {
          sat_per_vbyte: feesData.fastestFee || 0,
          expected_blocks: 1,
          expected_time_minutes: 10,
        },
        halfHour: {
          sat_per_vbyte: feesData.halfHourFee || 0,
          expected_blocks: 3,
          expected_time_minutes: 30,
        },
        hour: {
          sat_per_vbyte: feesData.hourFee || 0,
          expected_blocks: 6,
          expected_time_minutes: 60,
        },
        economy: {
          sat_per_vbyte: feesData.economyFee || 0,
          expected_blocks: 24,
          expected_time_minutes: 240,
        },
        minimum: {
          sat_per_vbyte: feesData.minimumFee || 0,
          expected_blocks: 144,
          expected_time_minutes: 1440,
        },
      },
      mempool_info: {
        loaded: true,
        size: 0, // Not available from this endpoint
        bytes: 0, // Not available from this endpoint
        usage: 0, // Not available from this endpoint
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

// Export the protected route with x402 payment disabled for free access
export const GET = createProtectedRoute(handler, {
  skipPayment: true, // Free access to fee data
  rateLimit: { requests: 120, windowMs: 60000 },
});

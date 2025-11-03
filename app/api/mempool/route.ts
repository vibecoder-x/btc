/**
 * Mempool API Route
 * GET /api/mempool - Get current mempool statistics (50 sats)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/x402/middleware';

async function handler(request: NextRequest) {
  try {
    // Fetch mempool data from Mempool.space
    const mempoolResponse = await fetch('https://mempool.space/api/mempool', {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!mempoolResponse.ok) {
      throw new Error(`Mempool API error: ${mempoolResponse.status}`);
    }

    const mempoolData = await mempoolResponse.json();

    // Fetch recommended fees from Mempool.space
    const feesResponse = await fetch('https://mempool.space/api/v1/fees/recommended', {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!feesResponse.ok) {
      throw new Error(`Fees API error: ${feesResponse.status}`);
    }

    const feesData = await feesResponse.json();

    // Combine the data into expected format
    const response = {
      count: mempoolData.count || 0,
      vsize: mempoolData.vsize || 0,
      total_fee: (mempoolData.total_fee || 0) / 100000000, // Convert satoshis to BTC
      fee_histogram: mempoolData.fee_histogram || [],
      recommended_fees: {
        fastest: feesData.fastestFee || 0,
        halfHour: feesData.halfHourFee || 0,
        hour: feesData.hourFee || 0,
        economy: feesData.economyFee || 0,
        minimum: feesData.minimumFee || 0,
      },
      mempool_size: mempoolData.vsize || 0, // Use vsize as mempool size
      usage: mempoolData.vsize ? (mempoolData.vsize / 300000000) : 0, // Calculate usage percentage
      max_mempool: 300000000,
      transactions_per_second: 0, // Not available from API
      bytes_per_second: 0, // Not available from API
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error fetching mempool data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mempool data' },
      { status: 500 }
    );
  }
}

// Export the protected route with x402 payment disabled for free access
export const GET = createProtectedRoute(handler, {
  skipPayment: true, // Free access to mempool data
  rateLimit: { requests: 60, windowMs: 60000 },
});

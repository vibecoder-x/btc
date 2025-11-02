/**
 * Transaction API Route
 * GET /api/tx/:txid - Get transaction details (10 sats)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/x402/middleware';

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ txid: string }> }
) {
  try {
    const { txid } = await params;

    // Validate txid format (64 hex characters)
    if (!/^[a-fA-F0-9]{64}$/.test(txid)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID format' },
        { status: 400 }
      );
    }

    // Fetch real data from Blockstream API
    const response = await fetch(
      `https://blockstream.info/api/tx/${txid}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        );
      }
      throw new Error(`Blockstream API error: ${response.status}`);
    }

    const transaction = await response.json();

    return NextResponse.json(transaction, { status: 200 });

  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction. Please try again.' },
      { status: 500 }
    );
  }
}

// Export the protected route with x402 payment
export const GET = createProtectedRoute(handler, {
  rateLimit: { requests: 100, windowMs: 60000 }, // 100 requests per minute
});

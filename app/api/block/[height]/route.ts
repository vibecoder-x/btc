/**
 * Block API Route
 * GET /api/block/:height - Get block data by height or hash (20 sats)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/x402/middleware';

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ height: string }> }
) {
  try {
    const { height } = await params;

    // Determine if it's a height number or block hash
    const isHeight = /^\d+$/.test(height);
    const isHash = /^[a-fA-F0-9]{64}$/.test(height);

    if (!isHeight && !isHash) {
      return NextResponse.json(
        { error: 'Invalid block height or hash' },
        { status: 400 }
      );
    }

    // TODO: Implement actual block lookup from Bitcoin node

    // Mock response
    const blockData = {
      id: isHash ? height : '00000000000000000003a1b2c3d4e5f6789...',
      height: isHeight ? parseInt(height) : 820450,
      version: 536870912,
      timestamp: 1705320600,
      tx_count: 2456,
      size: 1234567,
      weight: 3993456,
      merkle_root: 'abc123def456...',
      previousblockhash: '00000000000000000002...',
      mediantime: 1705318000,
      nonce: 1234567890,
      bits: '17053894',
      difficulty: 72006146478567.89,
      chainwork: '000000000000000000000000000000000000000067f4e8d5c91f8f20e7e1a4a9',
      nTx: 2456,
      nextblockhash: isHeight && parseInt(height) < 820450 ? '00000000000000000004...' : null,
      strippedsize: 934567,
      confirmations: 1000,
    };

    return NextResponse.json(blockData, { status: 200 });

  } catch (error) {
    console.error('Error fetching block:', error);
    return NextResponse.json(
      { error: 'Failed to fetch block data' },
      { status: 500 }
    );
  }
}

// Export the protected route with x402 payment
export const GET = createProtectedRoute(handler, {
  skipPayment: process.env.NODE_ENV === 'development', // Skip payment in development
  rateLimit: { requests: 100, windowMs: 60000 },
});

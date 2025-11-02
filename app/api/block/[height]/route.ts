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

    // Fetch block hash if height is provided
    let blockHash = height;
    if (isHeight) {
      const hashResponse = await fetch(
        `https://blockstream.info/api/block-height/${height}`,
        {
          headers: { 'Accept': 'text/plain' },
          next: { revalidate: 3600 }, // Cache for 1 hour (blocks don't change)
        }
      );

      if (!hashResponse.ok) {
        if (hashResponse.status === 404) {
          return NextResponse.json(
            { error: 'Block not found at this height' },
            { status: 404 }
          );
        }
        throw new Error(`Blockstream API error: ${hashResponse.status}`);
      }

      blockHash = await hashResponse.text();
    }

    // Fetch block data
    const blockResponse = await fetch(
      `https://blockstream.info/api/block/${blockHash}`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      }
    );

    if (!blockResponse.ok) {
      if (blockResponse.status === 404) {
        return NextResponse.json(
          { error: 'Block not found' },
          { status: 404 }
        );
      }
      throw new Error(`Blockstream API error: ${blockResponse.status}`);
    }

    const blockData = await blockResponse.json();

    // Fetch block transactions (first 25)
    const txsResponse = await fetch(
      `https://blockstream.info/api/block/${blockHash}/txs`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      }
    );

    let transactions = [];
    if (txsResponse.ok) {
      transactions = await txsResponse.json();
    }

    // Return block data with transactions
    return NextResponse.json({
      ...blockData,
      transactions: transactions.slice(0, 25), // Return first 25 transactions
    }, { status: 200 });

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

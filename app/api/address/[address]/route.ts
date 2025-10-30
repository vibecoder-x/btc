/**
 * Address API Route
 * GET /api/address/:address - Get address balance and info (50 sats)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/x402/middleware';

async function handler(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;

    // Validate address format
    if (!isValidBitcoinAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Bitcoin address' },
        { status: 400 }
      );
    }

    // TODO: Implement actual address lookup from Bitcoin node/indexer

    // Mock response
    const addressData = {
      address: address,
      chain_stats: {
        funded_txo_count: 127,
        funded_txo_sum: 15000000,
        spent_txo_count: 125,
        spent_txo_sum: 14500000,
        tx_count: 127,
      },
      mempool_stats: {
        funded_txo_count: 0,
        funded_txo_sum: 0,
        spent_txo_count: 0,
        spent_txo_sum: 0,
        tx_count: 0,
      },
      balance: 500000, // 0.005 BTC
      total_received: 15000000, // 0.15 BTC
      total_sent: 14500000, // 0.145 BTC
      unconfirmed_balance: 0,
      unconfirmed_tx_count: 0,
      first_seen: '2020-01-15T10:30:00Z',
      last_seen: '2024-01-20T14:45:00Z',
    };

    return NextResponse.json(addressData, { status: 200 });

  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json(
      { error: 'Failed to fetch address data' },
      { status: 500 }
    );
  }
}

function isValidBitcoinAddress(address: string): boolean {
  // Basic validation - should be more comprehensive in production
  const patterns = [
    /^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/, // P2PKH
    /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/, // P2SH
    /^bc1[a-zA-HJ-NP-Z0-9]{39,59}$/, // Bech32
    /^tb1[a-zA-HJ-NP-Z0-9]{39,59}$/, // Testnet Bech32
  ];

  return patterns.some((pattern) => pattern.test(address));
}

// Export the protected route with x402 payment
export const GET = createProtectedRoute(handler, {
  rateLimit: { requests: 100, windowMs: 60000 },
});

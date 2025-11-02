/**
 * Address API Route
 * GET /api/address/:address - Get address balance and info (50 sats)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/x402/middleware';

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Validate address format
    if (!isValidBitcoinAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Bitcoin address' },
        { status: 400 }
      );
    }

    // Fetch real data from Blockstream API
    const response = await fetch(
      `https://blockstream.info/api/address/${address}`,
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
          { error: 'Address not found or has no transactions' },
          { status: 404 }
        );
      }
      throw new Error(`Blockstream API error: ${response.status}`);
    }

    const data = await response.json();

    // Fetch transaction history (last 50 transactions)
    const txResponse = await fetch(
      `https://blockstream.info/api/address/${address}/txs`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 60 },
      }
    );

    let transactions = [];
    if (txResponse.ok) {
      transactions = await txResponse.json();
    }

    // Fetch UTXO set
    const utxoResponse = await fetch(
      `https://blockstream.info/api/address/${address}/utxo`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 60 },
      }
    );

    let utxos = [];
    if (utxoResponse.ok) {
      utxos = await utxoResponse.json();
    }

    // Calculate balance from chain stats
    const balance = (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum);
    const totalReceived = data.chain_stats.funded_txo_sum;
    const totalSent = data.chain_stats.spent_txo_sum;

    // Format response with additional computed fields
    const addressData = {
      ...data,
      balance,
      total_received: totalReceived,
      total_sent: totalSent,
      tx_count: data.chain_stats.tx_count,
      transactions: transactions.slice(0, 50), // Return last 50 transactions
      utxos,
    };

    return NextResponse.json(addressData, { status: 200 });

  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json(
      { error: 'Failed to fetch address data. Please try again.' },
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
  skipPayment: process.env.NODE_ENV === 'development', // Skip payment in development
  rateLimit: { requests: 100, windowMs: 60000 },
});

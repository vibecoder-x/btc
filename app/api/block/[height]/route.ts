/**
 * Block API Route
 * GET /api/block/:height - Get block data by height or hash (20 sats)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/x402/middleware';

// Function to extract miner from coinbase transaction
function extractMiner(coinbaseHex: string): string {
  if (!coinbaseHex) return 'Unknown';

  try {
    // Convert hex to ASCII and look for common miner signatures
    const ascii = Buffer.from(coinbaseHex, 'hex').toString('ascii');

    // Common mining pool signatures
    const miners: { [key: string]: string } = {
      'Foundry USA': 'Foundry USA',
      'FoundryUSA': 'Foundry USA',
      'AntPool': 'AntPool',
      'Antpool': 'AntPool',
      'F2Pool': 'F2Pool',
      'f2pool': 'F2Pool',
      'ViaBTC': 'ViaBTC',
      'viabtc': 'ViaBTC',
      'Binance': 'Binance Pool',
      'BinancePool': 'Binance Pool',
      'Poolin': 'Poolin',
      'poolin': 'Poolin',
      'MARA': 'MARA Pool',
      'MaraPool': 'MARA Pool',
      'Luxor': 'Luxor',
      'SlushPool': 'Slush Pool',
      'slush': 'Slush Pool',
      'BTC.com': 'BTC.com',
      'btccom': 'BTC.com',
      'SpiderPool': 'Spider Pool',
      'Huobi': 'Huobi Pool',
      'EMCD': 'EMCD',
      'SBI Crypto': 'SBI Crypto',
      'Ultimus': 'Ultimus Pool',
    };

    // Search for miner signatures in the ASCII string
    for (const [signature, minerName] of Object.entries(miners)) {
      if (ascii.includes(signature)) {
        return minerName;
      }
    }

    return 'Unknown';
  } catch (error) {
    return 'Unknown';
  }
}

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

    // Extract miner from coinbase transaction (first transaction)
    let miner = 'Unknown';
    if (transactions.length > 0) {
      const coinbaseTx = transactions[0];
      if (coinbaseTx.vin && coinbaseTx.vin[0]) {
        const input = coinbaseTx.vin[0];

        // Try scriptsig first
        if (input.scriptsig) {
          miner = extractMiner(input.scriptsig);
        }

        // If not found and has witness data, try that
        if (miner === 'Unknown' && input.witness && input.witness.length > 0) {
          miner = extractMiner(input.witness.join(''));
        }
      }
    }

    // Return block data with transactions and miner
    return NextResponse.json({
      ...blockData,
      miner,
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

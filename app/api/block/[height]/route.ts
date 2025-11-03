/**
 * Block API Route
 * GET /api/block/:height - Get block data by height or hash (20 sats)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/x402/middleware';

// Function to extract miner from coinbase transaction
function extractMiner(coinbaseData: string): string {
  if (!coinbaseData) return 'Unknown';

  try {
    let textToSearch = coinbaseData;

    // If it looks like hex, convert to ASCII
    if (/^[0-9a-fA-F]+$/.test(coinbaseData) && coinbaseData.length > 10) {
      try {
        textToSearch = Buffer.from(coinbaseData, 'hex').toString('ascii');
      } catch {
        // If hex conversion fails, search the original string
        textToSearch = coinbaseData;
      }
    }

    // Make search case-insensitive
    const searchText = textToSearch.toLowerCase();

    // Common mining pool signatures (most common first for faster matching)
    const miners = [
      { patterns: ['foundry usa', 'foundryusa'], name: 'Foundry USA' },
      { patterns: ['antpool'], name: 'AntPool' },
      { patterns: ['f2pool'], name: 'F2Pool' },
      { patterns: ['viabtc'], name: 'ViaBTC' },
      { patterns: ['binance', 'binancepool'], name: 'Binance Pool' },
      { patterns: ['poolin'], name: 'Poolin' },
      { patterns: ['mara pool', 'mara', 'marapool'], name: 'MARA Pool' },
      { patterns: ['luxor'], name: 'Luxor' },
      { patterns: ['slushpool', 'slush pool', 'braiins'], name: 'Slush Pool' },
      { patterns: ['btc.com', 'btccom'], name: 'BTC.com' },
      { patterns: ['spiderpool', 'spider pool'], name: 'Spider Pool' },
      { patterns: ['huobi'], name: 'Huobi Pool' },
      { patterns: ['emcd'], name: 'EMCD' },
      { patterns: ['sbi crypto'], name: 'SBI Crypto' },
      { patterns: ['ultimus'], name: 'Ultimus Pool' },
      { patterns: ['btc guild', 'btcguild'], name: 'BTC Guild' },
      { patterns: ['kano'], name: 'Kano CKPool' },
      { patterns: ['btc top', 'btctop'], name: 'BTC.TOP' },
      { patterns: ['58coin', '58 coin'], name: '58COIN' },
      { patterns: ['sigmapool', 'sigma pool'], name: 'SigmaPool' },
      { patterns: ['titan'], name: 'Titan' },
    ];

    // Search for miner signatures
    for (const miner of miners) {
      for (const pattern of miner.patterns) {
        if (searchText.includes(pattern)) {
          return miner.name;
        }
      }
    }

    return 'Unknown';
  } catch (error) {
    console.error('Error extracting miner:', error);
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

    // Get start_index from query parameter for pagination
    const { searchParams } = new URL(request.url);
    const startIndex = parseInt(searchParams.get('start_index') || '0');

    // Fetch block transactions with pagination
    let txUrl = `https://blockstream.info/api/block/${blockHash}/txs`;
    if (startIndex > 0) {
      // Get last txid from a separate call to know where to start
      txUrl = `https://blockstream.info/api/block/${blockHash}/txs/${startIndex}`;
    }

    const txsResponse = await fetch(txUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    let transactions = [];
    if (txsResponse.ok) {
      transactions = await txsResponse.json();
    }

    // Extract miner from coinbase transaction (first transaction) only on first load
    let miner = 'Unknown';
    if (startIndex === 0 && transactions.length > 0) {
      const coinbaseTx = transactions[0];
      if (coinbaseTx.vin && coinbaseTx.vin[0]) {
        const input = coinbaseTx.vin[0];

        // Try scriptsig first (check both possible field names)
        if (input.scriptsig) {
          miner = extractMiner(input.scriptsig);
        } else if (input.scriptSig && input.scriptSig.hex) {
          miner = extractMiner(input.scriptSig.hex);
        }

        // Try scriptsig_asm (human-readable format)
        if (miner === 'Unknown' && input.scriptsig_asm) {
          miner = extractMiner(input.scriptsig_asm);
        }

        // If not found and has witness data, try that
        if (miner === 'Unknown' && input.witness && input.witness.length > 0) {
          miner = extractMiner(input.witness.join(''));
        }

        // Try inner_witnessscript_asm
        if (miner === 'Unknown' && input.inner_witnessscript_asm) {
          miner = extractMiner(input.inner_witnessscript_asm);
        }
      }
    }

    // Return block data with transactions and miner
    return NextResponse.json({
      ...blockData,
      miner,
      transactions, // Return all fetched transactions (25 at a time from Blockstream)
      hasMore: transactions.length === 25, // Blockstream returns 25 per page
      nextStartIndex: startIndex + transactions.length,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching block:', error);
    return NextResponse.json(
      { error: 'Failed to fetch block data' },
      { status: 500 }
    );
  }
}

// Export the protected route with x402 payment disabled for free access
export const GET = createProtectedRoute(handler, {
  skipPayment: true, // Free access to block data
  rateLimit: { requests: 100, windowMs: 60000 },
});

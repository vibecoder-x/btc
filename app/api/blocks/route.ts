/**
 * Blocks List API Route
 * GET /api/blocks - Get recent blocks from the blockchain
 */

import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    // Get latest block height from Blockstream
    const tipResponse = await fetch(
      'https://blockstream.info/api/blocks/tip/height',
      {
        headers: { 'Accept': 'text/plain' },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!tipResponse.ok) {
      throw new Error(`Failed to fetch tip height: ${tipResponse.status}`);
    }

    const tipHeight = parseInt(await tipResponse.text());

    // Get start height from query parameter (for pagination)
    const { searchParams } = new URL(request.url);
    const startHeight = parseInt(searchParams.get('startHeight') || tipHeight.toString());

    // Fetch blocks from Blockstream (10 blocks at a time)
    const blocksResponse = await fetch(
      `https://blockstream.info/api/blocks/${startHeight}`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 60 },
      }
    );

    if (!blocksResponse.ok) {
      throw new Error(`Failed to fetch blocks: ${blocksResponse.status}`);
    }

    const blocks = await blocksResponse.json();

    // Fetch miner information for each block
    const blocksWithMiner = await Promise.all(
      blocks.slice(0, 10).map(async (block: any) => {
        try {
          // Fetch the coinbase transaction (first tx in block)
          const txResponse = await fetch(
            `https://blockstream.info/api/block/${block.id}/txs/0`,
            {
              headers: { 'Accept': 'application/json' },
              next: { revalidate: 3600 }, // Cache for 1 hour
            }
          );

          if (txResponse.ok) {
            const coinbaseTx = await txResponse.json();

            // Extract miner from coinbase scriptSig or witness
            let miner = 'Unknown';

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

            return { ...block, miner };
          }
        } catch (error) {
          console.error(`Error fetching miner for block ${block.height}:`, error);
        }

        return { ...block, miner: 'Unknown' };
      })
    );

    // Return formatted blocks with miner info
    return NextResponse.json({
      tipHeight,
      blocks: blocksWithMiner,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocks data' },
      { status: 500 }
    );
  }
}

/**
 * Blocks List API Route
 * GET /api/blocks - Get recent blocks from the blockchain
 */

import { NextRequest, NextResponse } from 'next/server';

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

/**
 * Blocks List API Route
 * GET /api/blocks - Get recent blocks from the blockchain
 */

import { NextRequest, NextResponse } from 'next/server';

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

    // Return formatted blocks
    return NextResponse.json({
      tipHeight,
      blocks: blocks.slice(0, 10), // Return max 10 blocks
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocks data' },
      { status: 500 }
    );
  }
}

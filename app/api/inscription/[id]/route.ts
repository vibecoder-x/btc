/**
 * Inscription API Route
 * GET /api/inscription/:id - Get inscription details (100 sats)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/x402/middleware';

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Implement actual inscription lookup from ord indexer

    // Mock response
    const inscriptionData = {
      inscription_id: id,
      inscription_number: 12345678,
      content_type: 'image/png',
      content_length: 45678,
      content_url: `/api/inscription/${id}/content`,
      genesis_transaction: 'abc123def456...',
      genesis_height: 780000,
      genesis_timestamp: 1695320600,
      genesis_fee: 12345,
      output_value: 546,
      owner: {
        address: 'bc1q...',
        output: 'abc123:0',
      },
      sat: {
        number: 1234567890123456,
        decimal: '1234567.890123456',
        rarity: 'common',
        name: 'satoshi_name',
      },
      children: [],
      parent: null,
      metadata: {
        name: 'Example Inscription',
        collection: 'Example Collection',
        attributes: [
          { trait_type: 'Background', value: 'Blue' },
          { trait_type: 'Type', value: 'Rare' },
        ],
      },
      transfer_count: 5,
      last_transfer: '2024-01-15T10:30:00Z',
    };

    return NextResponse.json(inscriptionData, { status: 200 });

  } catch (error) {
    console.error('Error fetching inscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inscription data' },
      { status: 500 }
    );
  }
}

// Export the protected route with x402 payment
export const GET = createProtectedRoute(handler, {
  skipPayment: process.env.NODE_ENV === 'development', // Skip payment in development
  rateLimit: { requests: 100, windowMs: 60000 },
});

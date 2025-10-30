/**
 * Transaction API Route
 * GET /api/tx/:txid - Get transaction details (10 sats)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/x402/middleware';

async function handler(
  request: NextRequest,
  { params }: { params: { txid: string } }
) {
  try {
    const { txid } = params;

    // TODO: Implement actual Bitcoin transaction lookup
    // This should query your Bitcoin node or indexer

    // Mock response for now
    const transaction = {
      txid: txid,
      version: 2,
      locktime: 0,
      size: 225,
      weight: 900,
      fee: 4567,
      status: {
        confirmed: true,
        block_height: 820450,
        block_hash: '00000000000000000003a1b2c3d4e5f6...',
        block_time: 1705320600,
      },
      vin: [
        {
          txid: 'prev_txid_example',
          vout: 0,
          prevout: {
            scriptpubkey: '0014abcd...',
            scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 abcd...',
            scriptpubkey_type: 'v0_p2wpkh',
            scriptpubkey_address: 'bc1q...',
            value: 100000,
          },
          scriptsig: '',
          scriptsig_asm: '',
          witness: ['304402...', '03abc...'],
          is_coinbase: false,
          sequence: 4294967293,
        },
      ],
      vout: [
        {
          scriptpubkey: '0014efgh...',
          scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 efgh...',
          scriptpubkey_type: 'v0_p2wpkh',
          scriptpubkey_address: 'bc1q...',
          value: 95433,
        },
      ],
    };

    return NextResponse.json(transaction, { status: 200 });

  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

// Export the protected route with x402 payment
export const GET = createProtectedRoute(handler, {
  rateLimit: { requests: 100, windowMs: 60000 }, // 100 requests per minute
});

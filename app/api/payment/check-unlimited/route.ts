import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase only if keys are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // If Supabase is not configured, return free tier
    if (!supabase) {
      return NextResponse.json({
        hasUnlimited: false,
        usage: {
          today: 0,
          thisMonth: 0,
        },
      });
    }

    // Check if wallet has unlimited access
    const { data, error } = await supabase
      .from('unlimited_users')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single();

    if (error || !data) {
      // User doesn't have unlimited access
      return NextResponse.json({
        hasUnlimited: false,
        usage: {
          today: 0,
          thisMonth: 0,
        },
      });
    }

    // User has unlimited access
    return NextResponse.json({
      hasUnlimited: true,
      activatedAt: data.activated_at,
      txHash: data.tx_hash,
      chain: data.chain,
      usage: {
        today: 0, // Unlimited users don't track usage
        thisMonth: 0,
      },
    });

  } catch (error: any) {
    console.error('Check unlimited error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Check failed' },
      { status: 500 }
    );
  }
}

/**
 * Signature Verification API
 * Verifies wallet signatures for payment authorization (no actual crypto transfer)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyMessage } from 'viem';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, signature, message, requestId, tier, chainId } = body;

    if (!address || !signature || !message || !requestId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the signature
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Handle unlimited tier payment
    if (tier === 'unlimited') {
      // Check if user already has unlimited access
      const { data: existing } = await supabase
        .from('unlimited_access')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .single();

      if (existing) {
        return NextResponse.json({
          success: true,
          message: 'You already have unlimited access',
          hasUnlimitedAccess: true,
        });
      }

      // Grant unlimited access
      await supabase.from('unlimited_access').insert({
        wallet_address: address.toLowerCase(),
        chain_id: chainId,
        signature,
        request_id: requestId,
        payment_amount: 50,
        granted_at: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Unlimited access granted!',
        hasUnlimitedAccess: true,
      });
    }

    // Handle free tier request
    // Check daily usage
    const today = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabase
      .from('daily_usage')
      .select('request_count')
      .eq('wallet_address', address.toLowerCase())
      .eq('date', today)
      .single();

    const currentCount = usage?.request_count || 0;

    if (currentCount >= 100) {
      return NextResponse.json(
        { error: 'Daily free limit exceeded (100 requests/day)' },
        { status: 429 }
      );
    }

    // Increment usage
    await supabase
      .from('daily_usage')
      .upsert({
        wallet_address: address.toLowerCase(),
        date: today,
        request_count: currentCount + 1,
      });

    return NextResponse.json({
      success: true,
      message: 'Request authorized',
      remainingRequests: 100 - currentCount - 1,
    });

  } catch (error) {
    console.error('Signature verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}

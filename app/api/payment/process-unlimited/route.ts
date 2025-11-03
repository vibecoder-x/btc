import { NextRequest, NextResponse } from 'next/server';
import { verifyMessage } from 'viem';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { address, chainId, chainName, message, signature, timestamp } = await request.json();

    if (!address || !message || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the signature is valid
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Check if timestamp is recent (within 5 minutes)
    const now = Date.now();
    if (now - timestamp > 5 * 60 * 1000) {
      return NextResponse.json(
        { error: 'Signature expired. Please try again.' },
        { status: 400 }
      );
    }

    // Check if user already has unlimited access
    const { data: existingAccess } = await supabase
      .from('unlimited_access')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .single();

    if (existingAccess) {
      return NextResponse.json({
        success: true,
        message: 'You already have unlimited access',
      });
    }

    // Grant unlimited access
    const { error: insertError } = await supabase
      .from('unlimited_access')
      .insert({
        wallet_address: address.toLowerCase(),
        chain_id: chainId,
        chain_name: chainName,
        signature,
        payment_amount: 50,
        payment_currency: 'USD',
        activated_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Database error:', insertError);
      return NextResponse.json(
        { error: 'Failed to activate unlimited access' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Unlimited access activated successfully!',
    });

  } catch (error: any) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process payment' },
      { status: 500 }
    );
  }
}

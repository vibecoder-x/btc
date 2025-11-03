/**
 * Check Remaining Free Requests API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address required' },
        { status: 400 }
      );
    }

    // Check if user has unlimited access
    const { data: unlimited } = await supabase
      .from('unlimited_access')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .single();

    if (unlimited) {
      return NextResponse.json({
        remaining: -1, // Unlimited
        hasUnlimitedAccess: true,
      });
    }

    // Check daily usage
    const today = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabase
      .from('daily_usage')
      .select('request_count')
      .eq('wallet_address', address.toLowerCase())
      .eq('date', today)
      .single();

    const used = usage?.request_count || 0;
    const remaining = Math.max(0, 100 - used);

    return NextResponse.json({
      remaining,
      used,
      limit: 100,
      hasUnlimitedAccess: false,
    });

  } catch (error) {
    console.error('Error checking remaining requests:', error);
    return NextResponse.json(
      { error: 'Failed to check requests' },
      { status: 500 }
    );
  }
}

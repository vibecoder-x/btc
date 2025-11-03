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
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Check if user has unlimited access
    const { data, error } = await supabase
      .from('unlimited_access')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to check access' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      hasUnlimitedAccess: !!data,
      activatedAt: data?.activated_at || null,
      chainName: data?.chain_name || null,
    });

  } catch (error: any) {
    console.error('Check unlimited error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check unlimited access' },
      { status: 500 }
    );
  }
}

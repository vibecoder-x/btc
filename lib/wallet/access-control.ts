import { createClient } from '@supabase/supabase-js';

// Initialize Supabase only if keys are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export interface AccessStatus {
  hasAccess: boolean;
  isUnlimited: boolean;
  dailyLimit: number;
  usedToday: number;
}

/**
 * Check if a wallet address has access to the API
 * Returns access status including whether they have unlimited access
 */
export async function checkWalletAccess(walletAddress: string): Promise<AccessStatus> {
  try {
    if (!walletAddress) {
      return {
        hasAccess: true, // Free tier always has access
        isUnlimited: false,
        dailyLimit: 100,
        usedToday: 0,
      };
    }

    // If Supabase is not configured, return free tier access
    if (!supabase) {
      return {
        hasAccess: true,
        isUnlimited: false,
        dailyLimit: 100,
        usedToday: 0,
      };
    }

    // Check if wallet has unlimited access
    const { data: unlimitedUser } = await supabase
      .from('unlimited_users')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single();

    if (unlimitedUser) {
      // Unlimited access - no rate limits
      return {
        hasAccess: true,
        isUnlimited: true,
        dailyLimit: Infinity,
        usedToday: 0,
      };
    }

    // Free tier - check daily usage
    const today = new Date().toISOString().split('T')[0];

    const { data: usage } = await supabase
      .from('api_usage')
      .select('request_count')
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('date', today)
      .single();

    const usedToday = usage?.request_count || 0;
    const dailyLimit = 100; // Free tier limit

    return {
      hasAccess: usedToday < dailyLimit,
      isUnlimited: false,
      dailyLimit,
      usedToday,
    };

  } catch (error) {
    console.error('Error checking wallet access:', error);
    // On error, allow access but with free tier limits
    return {
      hasAccess: true,
      isUnlimited: false,
      dailyLimit: 100,
      usedToday: 0,
    };
  }
}

/**
 * Track API usage for a wallet address
 */
export async function trackApiUsage(walletAddress: string): Promise<void> {
  try {
    if (!walletAddress || !supabase) return;

    const today = new Date().toISOString().split('T')[0];

    // Increment usage count
    const { data: existing } = await supabase
      .from('api_usage')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('date', today)
      .single();

    if (existing) {
      // Update existing record
      await supabase
        .from('api_usage')
        .update({ request_count: existing.request_count + 1 })
        .eq('id', existing.id);
    } else {
      // Create new record
      await supabase
        .from('api_usage')
        .insert({
          wallet_address: walletAddress.toLowerCase(),
          date: today,
          request_count: 1,
        });
    }
  } catch (error) {
    console.error('Error tracking API usage:', error);
  }
}

/**
 * Check if a wallet has unlimited access
 */
export async function hasUnlimitedAccess(walletAddress: string): Promise<boolean> {
  try {
    if (!walletAddress || !supabase) return false;

    const { data } = await supabase
      .from('unlimited_users')
      .select('wallet_address')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single();

    return !!data;
  } catch (error) {
    return false;
  }
}

-- Migration: Add subscription tracking to existing users_profile table
-- Run this in your Supabase SQL Editor if you already have the users_profile table

-- Add subscription_expires_at column
ALTER TABLE public.users_profile
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- Add payment_status column
ALTER TABLE public.users_profile
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'none'
CHECK (payment_status IN ('none', 'pending', 'confirmed', 'expired'));

-- Create index for subscription expiry checks
CREATE INDEX IF NOT EXISTS idx_users_profile_subscription_expires
ON public.users_profile(subscription_expires_at);

-- Function to check and downgrade expired subscriptions
CREATE OR REPLACE FUNCTION public.check_expired_subscriptions()
RETURNS void AS $$
BEGIN
  UPDATE public.users_profile
  SET
    plan_type = 'free',
    payment_status = 'expired'
  WHERE
    plan_type = 'premium'
    AND subscription_expires_at IS NOT NULL
    AND subscription_expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to run daily (requires pg_cron extension)
-- Note: pg_cron needs to be enabled in Supabase Dashboard -> Database -> Extensions
-- SELECT cron.schedule('check-expired-subscriptions', '0 0 * * *', 'SELECT public.check_expired_subscriptions()');

COMMENT ON COLUMN public.users_profile.subscription_expires_at IS 'Timestamp when premium subscription expires';
COMMENT ON COLUMN public.users_profile.payment_status IS 'Payment status: none, pending, confirmed, expired';
COMMENT ON FUNCTION public.check_expired_subscriptions IS 'Automatically downgrade expired premium subscriptions to free plan';

'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Bitcoin, Copy, Check, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [months, setMonths] = useState(1);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirming' | 'confirmed'>('pending');

  // Your Bitcoin wallet address
  const BTC_WALLET = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'; // Replace with your actual BTC wallet
  const MONTHLY_PRICE_USD = 10;

  useEffect(() => {
    checkAuth();
    fetchBtcPrice();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/login?redirect=/payment');
        return;
      }

      setUser(authUser);
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBtcPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      const data = await response.json();
      setBtcPrice(data.bitcoin.usd);
    } catch (error) {
      console.error('Error fetching BTC price:', error);
      // Fallback price if API fails
      setBtcPrice(50000);
    }
  };

  const calculateBtcAmount = () => {
    if (!btcPrice) return '0.00000000';
    const totalUsd = MONTHLY_PRICE_USD * months;
    const btcAmount = totalUsd / btcPrice;
    return btcAmount.toFixed(8);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(BTC_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkPayment = async () => {
    setChecking(true);
    setPaymentStatus('confirming');

    try {
      // In production, you would verify the transaction on the blockchain
      // For now, we'll simulate a payment check

      // TODO: Implement actual blockchain verification
      // You can use blockchain.info API or your own Bitcoin node
      // Example: https://blockchain.info/q/addressbalance/{address}

      // Simulate payment verification (remove this in production)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update user's subscription in database
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + months);

      const { error } = await supabase
        .from('users_profile')
        .update({
          plan_type: 'premium',
          subscription_expires_at: expiryDate.toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setPaymentStatus('confirmed');

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard?payment=success');
      }, 3000);

    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Unable to verify payment. Please contact support if you have already sent the payment.');
      setPaymentStatus('pending');
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-[#FFD700] text-xl">Loading payment details...</div>
      </div>
    );
  }

  if (paymentStatus === 'confirmed') {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-3d rounded-2xl p-12 text-center max-w-md"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gradient-gold mb-4">Payment Confirmed!</h2>
          <p className="text-foreground/70 mb-6">
            Your Premium subscription for {months} {months === 1 ? 'month' : 'months'} has been activated.
          </p>
          <p className="text-sm text-foreground/50">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-gold mb-2">Premium Payment</h1>
          <p className="text-foreground/70">Pay with Bitcoin for Premium API access</p>
        </div>

        {/* Main Payment Card */}
        <div className="card-3d rounded-2xl p-8 mb-6">
          {/* Select Duration */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-foreground/70 mb-3">
              Select Subscription Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[1, 3, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    months === m
                      ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700]'
                      : 'border-[#FFD700]/30 text-foreground/70 hover:border-[#FFD700]/50'
                  }`}
                >
                  <div className="font-bold">{m}</div>
                  <div className="text-xs">{m === 1 ? 'Month' : 'Months'}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-black/50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-foreground/70">Duration:</span>
              <span className="font-bold text-foreground">{months} {months === 1 ? 'Month' : 'Months'}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-foreground/70">Price per month:</span>
              <span className="font-bold text-foreground">${MONTHLY_PRICE_USD} USD</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-foreground/70">BTC Price:</span>
              <span className="font-bold text-foreground">
                {btcPrice ? `$${btcPrice.toLocaleString()}` : 'Loading...'}
              </span>
            </div>
            <div className="border-t border-[#FFD700]/20 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#FFD700]">Total Amount:</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gradient-gold">{calculateBtcAmount()} BTC</div>
                  <div className="text-sm text-foreground/70">≈ ${MONTHLY_PRICE_USD * months} USD</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bitcoin Wallet Address */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-foreground/70 mb-3">
              Send Bitcoin to this address:
            </label>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 bg-black/50 border border-[#FFD700]/30 rounded-lg p-4 font-mono text-sm break-all">
                {BTC_WALLET}
              </div>
              <button
                onClick={copyAddress}
                className="px-4 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all text-[#0A0A0A]"
                title="Copy address"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* QR Code placeholder - you can add a real QR code library */}
            <div className="bg-white rounded-xl p-6 flex items-center justify-center">
              <div className="text-center">
                <Bitcoin className="w-16 h-16 text-[#F7931A] mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Scan QR code with your Bitcoin wallet</p>
                <p className="text-gray-400 text-xs mt-2">(QR code will be added here)</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-[#FFD700] mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Payment Instructions
            </h3>
            <ol className="space-y-2 text-sm text-foreground/70">
              <li>1. Send exactly <strong className="text-[#FFD700]">{calculateBtcAmount()} BTC</strong> to the address above</li>
              <li>2. Wait for at least 1 blockchain confirmation (≈ 10 minutes)</li>
              <li>3. Click "Verify Payment" button below</li>
              <li>4. Your Premium plan will be activated immediately after verification</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={checkPayment}
              disabled={checking || paymentStatus === 'confirming'}
              className="flex-1 px-8 py-4 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-lg text-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {checking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying Payment...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Verify Payment
                </>
              )}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-4 rounded-lg border-2 border-[#FFD700]/30 text-foreground hover:border-[#FFD700] transition-colors font-semibold"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center text-sm text-foreground/50">
          <p>Need help? Contact us at <a href="mailto:support@btcindexer.com" className="text-[#FFD700] hover:underline">support@btcindexer.com</a></p>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-[#FFD700] text-xl">Loading payment details...</div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}

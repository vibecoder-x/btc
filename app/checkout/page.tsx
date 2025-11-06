'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Loader2, AlertCircle, Crown, Wallet as WalletIcon, Bitcoin as BitcoinIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useSignMessage } from 'wagmi';
import { formatAddress, getChainIcon } from '@/hooks/useMultiChainPayment';
import { useBitcoinWallet } from '@/hooks/useBitcoinWallet';
import BitcoinPayment from '@/components/BitcoinPayment';

export default function CheckoutPage() {
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { address, isConnected, chain } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'signature' | 'bitcoin'>('signature');

  // Bitcoin wallet
  const { wallet: btcWallet, isConnected: btcIsConnected } = useBitcoinWallet();

  // Check if user already has unlimited access
  useEffect(() => {
    const checkUnlimitedAccess = async () => {
      if (!address) return;

      try {
        const response = await fetch(`/api/payment/check-unlimited?address=${address}`);
        const data = await response.json();

        if (data.hasUnlimitedAccess) {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Error checking unlimited access:', err);
      }
    };

    checkUnlimitedAccess();
  }, [address, router]);

  const handlePayment = async () => {
    if (!isConnected || !address || !chain) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Create payment message to sign
      const timestamp = Date.now();
      const message = `Upgrade to Unlimited Access\n\nAmount: $50 USD\nWallet: ${address}\nChain: ${chain.name}\nTimestamp: ${timestamp}\n\nBy signing this message, you authorize the payment for unlimited API access.`;

      // Request signature from user's wallet
      const signature = await signMessageAsync({ message });

      // Send signature to backend for verification and payment processing
      const response = await fetch('/api/payment/process-unlimited', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          chainId: chain.id,
          chainName: chain.name,
          message,
          signature,
          timestamp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Payment processing failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      if (err.message?.includes('User rejected')) {
        setError('Payment cancelled. Please try again when ready.');
      } else {
        setError(err.message || 'Payment failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/pricing"
          className="inline-flex items-center text-[#FFD700] hover:text-[#FF6B35] transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pricing
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-gold-orange mb-4">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
              Upgrade to Unlimited
            </h1>
            <p className="text-xl text-foreground/70">
              Pay once with crypto, enjoy lifetime unlimited API access
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-xl bg-[#4CAF50]/20 border border-[#4CAF50]/30"
            >
              <div className="flex items-center gap-3 text-[#4CAF50]">
                <Check className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg">Payment Confirmed!</h3>
                  <p className="text-sm text-foreground/70">Redirecting to your dashboard...</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-xl bg-red-500/20 border border-red-500/30"
            >
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg">Error</h3>
                  <p className="text-sm text-foreground/70">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - What You Get */}
            <div>
              <div className="card-3d rounded-2xl p-8 mb-6">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-6">What You Get</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
                    <div>
                      <p className="text-foreground font-semibold">Unlimited API Requests</p>
                      <p className="text-sm text-foreground/60">No limits, no throttling, forever</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
                    <div>
                      <p className="text-foreground font-semibold">All API Endpoints</p>
                      <p className="text-sm text-foreground/60">Full access to our entire API suite</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
                    <div>
                      <p className="text-foreground font-semibold">Personal Dashboard</p>
                      <p className="text-sm text-foreground/60">Track your usage and analytics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
                    <div>
                      <p className="text-foreground font-semibold">Priority Support</p>
                      <p className="text-sm text-foreground/60">Get help when you need it</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
                    <div>
                      <p className="text-foreground font-semibold">Lifetime Updates</p>
                      <p className="text-sm text-foreground/60">All future features included</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="card-3d rounded-2xl p-8">
                <h3 className="text-xl font-bold text-[#FFD700] mb-4">One-Time Payment</h3>
                <div className="text-center py-6">
                  <div className="text-6xl font-bold text-gradient-gold mb-2">$50</div>
                  <p className="text-foreground/60">Pay once, use forever</p>
                </div>
              </div>
            </div>

            {/* Right Column - Payment */}
            <div>
              <div className="card-3d rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-2">
                  Complete Your Payment
                </h2>
                <p className="text-sm text-foreground/70 mb-6">
                  Choose your preferred payment method
                </p>

                {/* Payment Method Selector */}
                <div className="flex gap-2 mb-6 p-1 rounded-lg bg-[#0A0A0A] border border-[#FFD700]/20">
                  <button
                    onClick={() => setPaymentMethod('signature')}
                    className={`flex-1 py-3 px-4 rounded-lg transition-all font-semibold text-sm ${
                      paymentMethod === 'signature'
                        ? 'bg-[#FFD700] text-[#0A0A0A]'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <WalletIcon className="w-4 h-4" />
                      Wallet Signature
                    </span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('bitcoin')}
                    className={`flex-1 py-3 px-4 rounded-lg transition-all font-semibold text-sm ${
                      paymentMethod === 'bitcoin'
                        ? 'bg-[#FFD700] text-[#0A0A0A]'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <BitcoinIcon className="w-4 h-4" />
                      Bitcoin
                    </span>
                  </button>
                </div>

                {/* Wallet Signature Payment */}
                {paymentMethod === 'signature' && (
                  <>
                    {/* Wallet Connection Status */}
                    {!isConnected ? (
                      <div className="mb-6 p-6 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-center">
                        <WalletIcon className="w-12 h-12 text-[#FFD700] mx-auto mb-3" />
                        <h3 className="font-bold text-foreground mb-2">Connect Your Wallet</h3>
                        <p className="text-sm text-foreground/70 mb-4">
                          Connect your crypto wallet to continue with payment
                        </p>
                        <button
                          onClick={() => open()}
                          className="px-6 py-3 rounded-xl gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white"
                        >
                          Connect Wallet
                        </button>
                      </div>
                    ) : (
                  <div className="mb-6 p-4 rounded-xl bg-[#4CAF50]/20 border border-[#4CAF50]/30">
                    <div className="flex items-center gap-2 text-[#4CAF50] mb-2">
                      <Check className="w-5 h-5" />
                      <span className="font-semibold">Wallet Connected</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono text-foreground/70">
                          {formatAddress(address || '')}
                        </p>
                        {chain && (
                          <p className="text-xs text-foreground/50 mt-1">
                            {getChainIcon(chain.id)} {chain.name}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => open()}
                        className="text-sm text-[#FFD700] hover:text-[#FF6B35] transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                {isConnected && (
                  <>
                    <div className="mb-6 p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30">
                      <h4 className="font-semibold text-foreground mb-3">How it works:</h4>
                      <ol className="space-y-2 text-sm text-foreground/70">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFD700] font-bold">1.</span>
                          <span>Click the payment button below</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFD700] font-bold">2.</span>
                          <span>Your wallet will open to sign a message</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFD700] font-bold">3.</span>
                          <span>Approve the signature (no gas fees required)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFD700] font-bold">4.</span>
                          <span>Get instant unlimited access</span>
                        </li>
                      </ol>
                    </div>

                    {/* Payment Button */}
                    {!success && (
                      <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full px-6 py-4 rounded-xl gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <WalletIcon className="w-6 h-6" />
                            Pay $50 - Upgrade Now
                          </>
                        )}
                      </button>
                    )}
                  </>
                )}

                {/* Success State */}
                {success && (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-[#4CAF50]/20 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-10 h-10 text-[#4CAF50]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#4CAF50] mb-2">Payment Confirmed!</h3>
                    <p className="text-foreground/70">Upgrading your account...</p>
                  </div>
                )}

                    <div className="mt-6 pt-6 border-t border-[#FFD700]/20">
                      <div className="space-y-2 text-xs text-foreground/50">
                        <p className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#4CAF50]" />
                          Secure payment via wallet signature
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#4CAF50]" />
                          No gas fees required
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#4CAF50]" />
                          Instant activation
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Bitcoin Payment */}
                {paymentMethod === 'bitcoin' && (
                  <div>
                    <BitcoinPayment
                      amount={50}
                      onPaymentConfirmed={() => {
                        setSuccess(true);
                        setTimeout(() => {
                          router.push('/dashboard');
                        }, 2000);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Supported Chains */}
              <div className="card-3d rounded-2xl p-6 mt-6">
                <h4 className="font-semibold text-foreground mb-3 text-sm">Supported Networks:</h4>
                <div className="flex flex-wrap gap-2">
                  {['Ethereum', 'Polygon', 'Base', 'Arbitrum', 'Optimism', 'BNB Chain', 'Avalanche'].map((network) => (
                    <span
                      key={network}
                      className="px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-xs text-foreground/70"
                    >
                      {network}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

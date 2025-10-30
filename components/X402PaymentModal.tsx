'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock, Zap, Loader2, Wallet, AlertCircle } from 'lucide-react';
import { X402Response, CHAIN_CONFIGS } from '@/lib/x402/types';
import { useWeb3Payment } from '@/hooks/useWeb3Payment';

interface X402PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: X402Response;
  onPaymentComplete?: (data: any) => void;
}

export function X402PaymentModal({
  isOpen,
  onClose,
  paymentData,
  onPaymentComplete,
}: X402PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'sending' | 'confirming' | 'confirmed'>('pending');
  const [timeRemaining, setTimeRemaining] = useState<number>(600); // 10 minutes

  const { sendPayment, verifyPayment, isSending, txHash, error, setError } = useWeb3Payment();
  const chainConfig = CHAIN_CONFIGS[paymentData.chain];

  useEffect(() => {
    if (!isOpen) return;

    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Auto-verify when tx hash is available
  useEffect(() => {
    if (!txHash || paymentStatus === 'confirmed') return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await verifyPayment(paymentData.request_id, txHash);

        if (status.status === 'CONFIRMED') {
          setPaymentStatus('confirmed');
          clearInterval(pollInterval);
          setTimeout(() => {
            onPaymentComplete?.(status.responseData);
            onClose();
          }, 2000);
        } else if (status.status === 'CONFIRMING') {
          setPaymentStatus('confirming');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [txHash, paymentStatus, paymentData.request_id, verifyPayment, onPaymentComplete, onClose]);

  const handlePayment = async () => {
    setError(null);
    setPaymentStatus('sending');

    const hash = await sendPayment(paymentData);

    if (hash) {
      setPaymentStatus('confirming');
    } else {
      setPaymentStatus('pending');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWalletName = () => {
    if (paymentData.chain === 'solana') return 'Phantom';
    return 'MetaMask';
  };

  const getWalletInstallUrl = () => {
    if (paymentData.chain === 'solana') return 'https://phantom.app';
    return 'https://metamask.io';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glassmorphism rounded-2xl p-6 md:p-8 shadow-2xl border border-neon-blue/30"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-neon-blue/10 transition-colors"
          >
            <X className="w-5 h-5 text-foreground/70" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-neon-blue/20 text-2xl">
                {chainConfig.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neon-blue">Payment Required</h2>
                <p className="text-sm text-foreground/70">Pay on {chainConfig.name}</p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'confirmed' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-neon-green/20 border border-neon-green/30"
            >
              <div className="flex items-center gap-2 text-neon-green">
                <Check className="w-5 h-5" />
                <span className="font-semibold">Payment Confirmed!</span>
              </div>
              <p className="text-sm text-foreground/70 mt-1">Loading your data...</p>
            </motion.div>
          )}

          {paymentStatus === 'confirming' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-neon-orange/20 border border-neon-orange/30"
            >
              <div className="flex items-center gap-2 text-neon-orange">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-semibold">Waiting for Confirmation...</span>
              </div>
              <p className="text-sm text-foreground/70 mt-1">Your transaction is being verified on-chain</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30"
            >
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Error</span>
              </div>
              <p className="text-sm text-foreground/70 mt-1">{error}</p>
            </motion.div>
          )}

          {/* Amount */}
          <div className="mb-6 p-4 rounded-xl bg-space-black/50 border border-neon-blue/20">
            <div className="text-center">
              <p className="text-sm text-foreground/70 mb-1">Amount Due</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-neon-blue">
                  {paymentData.amountToken}
                </span>
                <span className="text-xl text-foreground/70">{chainConfig.nativeCurrency.symbol}</span>
              </div>
              <p className="text-xs text-foreground/50 mt-1">
                ≈ ${paymentData.amount.toFixed(2)} USD
              </p>
            </div>
          </div>

          {/* Timer */}
          <div className="mb-6 flex items-center justify-center gap-2 text-foreground/70">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              Time remaining: <span className="text-neon-blue font-mono">{formatTime(timeRemaining)}</span>
            </span>
          </div>

          {/* Payment Button */}
          <div className="mb-6">
            <button
              onClick={handlePayment}
              disabled={isSending || paymentStatus === 'confirming' || paymentStatus === 'confirmed'}
              className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-neon-blue to-neon-orange hover:glow-blue transition-all duration-300 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Opening {getWalletName()}...
                </>
              ) : paymentStatus === 'confirming' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Confirming Payment...
                </>
              ) : paymentStatus === 'confirmed' ? (
                <>
                  <Check className="w-5 h-5" />
                  Payment Confirmed
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Pay with {getWalletName()}
                </>
              )}
            </button>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
            <h3 className="text-sm font-semibold text-neon-blue mb-2">How it works:</h3>
            <ol className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="text-neon-orange font-bold">1.</span>
                <span>Click "Pay with {getWalletName()}" button</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-orange font-bold">2.</span>
                <span>Your wallet will open automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-orange font-bold">3.</span>
                <span>Approve the transaction in your wallet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-orange font-bold">4.</span>
                <span>Wait for confirmation (usually 10-30 seconds)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-orange font-bold">5.</span>
                <span>Your data will load automatically!</span>
              </li>
            </ol>
          </div>

          {/* Wallet Not Installed */}
          <div className="mt-6 text-center">
            <p className="text-xs text-foreground/50">
              Don't have {getWalletName()}?{' '}
              <a
                href={getWalletInstallUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-blue hover:text-neon-orange font-semibold"
              >
                Install it here
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-foreground/10">
            <p className="text-xs text-center text-foreground/50">
              Powered by x402 protocol • Secure on-chain payment
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

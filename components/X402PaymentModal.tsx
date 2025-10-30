'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Clock, Bitcoin, Zap, ExternalLink } from 'lucide-react';
import { X402Response } from '@/lib/x402/types';

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
  const [copied, setCopied] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'detected' | 'confirmed'>('pending');
  const [timeRemaining, setTimeRemaining] = useState<number>(600); // 10 minutes

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

    // Poll for payment status
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/payment/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId: paymentData.request_id }),
        });

        const status = await response.json();

        if (status.status === 'CONFIRMED') {
          setPaymentStatus('confirmed');
          clearInterval(pollInterval);
          setTimeout(() => {
            onPaymentComplete?.(status.responseData);
            onClose();
          }, 2000);
        } else if (status.status === 'DETECTED' || status.status === 'CONFIRMING') {
          setPaymentStatus('detected');
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(timer);
      clearInterval(pollInterval);
    };
  }, [isOpen, paymentData.request_id, onPaymentComplete, onClose]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const satsToBTC = (sats: number) => {
    return (sats / 100000000).toFixed(8);
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
              <div className="p-3 rounded-xl bg-neon-blue/20">
                <Bitcoin className="w-6 h-6 text-neon-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neon-blue">Payment Required</h2>
                <p className="text-sm text-foreground/70">x402 Pay-Per-Use Protocol</p>
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

          {paymentStatus === 'detected' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-neon-orange/20 border border-neon-orange/30"
            >
              <div className="flex items-center gap-2 text-neon-orange">
                <Zap className="w-5 h-5 animate-pulse" />
                <span className="font-semibold">Payment Detected!</span>
              </div>
              <p className="text-sm text-foreground/70 mt-1">Waiting for confirmations...</p>
            </motion.div>
          )}

          {/* Amount */}
          <div className="mb-6 p-4 rounded-xl bg-space-black/50 border border-neon-blue/20">
            <div className="text-center">
              <p className="text-sm text-foreground/70 mb-1">Amount Due</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-neon-blue">{paymentData.amount}</span>
                <span className="text-xl text-foreground/70">sats</span>
              </div>
              <p className="text-xs text-foreground/50 mt-1">
                ≈ {satsToBTC(paymentData.amount)} BTC
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

          {/* Payment Address */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground/70 mb-2">
              Payment Address
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={paymentData.payment_address}
                className="flex-1 px-4 py-3 rounded-lg bg-space-black/50 border border-neon-blue/30 text-neon-green font-mono text-sm focus:outline-none focus:border-neon-blue"
              />
              <button
                onClick={() => copyToClipboard(paymentData.payment_address, 'address')}
                className="px-4 py-3 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-colors"
              >
                {copied === 'address' ? (
                  <Check className="w-5 h-5 text-neon-green" />
                ) : (
                  <Copy className="w-5 h-5 text-foreground/70" />
                )}
              </button>
            </div>
          </div>

          {/* Inscription Data */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground/70 mb-2">
              Inscription Data
            </label>
            <div className="relative">
              <pre className="px-4 py-3 rounded-lg bg-space-black/50 border border-neon-blue/30 text-neon-green text-xs font-mono overflow-x-auto">
                {JSON.stringify(paymentData.inscription_data, null, 2)}
              </pre>
              <button
                onClick={() => copyToClipboard(JSON.stringify(paymentData.inscription_data), 'inscription')}
                className="absolute top-2 right-2 p-2 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-colors"
              >
                {copied === 'inscription' ? (
                  <Check className="w-4 h-4 text-neon-green" />
                ) : (
                  <Copy className="w-4 h-4 text-foreground/70" />
                )}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
            <h3 className="text-sm font-semibold text-neon-blue mb-2">How to Pay:</h3>
            <ol className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="text-neon-orange">1.</span>
                <span>Create an inscription with the provided data above</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-orange">2.</span>
                <span>Send the inscription to the payment address</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-orange">3.</span>
                <span>Wait for confirmation (usually 10-30 minutes)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-orange">4.</span>
                <span>Your data will be delivered automatically</span>
              </li>
            </ol>
          </div>

          {/* Wallet Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => window.open('https://xverse.app', '_blank')}
              className="px-4 py-3 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <ExternalLink className="w-4 h-4" />
              Xverse Wallet
            </button>
            <button
              onClick={() => window.open('https://unisat.io', '_blank')}
              className="px-4 py-3 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <ExternalLink className="w-4 h-4" />
              Unisat Wallet
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-foreground/10">
            <p className="text-xs text-center text-foreground/50">
              No account required • Pay only what you use • Powered by Bitcoin inscriptions
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

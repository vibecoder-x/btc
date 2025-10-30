'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Clock, Zap, ExternalLink, Wallet } from 'lucide-react';
import { X402Response, CHAIN_CONFIGS, SupportedChain } from '@/lib/x402/types';

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
  const [txHash, setTxHash] = useState('');

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

    // Poll for payment status
    const pollInterval = setInterval(async () => {
      if (!txHash) return; // Wait for user to provide tx hash

      try {
        const response = await fetch('/api/payment/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId: paymentData.request_id, txHash }),
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
  }, [isOpen, paymentData.request_id, txHash, onPaymentComplete, onClose]);

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

  const openExplorer = () => {
    if (txHash && chainConfig) {
      const url = `${chainConfig.explorerUrl}/tx/${txHash}`;
      window.open(url, '_blank');
    }
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

          {/* Recipient Address */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground/70 mb-2">
              Send To
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={paymentData.recipient_address}
                className="flex-1 px-4 py-3 rounded-lg bg-space-black/50 border border-neon-blue/30 text-neon-green font-mono text-sm focus:outline-none focus:border-neon-blue"
              />
              <button
                onClick={() => copyToClipboard(paymentData.recipient_address, 'address')}
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

          {/* Transaction Hash Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground/70 mb-2">
              Transaction Hash (after payment)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Paste your transaction hash here..."
                className="flex-1 px-4 py-3 rounded-lg bg-space-black/50 border border-neon-blue/30 text-foreground font-mono text-sm focus:outline-none focus:border-neon-blue"
              />
              {txHash && (
                <button
                  onClick={openExplorer}
                  className="px-4 py-3 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-neon-blue" />
                </button>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
            <h3 className="text-sm font-semibold text-neon-blue mb-2">How to Pay:</h3>
            <ol className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="text-neon-orange">1.</span>
                <span>Open your {chainConfig.name} wallet (MetaMask, Phantom, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-orange">2.</span>
                <span>Send {paymentData.amountToken} {chainConfig.nativeCurrency.symbol} to the address above</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-orange">3.</span>
                <span>Paste your transaction hash in the field above</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-orange">4.</span>
                <span>Wait for confirmation (usually 1-2 minutes)</span>
              </li>
            </ol>
          </div>

          {/* Wallet Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {paymentData.chain === 'solana' ? (
              <>
                <button
                  onClick={() => window.open('https://phantom.app', '_blank')}
                  className="px-4 py-3 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <Wallet className="w-4 h-4" />
                  Phantom
                </button>
                <button
                  onClick={() => window.open('https://solflare.com', '_blank')}
                  className="px-4 py-3 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <Wallet className="w-4 h-4" />
                  Solflare
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => window.open('https://metamask.io', '_blank')}
                  className="px-4 py-3 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <Wallet className="w-4 h-4" />
                  MetaMask
                </button>
                <button
                  onClick={() => window.open(chainConfig.explorerUrl, '_blank')}
                  className="px-4 py-3 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <ExternalLink className="w-4 h-4" />
                  Explorer
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-foreground/10">
            <p className="text-xs text-center text-foreground/50">
              Powered by x402 protocol • Pay-per-use on {chainConfig.name}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

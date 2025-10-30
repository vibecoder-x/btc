'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet as WalletIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WalletConnect } from '@/components/WalletConnect';
import { WalletService } from '@/lib/wallet/wallet-service';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if already connected
    const savedAccount = WalletService.getSavedAccount();
    if (savedAccount) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleConnect = (address: string, walletType: string) => {
    console.log('Connected:', address, walletType);
    // Redirect to dashboard after successful connection
    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 500);
  };

  const handleError = (error: string) => {
    console.error('Connection error:', error);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-neon-blue hover:text-neon-orange transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glassmorphism rounded-2xl p-8 border border-neon-blue/30"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-orange mb-4">
              <WalletIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-neon-blue mb-2">Connect Wallet</h1>
            <p className="text-foreground/70">
              Sign in with your Bitcoin wallet - no passwords needed
            </p>
          </div>

          {/* Wallet Connect Component */}
          <WalletConnect onConnect={handleConnect} onError={handleError} />

          {/* Info Section */}
          <div className="mt-8 pt-6 border-t border-foreground/10">
            <h3 className="text-sm font-semibold text-neon-blue mb-3 text-center">
              Benefits of Wallet Authentication
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs text-foreground/70">
              <div className="text-center p-3 rounded-lg bg-neon-blue/5">
                <span className="block text-2xl mb-1">🔒</span>
                <span>Secure</span>
              </div>
              <div className="text-center p-3 rounded-lg bg-neon-blue/5">
                <span className="block text-2xl mb-1">⚡</span>
                <span>Instant</span>
              </div>
              <div className="text-center p-3 rounded-lg bg-neon-blue/5">
                <span className="block text-2xl mb-1">🎯</span>
                <span>Simple</span>
              </div>
              <div className="text-center p-3 rounded-lg bg-neon-blue/5">
                <span className="block text-2xl mb-1">🔐</span>
                <span>Private</span>
              </div>
            </div>
          </div>

          {/* Don't have a wallet */}
          <div className="mt-6 text-center">
            <p className="text-sm text-foreground/70">
              Don't have a Bitcoin wallet?{' '}
              <a
                href="https://www.xverse.app/download"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-blue hover:text-neon-orange font-semibold"
              >
                Get Xverse
              </a>
            </p>
          </div>
        </motion.div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-foreground/50">
          <p>Using x402 pay-per-use protocol</p>
          <p className="mt-1">No accounts • No subscriptions • Pay only what you use</p>
        </div>
      </div>
    </div>
  );
}

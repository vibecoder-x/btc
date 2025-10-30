'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet as WalletIcon, Bitcoin, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WalletConnect } from '@/components/WalletConnect';
import { WalletService } from '@/lib/wallet/wallet-service';

export default function SignupPage() {
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
            <h1 className="text-4xl font-bold text-neon-blue mb-2">Get Started</h1>
            <p className="text-foreground/70 mb-4">
              Connect your Bitcoin wallet to start using the API
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/20 border border-neon-green/30">
              <Zap className="w-4 h-4 text-neon-green" />
              <span className="text-sm font-semibold text-neon-green">No registration required</span>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8 grid grid-cols-3 gap-3">
            <div className="text-center p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
              <Bitcoin className="w-8 h-8 text-neon-blue mx-auto mb-2" />
              <p className="text-xs text-foreground/70">Pay Per Use</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-neon-orange/10 border border-neon-orange/20">
              <Zap className="w-8 h-8 text-neon-orange mx-auto mb-2" />
              <p className="text-xs text-foreground/70">Instant Access</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-neon-green/10 border border-neon-green/20">
              <Shield className="w-8 h-8 text-neon-green mx-auto mb-2" />
              <p className="text-xs text-foreground/70">Secure</p>
            </div>
          </div>

          {/* Wallet Connect Component */}
          <WalletConnect onConnect={handleConnect} onError={handleError} />

          {/* How it works */}
          <div className="mt-8 pt-6 border-t border-foreground/10">
            <h3 className="text-sm font-semibold text-neon-blue mb-4 text-center">
              How It Works
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue font-bold text-xs">
                  1
                </div>
                <p className="text-foreground/70 flex-1">
                  Connect your Bitcoin wallet (Xverse, Unisat, etc.)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-orange/20 flex items-center justify-center text-neon-orange font-bold text-xs">
                  2
                </div>
                <p className="text-foreground/70 flex-1">
                  Make API calls - get 402 payment prompts
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green font-bold text-xs">
                  3
                </div>
                <p className="text-foreground/70 flex-1">
                  Pay with Bitcoin inscriptions - receive data instantly
                </p>
              </div>
            </div>
          </div>

          {/* Already have wallet */}
          <div className="mt-6 text-center">
            <p className="text-sm text-foreground/70">
              Already connected?{' '}
              <Link href="/login" className="text-neon-blue hover:text-neon-orange font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <div className="inline-flex flex-col gap-2 text-xs text-foreground/50">
            <div className="flex items-center gap-2">
              <span>✅ No email required</span>
              <span>✅ No passwords</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅ No subscriptions</span>
              <span>✅ Pay per use</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

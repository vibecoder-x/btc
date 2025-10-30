'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, Loader2, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WalletService, WalletType } from '@/lib/wallet/wallet-service';

export default function LoginPage() {
  const router = useRouter();
  const [connecting, setConnecting] = useState<WalletType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const wallets = WalletService.getAvailableWallets();

  const handleConnect = async (walletType: WalletType) => {
    try {
      setConnecting(walletType);
      setError(null);

      // Check if wallet is installed
      if (!wallets[walletType].installed) {
        setError(`${wallets[walletType].name} is not installed. Please install it first.`);
        setConnecting(null);
        return;
      }

      // Connect to wallet
      const account = await WalletService.connect(walletType);

      // Save account
      WalletService.saveAccount(account);

      // Show success
      setSuccess(true);

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      setConnecting(null);
    }
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
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-neon-blue mb-2">Connect Wallet</h1>
            <p className="text-foreground/70">
              Choose your wallet to get started
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-neon-green/20 border border-neon-green/30"
            >
              <div className="flex items-center gap-2 text-neon-green">
                <Check className="w-5 h-5" />
                <span className="font-semibold">Wallet Connected Successfully!</span>
              </div>
              <p className="text-sm text-foreground/70 mt-1">Redirecting to your dashboard...</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30"
            >
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Connection Failed</span>
              </div>
              <p className="text-sm text-foreground/70 mt-1">{error}</p>
            </motion.div>
          )}

          {/* Wallet Buttons */}
          <div className="space-y-4 mb-8">
            {/* MetaMask */}
            <button
              onClick={() => handleConnect('metamask')}
              disabled={connecting !== null || success}
              className="w-full p-4 rounded-xl glassmorphism border border-neon-blue/30 hover:border-neon-blue hover:bg-neon-blue/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{wallets.metamask.icon}</span>
                  <div className="text-left">
                    <p className="font-bold text-foreground">{wallets.metamask.name}</p>
                    <p className="text-xs text-foreground/50">For Base & Polygon</p>
                  </div>
                </div>
                {connecting === 'metamask' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-neon-blue" />
                ) : wallets.metamask.installed ? (
                  <span className="text-xs text-neon-green font-semibold">Installed</span>
                ) : (
                  <a
                    href={wallets.metamask.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neon-orange hover:text-neon-blue font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Install
                  </a>
                )}
              </div>
            </button>

            {/* Phantom */}
            <button
              onClick={() => handleConnect('phantom')}
              disabled={connecting !== null || success}
              className="w-full p-4 rounded-xl glassmorphism border border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{wallets.phantom.icon}</span>
                  <div className="text-left">
                    <p className="font-bold text-foreground">{wallets.phantom.name}</p>
                    <p className="text-xs text-foreground/50">For Solana</p>
                  </div>
                </div>
                {connecting === 'phantom' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                ) : wallets.phantom.installed ? (
                  <span className="text-xs text-neon-green font-semibold">Installed</span>
                ) : (
                  <a
                    href={wallets.phantom.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neon-orange hover:text-neon-blue font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Install
                  </a>
                )}
              </div>
            </button>
          </div>

          {/* Info */}
          <div className="p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
            <h3 className="text-sm font-bold text-neon-blue mb-2">What happens next?</h3>
            <ul className="text-xs text-foreground/70 space-y-1">
              <li>• Access your personal dashboard</li>
              <li>• Start with 100 free API requests per day</li>
              <li>• View your usage statistics in real-time</li>
              <li>• Upgrade to unlimited anytime for $50</li>
            </ul>
          </div>
        </motion.div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-foreground/50">
            Your wallet connection is secure and stored locally.
            <br />
            We never have access to your private keys.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { WalletService, WalletType } from '@/lib/wallet/wallet-service';

interface WalletConnectProps {
  onConnect?: (address: string, walletType: WalletType) => void;
  onError?: (error: string) => void;
}

export function WalletConnect({ onConnect, onError }: WalletConnectProps) {
  const [connecting, setConnecting] = useState<WalletType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wallets = WalletService.getAvailableWallets();

  const handleConnect = async (walletType: WalletType) => {
    setConnecting(walletType);
    setError(null);

    try {
      const account = await WalletService.connect(walletType);
      WalletService.saveAccount(account);
      onConnect?.(account.address, walletType);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-2"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Connection Failed</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      <div className="grid gap-3">
        {Object.entries(wallets).map(([type, info]) => (
          <motion.button
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              if (info.installed) {
                handleConnect(type as WalletType);
              } else {
                window.open(info.downloadUrl, '_blank');
              }
            }}
            disabled={connecting !== null}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
              info.installed
                ? 'border-neon-blue/30 bg-neon-blue/5 hover:border-neon-blue hover:bg-neon-blue/10'
                : 'border-foreground/20 bg-foreground/5 hover:border-foreground/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-orange flex items-center justify-center text-2xl">
                {info.icon}
              </div>
            </div>

            <div className="flex-1 text-left">
              <h3 className="font-bold text-foreground text-lg">{info.name}</h3>
              <p className="text-sm text-foreground/70">
                {info.installed ? 'Click to connect' : 'Not installed'}
              </p>
            </div>

            {connecting === type ? (
              <div className="flex-shrink-0">
                <div className="w-6 h-6 border-3 border-neon-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : info.installed ? (
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-neon-green" />
              </div>
            ) : (
              <div className="flex-shrink-0">
                <ExternalLink className="w-5 h-5 text-foreground/50" />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
        <div className="flex items-start gap-3">
          <Wallet className="w-5 h-5 text-neon-blue flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-foreground/70">
            <p className="font-semibold text-neon-blue mb-1">Why Connect Your Wallet?</p>
            <ul className="space-y-1">
              <li>• No passwords to remember</li>
              <li>• Your wallet, your identity</li>
              <li>• Secure Bitcoin-native authentication</li>
              <li>• Easy access to paid API features</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-foreground/50">
        By connecting your wallet, you agree to our terms of service and privacy policy
      </p>
    </div>
  );
}

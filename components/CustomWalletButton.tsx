'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, ChevronDown, X, Check, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatAddress, getChainIcon } from '@/hooks/useMultiChainPayment';

interface CustomWalletButtonProps {
  size?: 'sm' | 'md' | 'lg';
  showChain?: boolean;
  className?: string;
}

export function CustomWalletButton({ size = 'md', showChain = true, className = '' }: CustomWalletButtonProps) {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Filter out non-wallet connectors (like social login)
  const walletConnectors = connectors.filter(connector => {
    const name = connector.name.toLowerCase();
    // Only include actual crypto wallets
    return !name.includes('social') &&
           !name.includes('email') &&
           !name.includes('auth') &&
           !name.includes('magic');
  });

  const handleConnect = (connector: typeof connectors[0]) => {
    connect({ connector });
    setShowModal(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setShowModal(false);
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowModal(!showModal)}
          className={`flex items-center gap-2 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white ${sizeClasses[size]} ${className}`}
        >
          <Wallet className="w-4 h-4" />
          <span className="font-mono">{formatAddress(address)}</span>
          {showChain && chain && (
            <span className="text-xs">{getChainIcon(chain.id)}</span>
          )}
          <ChevronDown className="w-4 h-4" />
        </button>

        <AnimatePresence>
          {showModal && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowModal(false)}
              />

              {/* Dropdown Menu */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 rounded-xl card-3d p-4 z-50"
              >
                <div className="mb-3 pb-3 border-b border-[#FFD700]/20">
                  <p className="text-xs text-foreground/50 mb-1">Connected Wallet</p>
                  <p className="font-mono text-sm text-foreground">{address}</p>
                  {chain && (
                    <p className="text-xs text-foreground/70 mt-1">
                      {getChainIcon(chain.id)} {chain.name}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className={`flex items-center gap-2 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#0F0F0F] border-2 border-[#FFD700]/30 rounded-2xl p-6 z-10 shadow-2xl"
            >
                {/* Close Button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
                >
                  <X className="w-5 h-5 text-foreground/70" />
                </button>

                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gradient-gold mb-2">
                    Connect Wallet
                  </h2>
                  <p className="text-sm text-foreground/70">
                    Choose your preferred crypto wallet to connect
                  </p>
                </div>

                {/* Wallet Options */}
                <div className="space-y-3">
                  {walletConnectors.map((connector) => (
                    <button
                      key={connector.id}
                      onClick={() => handleConnect(connector)}
                      disabled={isPending}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0A0A0A] border border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:border-[#FFD700] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="flex items-center gap-3">
                        {/* Wallet Icon */}
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-white" />
                        </div>

                        {/* Wallet Name */}
                        <span className="font-semibold text-foreground">
                          {connector.name}
                        </span>
                      </div>

                      {/* Connect Arrow */}
                      <div className="text-[#FFD700] group-hover:translate-x-1 transition-transform">
                        →
                      </div>
                    </button>
                  ))}

                  {walletConnectors.length === 0 && (
                    <div className="text-center py-8 text-foreground/50">
                      No wallet connectors available
                    </div>
                  )}
                </div>

                {/* Footer Note */}
                <div className="mt-6 pt-4 border-t border-[#FFD700]/20">
                  <p className="text-xs text-foreground/50 text-center">
                    By connecting, you agree to our Terms of Service
                  </p>
                </div>
              </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

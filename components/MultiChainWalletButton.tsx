'use client';

import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { formatAddress, getChainIcon } from '@/hooks/useMultiChainPayment';
import { Wallet, LogOut, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface MultiChainWalletButtonProps {
  showBalance?: boolean;
  showChain?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MultiChainWalletButton({
  showBalance = false,
  showChain = true,
  size = 'md',
  className = '',
}: MultiChainWalletButtonProps) {
  const { open } = useWeb3Modal();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Connected state
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {/* Chain info */}
        {showChain && chain && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30"
          >
            <span className="text-xl">{getChainIcon(chain.id)}</span>
            <span className="text-sm font-semibold text-[#FFD700]">{chain.name}</span>
          </motion.div>
        )}

        {/* Address button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => open()}
          className={`flex items-center gap-3 rounded-xl gradient-gold-orange hover:glow-gold transition-all duration-300 ${sizeClasses[size]} ${className}`}
        >
          <Check className="w-4 h-4" />
          <span className="font-mono font-semibold">
            {formatAddress(address)}
          </span>
        </motion.button>

        {/* Disconnect button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => disconnect()}
          className="p-3 rounded-xl border-2 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-all duration-300"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </motion.button>
      </div>
    );
  }

  // Not connected state
  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => open()}
      className={`flex items-center gap-2 rounded-xl gradient-gold-orange hover:glow-gold transition-all duration-300 ${sizeClasses[size]} ${className}`}
    >
      <Wallet className="w-5 h-5" />
      <span className="font-semibold">Connect Wallet</span>
    </motion.button>
  );
}

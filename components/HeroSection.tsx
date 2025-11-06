'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useConnect, useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useRouter } from 'next/navigation';
import { useBitcoinWallet } from '@/hooks/useBitcoinWallet';
import { Wallet, Bitcoin } from 'lucide-react';

interface Block {
  id: number;
  x: number;
  y: number;
  height: number;
  opacity: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  yTarget: number;
  opacityTarget: number;
  duration: number;
}

export default function HeroSection() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletType, setWalletType] = useState<'evm' | 'bitcoin'>('evm');

  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { open } = useWeb3Modal();
  const router = useRouter();

  const { connectXverse, connectLeather, connectUnisat } = useBitcoinWallet();

  const handleBitcoinWalletConnect = async (walletName: string) => {
    try {
      if (walletName === 'Xverse') await connectXverse();
      else if (walletName === 'Leather') await connectLeather();
      else if (walletName === 'Unisat') await connectUnisat();
      setShowWalletModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to connect wallet');
    }
  };

  // Get wallet logo based on connector name
  const getWalletLogo = (connectorName: string): string | null => {
    const name = connectorName.toLowerCase();
    if (name.includes('metamask')) return '/MetaMaskLOGO.png';
    if (name.includes('walletconnect')) return '/WALLETCONNECTlogo.png';
    if (name.includes('brave')) return '/bravewalletlogo.png';
    if (name.includes('coinbase')) return '/coinbasewalletlogo.svg';
    if (name.includes('phantom')) return '/phantomwalletlogo.jpg';
    if (name.includes('trust')) return '/trustwalletllogo.webp';
    if (name.includes('leap')) return '/leapwalletlogo.webp';
    return null;
  };

  // Removed auto-redirect - allow users to visit home page even when connected

  useEffect(() => {
    setMounted(true);

    // Initialize blocks that span across the screen width
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const blockCount = Math.ceil(screenWidth / 80) + 2; // Ensure full coverage

    const initialBlocks = Array.from({ length: blockCount }, (_, i) => ({
      id: i,
      x: i * 80,
      y: Math.random() * 500,
      height: Math.random() * 150 + 50,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setBlocks(initialBlocks);

    // Initialize particles
    const initialParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * screenWidth,
      y: Math.random() * 500,
      opacity: Math.random(),
      yTarget: Math.random() * 500,
      opacityTarget: Math.random(),
      duration: Math.random() * 3 + 2,
    }));
    setParticles(initialParticles);

    // Animate blocks moving up and down
    const interval = setInterval(() => {
      setBlocks((prev) =>
        prev.map((block) => {
          const newY = block.y + (Math.random() - 0.5) * 3;
          return {
            ...block,
            y: Math.max(0, Math.min(500, newY)), // Keep within bounds
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="relative w-full h-[500px] overflow-hidden bg-gradient-to-b from-[#0A0A0A] via-[#2D3436] to-[#0A0A0A]">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(255, 215, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-gradient-gold text-center">
            BTCindexer
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 text-center max-w-3xl">
            Professional Bitcoin blockchain API with wallet authentication
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gradient-to-b from-[#0A0A0A] via-[#2D3436] to-[#0A0A0A]">
      {/* 3D Grid pattern background with gold accent */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255, 215, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        transform: 'perspective(500px) rotateX(60deg)',
        transformOrigin: 'center top'
      }}></div>

      {/* Particle effects with gold glow */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(255, 107, 53, 0.4) 100%)',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)'
            }}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: particle.opacity,
            }}
            animate={{
              y: [null, particle.yTarget],
              opacity: [null, particle.opacityTarget],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-center"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FF6B35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))',
            fontFamily: 'Poppins, Inter, sans-serif',
            letterSpacing: '-0.02em'
          }}
        >
          BTCindexer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-center max-w-3xl mb-4"
          style={{
            color: '#E0E0E0',
            letterSpacing: '0.03em',
            lineHeight: '1.6'
          }}
        >
          Professional Bitcoin blockchain API with wallet authentication
        </motion.p>

        {/* Feature Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm"
        >
          <div className="px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30">
            <span className="text-[#FFD700] font-semibold">✨ No API Keys</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-[#4CAF50]/10 border border-[#4CAF50]/30">
            <span className="text-[#4CAF50] font-semibold">🎯 100 Free Requests/Day</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/30">
            <span className="text-[#FF6B35] font-semibold">👑 $50 Unlimited Forever</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => setShowWalletModal(true)}
            className="px-8 py-4 rounded-2xl font-semibold text-lg gradient-gold-orange glow-gold hover:scale-105 transition-all duration-300 text-white"
          >
            Connect Wallet & Start
          </button>
          <Link href="/api">
            <button className="px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#0A0A0A] hover:glow-gold transition-all duration-300">
              View API Docs
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Glow effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            onClick={() => setShowWalletModal(false)}
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
              onClick={() => setShowWalletModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
            >
              <span className="text-xl text-foreground/70">✕</span>
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gradient-gold mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-sm text-foreground/70">
                Choose your preferred wallet to get started
              </p>
            </div>

            {/* Wallet Type Tabs */}
            <div className="flex gap-2 mb-4 p-1 rounded-lg bg-[#0A0A0A] border border-[#FFD700]/20">
              <button onClick={() => setWalletType('evm')} className={`flex-1 py-2 px-3 rounded-lg transition-all font-semibold text-sm ${walletType === 'evm' ? 'bg-[#FFD700] text-[#0A0A0A]' : 'text-foreground/70'}`}>
                <span className="flex items-center justify-center gap-2"><Wallet className="w-4 h-4" />EVM</span>
              </button>
              <button onClick={() => setWalletType('bitcoin')} className={`flex-1 py-2 px-3 rounded-lg transition-all font-semibold text-sm ${walletType === 'bitcoin' ? 'bg-[#FFD700] text-[#0A0A0A]' : 'text-foreground/70'}`}>
                <span className="flex items-center justify-center gap-2"><Bitcoin className="w-4 h-4" />Bitcoin</span>
              </button>
            </div>

            {/* EVM Wallet Options */}
            {walletType === 'evm' && (
            <div className="space-y-3 mb-6">
              {connectors
                .filter(connector => {
                  const name = connector.name.toLowerCase();
                  return !name.includes('social') && !name.includes('email') &&
                         !name.includes('auth') && !name.includes('magic') &&
                         !name.includes('injected');
                })
                .map((connector) => {
                  const logo = getWalletLogo(connector.name);
                  return (
                    <button
                      key={connector.id}
                      onClick={() => {
                        // For WalletConnect, use Web3Modal to show QR code
                        if (connector.name.toLowerCase().includes('walletconnect')) {
                          setShowWalletModal(false);
                          open();
                        } else {
                          // For other wallets, connect directly
                          connect({ connector });
                          setShowWalletModal(false);
                        }
                      }}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0A0A0A] border border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:border-[#FFD700] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        {/* Wallet Icon */}
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5">
                          {logo ? (
                            <Image
                              src={logo}
                              alt={connector.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Wallet className="w-5 h-5 text-[#FFD700]" />
                          )}
                        </div>
                        <span className="font-semibold text-foreground">
                          {connector.name}
                        </span>
                      </div>
                      <div className="text-[#FFD700] group-hover:translate-x-1 transition-transform">
                        →
                      </div>
                    </button>
                  );
                })}
            </div>
            )}

            {/* Bitcoin Wallet Options */}
            {walletType === 'bitcoin' && (
            <div className="space-y-3 mb-6">
              <button onClick={() => handleBitcoinWalletConnect('Xverse')} className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0A0A0A] border border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:border-[#FFD700] transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center"><Bitcoin className="w-5 h-5 text-white" /></div>
                  <div className="text-left"><span className="font-semibold text-foreground block">Xverse</span><span className="text-xs text-foreground/50">Bitcoin & Ordinals</span></div>
                </div>
                <div className="text-[#FFD700] group-hover:translate-x-1 transition-transform">→</div>
              </button>
              <button onClick={() => handleBitcoinWalletConnect('Leather')} className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0A0A0A] border border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:border-[#FFD700] transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B4513] to-[#CD853F] flex items-center justify-center"><Bitcoin className="w-5 h-5 text-white" /></div>
                  <div className="text-left"><span className="font-semibold text-foreground block">Leather</span><span className="text-xs text-foreground/50">Bitcoin & Stacks</span></div>
                </div>
                <div className="text-[#FFD700] group-hover:translate-x-1 transition-transform">→</div>
              </button>
              <button onClick={() => handleBitcoinWalletConnect('Unisat')} className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0A0A0A] border border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:border-[#FFD700] transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF8C00] to-[#FFD700] flex items-center justify-center"><Bitcoin className="w-5 h-5 text-white" /></div>
                  <div className="text-left"><span className="font-semibold text-foreground block">Unisat</span><span className="text-xs text-foreground/50">Bitcoin & BRC-20</span></div>
                </div>
                <div className="text-[#FFD700] group-hover:translate-x-1 transition-transform">→</div>
              </button>
              <div className="mt-4 p-3 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20">
                <p className="text-xs text-foreground/70 text-center">Don't have a Bitcoin wallet? <a href="https://www.xverse.app/" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:text-[#FF6B35] font-semibold">Install Xverse</a></p>
              </div>
            </div>
            )}

            {/* Info */}
            <div className="p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20">
              <h3 className="text-sm font-bold text-[#FFD700] mb-2">What You'll Get:</h3>
              <ul className="text-xs text-foreground/70 space-y-1">
                <li>✓ 100 free API requests per day</li>
                <li>✓ Access to your personal dashboard</li>
                <li>✓ Real-time usage statistics</li>
                <li>✓ Upgrade to unlimited anytime for $50</li>
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

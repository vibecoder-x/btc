'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { MultiChainWalletButton } from './MultiChainWalletButton';
import GlobalSearch from './GlobalSearch';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  const getNavItems = () => {
    const baseItems = [
      { name: 'Home', href: '/' },
      { name: 'Blocks', href: '/blocks' },
      { name: 'Mempool', href: '/mempool' },
      { name: 'Halving', href: '/halving' },
      { name: 'Mining', href: '/mining' },
      { name: 'Stats', href: '/stats' },
      { name: 'API', href: '/api' },
      { name: 'Docs', href: '/docs' },
      { name: 'About', href: '/about' },
      { name: 'Status', href: '/status' },
    ];

    // Add Dashboard link if wallet is connected
    if (isConnected) {
      return [
        ...baseItems.slice(0, 1), // Home
        { name: 'Dashboard', href: '/dashboard' },
        ...baseItems.slice(1), // Rest of items
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-50 glassmorphism border-b border-neon-blue/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logobtc.png"
              alt="BTC Indexer Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-gradient-gold">
              btcindexer.com
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-neon-blue transition-colors duration-300 relative group font-semibold"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-blue to-neon-orange group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}

            {/* Global Search */}
            <GlobalSearch />

            {/* Wallet Connection */}
            <MultiChainWalletButton size="md" showChain={true} />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg glassmorphism"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-neon-blue" />
            ) : (
              <Menu className="w-6 h-6 text-neon-blue" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-4"
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-foreground hover:text-neon-blue transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Wallet Connection */}
              <div className="pt-4 border-t border-foreground/10">
                <MultiChainWalletButton size="md" showChain={true} className="w-full justify-center" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

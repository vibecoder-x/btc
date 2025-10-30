'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Wallet, LogOut, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { WalletService, WalletAccount } from '@/lib/wallet/wallet-service';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletAccount, setWalletAccount] = useState<WalletAccount | null>(null);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check for saved wallet connection
    const savedAccount = WalletService.getSavedAccount();
    if (savedAccount) {
      setWalletAccount(savedAccount);
    }

    // Listen for storage events (wallet connection in other tabs)
    const handleStorageChange = () => {
      const account = WalletService.getSavedAccount();
      setWalletAccount(account);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDisconnect = () => {
    WalletService.disconnect();
    setWalletAccount(null);
    setShowWalletMenu(false);
  };

  const copyAddress = () => {
    if (walletAccount) {
      navigator.clipboard.writeText(walletAccount.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getNavItems = () => {
    const baseItems = [
      { name: 'Home', href: '/' },
      { name: 'Blocks', href: '/blocks' },
      { name: 'Stats', href: '/stats' },
      { name: 'API', href: '/api' },
      { name: 'Docs', href: '/docs' },
    ];

    // Add Dashboard link if wallet is connected
    if (walletAccount) {
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
            <span className="text-xl font-bold text-neon-blue">
              btcindexer<span className="text-neon-orange">.com</span>
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

            {/* Wallet Status */}
            {walletAccount ? (
              <div className="relative">
                <button
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-orange hover:glow-blue transition-all duration-300 font-semibold text-white"
                >
                  <Wallet className="w-4 h-4" />
                  {WalletService.formatAddress(walletAccount.address)}
                </button>

                {/* Wallet Dropdown */}
                <AnimatePresence>
                  {showWalletMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 glassmorphism rounded-xl border border-neon-blue/30 p-4 shadow-2xl"
                    >
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-foreground/50 mb-1">Connected Wallet</p>
                          <p className="text-sm font-mono text-foreground break-all">
                            {walletAccount.address}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-foreground/10">
                          <button
                            onClick={copyAddress}
                            className="flex-1 px-3 py-2 rounded-lg bg-neon-blue/10 hover:bg-neon-blue/20 transition-colors text-sm font-semibold text-neon-blue flex items-center justify-center gap-2"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>
                          <button
                            onClick={handleDisconnect}
                            className="flex-1 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-sm font-semibold text-red-400 flex items-center justify-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Disconnect
                          </button>
                        </div>

                        <div className="pt-2 border-t border-foreground/10">
                          <p className="text-xs text-foreground/50 mb-2">Wallet Type</p>
                          <span className="inline-block px-2 py-1 rounded bg-neon-orange/20 text-neon-orange text-xs font-semibold capitalize">
                            {walletAccount.walletType}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-foreground/80 hover:text-neon-blue transition-colors duration-300 font-semibold"
                >
                  Connect Wallet
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-orange hover:glow-blue transition-all duration-300 font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
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

              {/* Mobile Wallet Status */}
              {walletAccount ? (
                <div className="pt-4 border-t border-foreground/10 space-y-3">
                  <div className="p-3 rounded-lg bg-neon-blue/10 border border-neon-blue/30">
                    <p className="text-xs text-foreground/50 mb-1">Connected</p>
                    <p className="text-sm font-mono text-foreground break-all">
                      {walletAccount.address}
                    </p>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="w-full py-2 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all text-red-400 font-semibold flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block py-2 text-foreground hover:text-neon-blue transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connect Wallet
                  </Link>
                  <Link
                    href="/signup"
                    className="block py-2 px-4 rounded-lg bg-gradient-to-r from-neon-blue to-neon-orange hover:glow-blue transition-all text-white font-semibold text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

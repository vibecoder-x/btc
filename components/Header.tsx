'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search as SearchIcon, TrendingUp, Code, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { CustomWalletButton } from './CustomWalletButton';
import GlobalSearch from './GlobalSearch';

interface NavItem {
  name: string;
  href: string;
}

interface NavCategory {
  name: string;
  items: NavItem[];
  icon?: React.ReactNode;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  // Organized navigation categories
  const navCategories: NavCategory[] = [
    {
      name: 'Explorer',
      icon: <SearchIcon className="w-4 h-4" />,
      items: [
        { name: 'Home', href: '/' },
        { name: 'Blocks', href: '/blocks' },
        { name: 'Mempool', href: '/mempool' },
      ],
    },
    {
      name: 'Analytics',
      icon: <TrendingUp className="w-4 h-4" />,
      items: [
        { name: 'Stats', href: '/stats' },
        { name: 'Mining', href: '/mining' },
        { name: 'Halving', href: '/halving' },
      ],
    },
    {
      name: 'Developers',
      icon: <Code className="w-4 h-4" />,
      items: [
        { name: 'API Docs', href: '/api' },
        { name: 'Playground', href: '/playground' },
        { name: 'Comparison', href: '/comparison' },
        { name: 'Documentation', href: '/docs' },
      ],
    },
    {
      name: 'More',
      icon: <Info className="w-4 h-4" />,
      items: [
        { name: 'About', href: '/about' },
        { name: 'History', href: '/history' },
        { name: 'Status', href: '/status' },
        ...(isConnected ? [{ name: 'Dashboard', href: '/dashboard' }] : []),
      ],
    },
  ];

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
          <div className="hidden lg:flex items-center space-x-6">
            {navCategories.map((category) => (
              <div
                key={category.name}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(category.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1.5 text-foreground/80 hover:text-[#FFD700] transition-colors duration-300 font-semibold py-2">
                  {category.icon}
                  {category.name}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {openDropdown === category.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-[#0F0F0F] border-2 border-[#FFD700]/30 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      {category.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-4 py-3 text-foreground/80 hover:bg-[#FFD700]/10 hover:text-[#FFD700] transition-all duration-200 border-b border-[#FFD700]/10 last:border-0"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Global Search */}
            <GlobalSearch />

            {/* Wallet Connection */}
            <CustomWalletButton size="md" showChain={true} />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg glassmorphism"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#FFD700]" />
            ) : (
              <Menu className="w-6 h-6 text-[#FFD700]" />
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
              className="lg:hidden mt-4 space-y-2"
            >
              {/* Mobile Search */}
              <div className="mb-4">
                <GlobalSearch />
              </div>

              {/* Mobile Categories */}
              {navCategories.map((category) => (
                <div key={category.name} className="border-b border-[#FFD700]/10 pb-2">
                  <button
                    onClick={() => setOpenMobileSection(openMobileSection === category.name ? null : category.name)}
                    className="w-full flex items-center justify-between py-2 text-foreground/80 hover:text-[#FFD700] transition-colors font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      {category.icon}
                      {category.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openMobileSection === category.name ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {openMobileSection === category.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-6 space-y-2 mt-2"
                      >
                        {category.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block py-2 text-foreground/70 hover:text-[#FFD700] transition-colors"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setOpenMobileSection(null);
                            }}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Mobile Wallet Connection */}
              <div className="pt-4 border-t border-[#FFD700]/10">
                <CustomWalletButton size="md" showChain={true} className="w-full justify-center" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Info } from 'lucide-react';
import RealtimeBitcoinPrice from '@/components/RealtimeBitcoinPrice';

export default function PricePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-foreground/70 mb-6">
        <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Live Price</span>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-20 h-20 rounded-2xl gradient-gold-orange flex items-center justify-center glow-gold">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gradient-gold">Live Bitcoin Price</h1>
        </div>
        <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
          Real-time Bitcoin price tracking powered by CoinGecko API with auto-refresh every 30 seconds
        </p>
      </motion.div>

      {/* Price Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto mb-12"
      >
        <RealtimeBitcoinPrice />
      </motion.div>

      {/* Features Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-3d p-8 max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gradient-gold mb-6 flex items-center gap-3">
          <Info className="w-8 h-8" />
          Features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 glassmorphism rounded-xl">
            <h3 className="text-xl font-bold text-[#FFD700] mb-3">Real-time Updates</h3>
            <p className="text-foreground/70">
              Automatically refreshes every 30 seconds to keep you up-to-date with the latest Bitcoin price from CoinGecko.
            </p>
          </div>
          <div className="p-6 glassmorphism rounded-xl">
            <h3 className="text-xl font-bold text-[#FFD700] mb-3">Price Direction Indicator</h3>
            <p className="text-foreground/70">
              Visual indicators show price movement - green for increases, red for decreases with smooth animations.
            </p>
          </div>
          <div className="p-6 glassmorphism rounded-xl">
            <h3 className="text-xl font-bold text-[#FFD700] mb-3">24h Change Tracking</h3>
            <p className="text-foreground/70">
              See the percentage change over the last 24 hours with color-coded indicators for quick analysis.
            </p>
          </div>
          <div className="p-6 glassmorphism rounded-xl">
            <h3 className="text-xl font-bold text-[#FFD700] mb-3">Market Stats</h3>
            <p className="text-foreground/70">
              View 24-hour trading volume and market capitalization alongside the current price.
            </p>
          </div>
          <div className="p-6 glassmorphism rounded-xl">
            <h3 className="text-xl font-bold text-[#FFD700] mb-3">Error Handling</h3>
            <p className="text-foreground/70">
              Robust error handling with retry functionality ensures reliable data fetching.
            </p>
          </div>
          <div className="p-6 glassmorphism rounded-xl">
            <h3 className="text-xl font-bold text-[#FFD700] mb-3">Manual Refresh</h3>
            <p className="text-foreground/70">
              Click the refresh button anytime to get the latest price without waiting for auto-refresh.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

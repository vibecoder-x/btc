'use client';

import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { fetchWithCache } from '@/lib/api-cache';

interface BitcoinPrice {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

function BitcoinPriceChart() {
  const [currentPrice, setCurrentPrice] = useState<BitcoinPrice>({
    price: 0,
    change24h: 0,
    marketCap: 0,
    volume24h: 0,
  });
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchBitcoinPrice();

    // Update price every 30 seconds
    const interval = setInterval(() => {
      fetchBitcoinPrice();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchBitcoinPrice = useCallback(async () => {
    try {
      // Use cached API with 30 second TTL
      const data = await fetchWithCache<any>('/api/bitcoin-price', undefined, 30000);

      if (data.price) {
        setCurrentPrice({
          price: data.price,
          change24h: data.change24h || 0,
          marketCap: data.marketCap || 0,
          volume24h: data.volume24h || 0,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      setLoading(false);
    }
  }, []);

  const formatPrice = useCallback((price: number) => {
    return mounted ? price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) : `$${price}`;
  }, [mounted]);

  const formatLargeNumber = useCallback((num: number) => {
    if (!mounted) return num.toString();
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  }, [mounted]);

  // Memoize formatted values to prevent recalculations
  const formattedPrice = useMemo(() => formatPrice(currentPrice.price), [currentPrice.price, formatPrice]);
  const formattedMarketCap = useMemo(() => formatLargeNumber(currentPrice.marketCap), [currentPrice.marketCap, formatLargeNumber]);
  const formattedVolume = useMemo(() => formatLargeNumber(currentPrice.volume24h), [currentPrice.volume24h, formatLargeNumber]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glassmorphism rounded-2xl p-6 md:p-8"
      >
        <div className="flex items-center justify-center h-32">
          <div className="text-neon-blue text-xl">Loading Bitcoin price...</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-3d p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-gradient-gold mb-3 flex items-center">
            <DollarSign className="mr-2 w-7 h-7 text-[#FFD700]" />
            Bitcoin Price
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-4xl md:text-5xl font-bold text-[#FFD700]">
              {formattedPrice}
            </span>
            <div className={`flex items-center px-3 py-1 rounded-lg ${
              currentPrice.change24h >= 0
                ? 'bg-[#FFD700]/20 text-[#FFD700]'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {currentPrice.change24h >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span className="font-semibold">
                {currentPrice.change24h >= 0 ? '+' : ''}
                {currentPrice.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30">
          <div className="w-3 h-3 rounded-full bg-[#FFD700] animate-pulse glow-gold"></div>
          <span className="text-sm text-[#E0E0E0]">Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-3d p-6 bg-[#FFD700]/5 hover:bg-[#FFD700]/10 transition-all duration-300 hover:scale-105">
          <p className="text-sm text-[#E0E0E0] mb-2">Market Cap</p>
          <p className="text-2xl md:text-3xl font-bold text-[#FFD700] break-words">
            {formattedMarketCap}
          </p>
        </div>
        <div className="card-3d p-6 bg-[#FF6B35]/5 hover:bg-[#FF6B35]/10 transition-all duration-300 hover:scale-105">
          <p className="text-sm text-[#E0E0E0] mb-2">24h Volume</p>
          <p className="text-2xl md:text-3xl font-bold text-[#FF6B35] break-words">
            {formattedVolume}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(BitcoinPriceChart);

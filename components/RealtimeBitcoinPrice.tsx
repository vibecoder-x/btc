'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';

interface PriceData {
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
  usd_market_cap: number;
}

interface BitcoinPriceResponse {
  bitcoin: PriceData;
}

export default function RealtimeBitcoinPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceChange24h, setPriceChange24h] = useState<number>(0);
  const [volume24h, setVolume24h] = useState<number>(0);
  const [marketCap, setMarketCap] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral');

  const fetchBitcoinPrice = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true',
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: BitcoinPriceResponse = await response.json();
      const newPrice = data.bitcoin.usd;

      // Determine price direction
      if (price !== null) {
        if (newPrice > price) {
          setPriceDirection('up');
        } else if (newPrice < price) {
          setPriceDirection('down');
        } else {
          setPriceDirection('neutral');
        }
      }

      setPreviousPrice(price);
      setPrice(newPrice);
      setPriceChange24h(data.bitcoin.usd_24h_change);
      setVolume24h(data.bitcoin.usd_24h_vol);
      setMarketCap(data.bitcoin.usd_market_cap);
      setIsLoading(false);
      setIsRefreshing(false);

      // Reset direction indicator after animation
      setTimeout(() => {
        setPriceDirection('neutral');
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price');
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [price]);

  // Initial fetch and auto-refresh every 30 seconds
  useEffect(() => {
    fetchBitcoinPrice();
    const interval = setInterval(() => {
      setIsRefreshing(true);
      fetchBitcoinPrice();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchBitcoinPrice]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchBitcoinPrice();
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }
    return formatPrice(value);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFD700]/20 via-[#FF6B35]/20 to-[#FFD700]/20 p-8 border-2 border-[#FFD700]/30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-12 h-12 text-[#FFD700] animate-spin" />
            <p className="text-foreground/70 font-semibold">Loading Bitcoin price...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/20 via-red-600/20 to-red-500/20 p-8 border-2 border-red-500/30">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-red-400 font-semibold">Error: {error}</p>
            <button
              onClick={handleManualRefresh}
              className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPositiveChange = priceChange24h > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFD700]/20 via-[#FF6B35]/20 to-[#FFD700]/20 p-8 border-2 border-[#FFD700]/30 hover:border-[#FFD700]/50 transition-all duration-300"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 via-transparent to-[#FF6B35]/10 animate-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">₿</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Bitcoin Price</h3>
              <p className="text-sm text-foreground/60">Real-time from CoinGecko</p>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 transition-all disabled:opacity-50"
            title="Refresh price"
          >
            <RefreshCw className={`w-5 h-5 text-[#FFD700] ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Price Display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={price}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  color: priceDirection === 'up' ? '#4CAF50' : priceDirection === 'down' ? '#F44336' : '#FFD700'
                }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-5xl font-bold"
              >
                {price !== null ? formatPrice(price) : '$0.00'}
              </motion.div>
            </AnimatePresence>

            {/* Price Direction Indicator */}
            <AnimatePresence>
              {priceDirection !== 'neutral' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  {priceDirection === 'up' ? (
                    <TrendingUp className="w-8 h-8 text-[#4CAF50]" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-[#F44336]" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 24h Change */}
          <div className="flex items-center gap-2 mt-3">
            {isPositiveChange ? (
              <TrendingUp className="w-5 h-5 text-[#4CAF50]" />
            ) : (
              <TrendingDown className="w-5 h-5 text-[#F44336]" />
            )}
            <span
              className={`text-xl font-bold ${
                isPositiveChange ? 'text-[#4CAF50]' : 'text-[#F44336]'
              }`}
            >
              {isPositiveChange ? '+' : ''}{priceChange24h.toFixed(2)}%
            </span>
            <span className="text-foreground/50 text-sm ml-2">24h change</span>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#FFD700]/20">
          <div>
            <p className="text-xs text-foreground/50 mb-1 uppercase tracking-wider">24h Volume</p>
            <p className="text-lg font-bold text-foreground">{formatLargeNumber(volume24h)}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/50 mb-1 uppercase tracking-wider">Market Cap</p>
            <p className="text-lg font-bold text-foreground">{formatLargeNumber(marketCap)}</p>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-[#FFD700]/10">
          <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse"></div>
          <span className="text-xs text-foreground/50">Auto-refreshes every 30 seconds</span>
        </div>
      </div>
    </motion.div>
  );
}

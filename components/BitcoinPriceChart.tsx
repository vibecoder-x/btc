'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface BitcoinPrice {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

export default function BitcoinPriceChart() {
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

  const fetchBitcoinPrice = async () => {
    try {
      // Using CoinGecko API as a free alternative (CMC requires API key)
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true'
      );
      const data = await response.json();

      if (data.bitcoin) {
        const newPrice = {
          price: data.bitcoin.usd,
          change24h: data.bitcoin.usd_24h_change || 0,
          marketCap: data.bitcoin.usd_market_cap || 0,
          volume24h: data.bitcoin.usd_24h_vol || 0,
        };
        setCurrentPrice(newPrice);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return mounted ? price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) : `$${price}`;
  };

  const formatLargeNumber = (num: number) => {
    if (!mounted) return num.toString();
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

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
      className="glassmorphism rounded-2xl p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-neon-blue mb-3 flex items-center">
            <DollarSign className="mr-2 w-7 h-7" />
            Bitcoin Price
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-4xl md:text-5xl font-bold text-neon-green">
              {formatPrice(currentPrice.price)}
            </span>
            <div className={`flex items-center px-3 py-1 rounded-lg ${
              currentPrice.change24h >= 0
                ? 'bg-neon-green/20 text-neon-green'
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
        <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-neon-green/10">
          <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse"></div>
          <span className="text-sm text-foreground/70">Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glassmorphism rounded-lg p-6">
          <p className="text-sm text-foreground/70 mb-2">Market Cap</p>
          <p className="text-3xl font-bold text-neon-blue">
            {formatLargeNumber(currentPrice.marketCap)}
          </p>
        </div>
        <div className="glassmorphism rounded-lg p-6">
          <p className="text-sm text-foreground/70 mb-2">24h Volume</p>
          <p className="text-3xl font-bold text-neon-orange">
            {formatLargeNumber(currentPrice.volume24h)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

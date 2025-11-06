'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Clock, Hash, Pickaxe, ArrowRight, ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Block {
  height: number;
  hash: string;
  timestamp: number;
  tx_count: number;
  size: number;
  miner?: string;
  difficulty: number;
}

export default function LiveBlocksAnimation() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch blocks from API
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await fetch('/api/blocks');
        if (response.ok) {
          const data = await response.json();
          if (data.blocks && data.blocks.length > 0) {
            const formattedBlocks = data.blocks.slice(0, 10).map((block: any) => ({
              height: block.height,
              hash: block.id,
              timestamp: block.timestamp,
              tx_count: block.tx_count,
              size: block.size,
              difficulty: block.difficulty,
              miner: extractMiner(block),
            }));
            setBlocks(formattedBlocks);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blocks:', error);
        setLoading(false);
      }
    };

    fetchBlocks();

    // Poll for new blocks every 30 seconds
    const interval = setInterval(fetchBlocks, 30000);
    return () => clearInterval(interval);
  }, []);

  // Extract miner information from block
  const extractMiner = (block: any): string => {
    // Common mining pools
    const knownPools = [
      { name: 'Foundry USA', pattern: /foundry/i },
      { name: 'AntPool', pattern: /antpool/i },
      { name: 'F2Pool', pattern: /f2pool/i },
      { name: 'ViaBTC', pattern: /viabtc/i },
      { name: 'Binance Pool', pattern: /binance/i },
      { name: 'Poolin', pattern: /poolin/i },
      { name: 'Luxor', pattern: /luxor/i },
      { name: 'MARA Pool', pattern: /mara/i },
    ];

    // Try to extract from coinbase or other fields
    const blockStr = JSON.stringify(block).toLowerCase();
    for (const pool of knownPools) {
      if (pool.pattern.test(blockStr)) {
        return pool.name;
      }
    }

    return 'Unknown Pool';
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;

    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Truncate hash
  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  // Handle horizontal scroll
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft +
        (direction === 'right' ? scrollAmount : -scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Update scroll button visibility
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [blocks]);

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-gold-orange flex items-center justify-center glow-gold">
            <Box className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gradient-gold">Live Blocks</h2>
            <p className="text-sm text-foreground/60">Recently mined blocks on the Bitcoin network</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#4CAF50] rounded-full animate-pulse"></div>
          <span className="text-sm text-[#4CAF50] font-semibold">LIVE</span>
        </div>
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#FFD700] hover:bg-[#FF6B35] transition-all duration-300 flex items-center justify-center shadow-lg glow-gold"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Blocks Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <AnimatePresence initial={false}>
            {blocks.map((block, index) => (
              <motion.div
                key={block.height}
                initial={{ opacity: 0, x: -100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 100
                }}
                className="flex-shrink-0"
              >
                <Link href={`/blocks/${block.height}`}>
                  <div className="card-3d w-80 p-6 hover:scale-105 transition-transform duration-300 cursor-pointer group border-2 border-[#FFD700]/20 hover:border-[#FFD700]/60">
                    {/* Block Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center">
                          <Box className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-foreground/50">Block</p>
                          <p className="text-lg font-bold text-[#FFD700]">#{block.height.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-foreground/60">
                        <Clock className="w-3 h-3" />
                        {formatTime(block.timestamp)}
                      </div>
                    </div>

                    {/* Block Hash */}
                    <div className="mb-4 p-3 rounded-lg bg-foreground/5 border border-[#FFD700]/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-3 h-3 text-[#FFD700]" />
                        <p className="text-xs text-foreground/50">Block Hash</p>
                      </div>
                      <code className="text-xs text-foreground/80 font-mono break-all">
                        {truncateHash(block.hash)}
                      </code>
                    </div>

                    {/* Miner Info */}
                    <div className="mb-4 flex items-center gap-2">
                      <Pickaxe className="w-4 h-4 text-[#FF6B35]" />
                      <div>
                        <p className="text-xs text-foreground/50">Mined by</p>
                        <p className="text-sm font-semibold text-foreground">{block.miner}</p>
                      </div>
                    </div>

                    {/* Block Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 rounded-lg bg-foreground/5">
                        <p className="text-xs text-foreground/50 mb-1">Transactions</p>
                        <p className="text-sm font-bold text-[#4CAF50]">{block.tx_count.toLocaleString()}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-foreground/5">
                        <p className="text-xs text-foreground/50 mb-1">Size</p>
                        <p className="text-sm font-bold text-[#4CAF50]">
                          {(block.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    {/* View Details Link */}
                    <div className="mt-4 pt-4 border-t border-[#FFD700]/10">
                      <div className="flex items-center justify-between text-[#FFD700] group-hover:text-[#FF6B35] transition-colors">
                        <span className="text-sm font-semibold">View Details</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#FFD700] hover:bg-[#FF6B35] transition-all duration-300 flex items-center justify-center shadow-lg glow-gold"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* View All Blocks Link */}
      <div className="text-center mt-6">
        <Link
          href="/blocks"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 border border-[#FFD700]/30 hover:border-[#FFD700] transition-all text-[#FFD700] font-semibold"
        >
          <TrendingUp className="w-4 h-4" />
          View All Blocks
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

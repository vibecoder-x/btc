'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Box, Clock, Database, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Block {
  height: number;
  size: string;
  txCount: number;
  miner: string;
  time: string;
  isNew?: boolean;
}

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tipHeight, setTipHeight] = useState(0);
  const blocksPerPage = 10;

  // Fetch blocks from API
  const fetchBlocks = async (startHeight?: number) => {
    try {
      const url = startHeight
        ? `/api/blocks?startHeight=${startHeight}`
        : '/api/blocks';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch blocks');
      }

      const data = await response.json();

      // Transform blocks data
      const transformedBlocks = data.blocks.map((block: any) => {
        const now = Date.now();
        const blockTime = block.timestamp * 1000;
        const diffMinutes = Math.floor((now - blockTime) / 60000);

        let timeStr;
        if (diffMinutes < 60) {
          timeStr = `${diffMinutes} min ago`;
        } else if (diffMinutes < 1440) {
          const hours = Math.floor(diffMinutes / 60);
          timeStr = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
          const days = Math.floor(diffMinutes / 1440);
          timeStr = `${days} day${days > 1 ? 's' : ''} ago`;
        }

        return {
          height: block.height,
          size: `${(block.size / 1024 / 1024).toFixed(2)} MB`,
          txCount: block.tx_count,
          miner: 'Unknown', // Blockstream API doesn't provide miner info
          time: timeStr,
        };
      });

      return {
        blocks: transformedBlocks,
        tipHeight: data.tipHeight,
      };
    } catch (error) {
      console.error('Error fetching blocks:', error);
      return null;
    }
  };

  useEffect(() => {
    setMounted(true);
    // Initial fetch
    const loadInitialBlocks = async () => {
      setLoading(true);
      const data = await fetchBlocks();
      if (data) {
        setBlocks(data.blocks);
        setTipHeight(data.tipHeight);
      }
      setLoading(false);
    };

    loadInitialBlocks();

    // Refresh blocks every 60 seconds
    const interval = setInterval(async () => {
      const data = await fetchBlocks();
      if (data) {
        setBlocks(prevBlocks => {
          // Check if there are new blocks
          const latestHeight = prevBlocks.length > 0 ? prevBlocks[0].height : 0;
          const newBlocks = data.blocks.filter((b: Block) => b.height > latestHeight);

          if (newBlocks.length > 0) {
            // Mark new blocks with isNew flag
            const markedNewBlocks = newBlocks.map((b: Block) => ({ ...b, isNew: true }));

            // Remove isNew flag after animation
            setTimeout(() => {
              setBlocks(prev => prev.map(b => ({ ...b, isNew: false })));
            }, 500);

            return [...markedNewBlocks, ...prevBlocks];
          }
          return prevBlocks;
        });
        setTipHeight(data.tipHeight);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []); // Remove page dependency

  const loadMore = async () => {
    if (blocks.length === 0 || loading) return;

    setLoading(true);
    const currentLowest = blocks[blocks.length - 1].height;

    // Fetch more blocks starting from the lowest block height - 1
    const data = await fetchBlocks(currentLowest - 1);

    if (data) {
      setBlocks([...blocks, ...data.blocks]);
      setPage(page + 1);
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-[#FFD700] hover:text-[#FF6B35] transition-colors duration-300 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gradient-gold mb-8 flex items-center">
          <Box className="mr-3 w-10 h-10 text-[#FFD700]" />
          All Blocks
        </h1>

        <div className="card-3d rounded-2xl p-6 md:p-8">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#FFD700]/20">
                  <th className="text-left py-4 px-4 text-foreground/70 font-semibold">Height</th>
                  <th className="text-left py-4 px-4 text-foreground/70 font-semibold">Size</th>
                  <th className="text-left py-4 px-4 text-foreground/70 font-semibold">Transactions</th>
                  <th className="text-left py-4 px-4 text-foreground/70 font-semibold">Miner</th>
                  <th className="text-left py-4 px-4 text-foreground/70 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {blocks.map((block) => (
                    <motion.tr
                      key={block.height}
                      initial={block.isNew ? { backgroundColor: 'rgba(255, 215, 0, 0.2)' } : false}
                      animate={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
                      transition={{ duration: 0.5 }}
                      className="border-b border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <Link
                          href={`/blocks/${block.height}`}
                          className="text-[#FFD700] hover:text-[#FF6B35] transition-colors duration-300 font-mono font-semibold"
                        >
                          {mounted ? block.height.toLocaleString() : block.height}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-foreground/70">{block.size}</td>
                      <td className="py-4 px-4 text-foreground/70">
                        {mounted ? block.txCount.toLocaleString() : block.txCount}
                      </td>
                      <td className="py-4 px-4 text-foreground/70">{block.miner}</td>
                      <td className="py-4 px-4 text-foreground/70 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {block.time}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            <AnimatePresence initial={false}>
              {blocks.map((block) => (
                <motion.div
                  key={block.height}
                  initial={block.isNew ? { scale: 0.95, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  className="card-3d rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/blocks/${block.height}`}
                      className="text-xl font-mono font-bold text-[#FFD700]"
                    >
                      {mounted ? block.height.toLocaleString() : block.height}
                    </Link>
                    <span className="text-sm text-foreground/70">{block.time}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <Database className="w-4 h-4 mr-2 text-[#FF6B35]" />
                      <span className="text-foreground/70">{block.size}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-[#FFD700]" />
                      <span className="text-foreground/70">
                        {mounted ? block.txCount.toLocaleString() : block.txCount} txs
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-foreground/70">
                    <span className="text-[#FFD700]">Miner:</span> {block.miner}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              className="px-8 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-semibold text-[#0A0A0A] text-lg shadow-lg hover:shadow-[#FFD700]/50"
            >
              Load More Blocks
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

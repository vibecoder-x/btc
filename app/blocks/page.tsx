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
  const blocksPerPage = 20;
  const startHeight = 820450;

  useEffect(() => {
    setMounted(true);
    // Initialize blocks
    const initialBlocks = Array.from({ length: blocksPerPage }, (_, i) => ({
      height: startHeight - i,
      size: `${(Math.random() * 0.5 + 0.8).toFixed(1)} MB`,
      txCount: Math.floor(Math.random() * 1000 + 1500),
      miner: ['Foundry USA', 'AntPool', 'F2Pool', 'ViaBTC', 'Binance Pool'][
        Math.floor(Math.random() * 5)
      ],
      time: `${Math.floor(i * 10 + Math.random() * 5)} min ago`,
    }));
    setBlocks(initialBlocks);

    // Simulate new blocks arriving
    const interval = setInterval(() => {
      setBlocks((prev) => {
        const newBlock: Block = {
          height: prev[0].height + 1,
          size: `${(Math.random() * 0.5 + 0.8).toFixed(1)} MB`,
          txCount: Math.floor(Math.random() * 1000 + 1500),
          miner: ['Foundry USA', 'AntPool', 'F2Pool', 'ViaBTC', 'Binance Pool'][
            Math.floor(Math.random() * 5)
          ],
          time: 'Just now',
          isNew: true,
        };
        return [newBlock, ...prev.slice(0, blocksPerPage * page - 1)];
      });

      // Remove isNew flag after animation
      setTimeout(() => {
        setBlocks((prev) => prev.map((b) => ({ ...b, isNew: false })));
      }, 500);
    }, 15000);

    return () => clearInterval(interval);
  }, [page]);

  const loadMore = () => {
    if (blocks.length === 0) return;

    const currentLowest = blocks[blocks.length - 1].height;
    const currentOldestTime = blocks.length * 10; // Base time in minutes for the oldest block

    const newBlocks = Array.from({ length: blocksPerPage }, (_, i) => {
      const blockIndex = blocks.length + i;
      const minutesAgo = currentOldestTime + (i + 1) * 10 + Math.floor(Math.random() * 5);

      // Format time properly
      let timeStr;
      if (minutesAgo < 60) {
        timeStr = `${minutesAgo} min ago`;
      } else if (minutesAgo < 1440) {
        const hours = Math.floor(minutesAgo / 60);
        timeStr = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(minutesAgo / 1440);
        timeStr = `${days} day${days > 1 ? 's' : ''} ago`;
      }

      return {
        height: currentLowest - i - 1,
        size: `${(Math.random() * 0.5 + 0.8).toFixed(1)} MB`,
        txCount: Math.floor(Math.random() * 1000 + 1500),
        miner: ['Foundry USA', 'AntPool', 'F2Pool', 'ViaBTC', 'Binance Pool'][
          Math.floor(Math.random() * 5)
        ],
        time: timeStr,
      };
    });

    console.log('Loading more blocks, current lowest:', currentLowest, 'new blocks:', newBlocks.length);
    setBlocks([...blocks, ...newBlocks]);
    setPage(page + 1);
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

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
    const newBlocks = Array.from({ length: blocksPerPage }, (_, i) => ({
      height: currentLowest - i - 1,
      size: `${(Math.random() * 0.5 + 0.8).toFixed(1)} MB`,
      txCount: Math.floor(Math.random() * 1000 + 1500),
      miner: ['Foundry USA', 'AntPool', 'F2Pool', 'ViaBTC', 'Binance Pool'][
        Math.floor(Math.random() * 5)
      ],
      time: `${Math.floor((blocks.length + i) * 10 + Math.random() * 5)} min ago`,
    }));

    console.log('Loading more blocks, current lowest:', currentLowest, 'new blocks:', newBlocks.length);
    setBlocks([...blocks, ...newBlocks]);
    setPage(page + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-neon-blue hover:text-neon-orange transition-colors duration-300 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-neon-blue mb-8 flex items-center">
          <Box className="mr-3 w-10 h-10" />
          All Blocks
        </h1>

        <div className="glassmorphism rounded-2xl p-6 md:p-8">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neon-blue/20">
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
                      initial={block.isNew ? { backgroundColor: 'rgba(0, 255, 255, 0.2)' } : false}
                      animate={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
                      transition={{ duration: 0.5 }}
                      className="border-b border-neon-blue/10 hover:bg-neon-blue/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <Link
                          href={`/blocks/${block.height}`}
                          className="text-neon-blue hover:text-neon-orange transition-colors duration-300 font-mono font-semibold"
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
                  className="glassmorphism rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/blocks/${block.height}`}
                      className="text-xl font-mono font-bold text-neon-blue"
                    >
                      {mounted ? block.height.toLocaleString() : block.height}
                    </Link>
                    <span className="text-sm text-foreground/70">{block.time}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <Database className="w-4 h-4 mr-2 text-neon-orange" />
                      <span className="text-foreground/70">{block.size}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-neon-green" />
                      <span className="text-foreground/70">
                        {mounted ? block.txCount.toLocaleString() : block.txCount} txs
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-foreground/70">
                    <span className="text-neon-blue">Miner:</span> {block.miner}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-orange hover:glow-blue transition-all duration-300 font-semibold text-space-black text-lg shadow-lg hover:shadow-neon-blue/50"
            >
              Load More Blocks
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

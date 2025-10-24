'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Box, Clock, Database, Users } from 'lucide-react';

interface Block {
  height: number;
  size: string;
  txCount: number;
  miner: string;
  time: string;
  isNew?: boolean;
}

export default function BlocksTable() {
  const [mounted, setMounted] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([
    { height: 820450, size: '1.2 MB', txCount: 2345, miner: 'Foundry USA', time: '2 min ago' },
    { height: 820449, size: '1.1 MB', txCount: 2156, miner: 'AntPool', time: '12 min ago' },
    { height: 820448, size: '1.3 MB', txCount: 2567, miner: 'F2Pool', time: '23 min ago' },
    { height: 820447, size: '0.9 MB', txCount: 1876, miner: 'ViaBTC', time: '35 min ago' },
    { height: 820446, size: '1.2 MB', txCount: 2234, miner: 'Binance Pool', time: '47 min ago' },
  ]);

  useEffect(() => {
    setMounted(true);

    // Simulate new blocks
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
        return [newBlock, ...prev.slice(0, 9)];
      });

      // Remove isNew flag after animation
      setTimeout(() => {
        setBlocks((prev) => prev.map((b) => ({ ...b, isNew: false })));
      }, 500);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Format number consistently for server and client
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="card-3d p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gradient-gold flex items-center">
          <Box className="mr-3 w-8 h-8 text-[#FFD700]" />
          Recent Blocks
        </h2>
        <Link
          href="/blocks"
          className="text-[#FF6B35] hover:text-[#FFD700] transition-colors duration-300 font-semibold"
        >
          View All →
        </Link>
      </div>

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
                      className="text-[#FFD700] hover:text-[#FF6B35] transition-colors duration-300 font-mono font-semibold"
                    >
                      {mounted ? formatNumber(block.height) : block.height}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-foreground/70">{block.size}</td>
                  <td className="py-4 px-4 text-foreground/70">{mounted ? formatNumber(block.txCount) : block.txCount}</td>
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
                  {mounted ? formatNumber(block.height) : block.height}
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
                  <span className="text-foreground/70">{mounted ? formatNumber(block.txCount) : block.txCount} txs</span>
                </div>
              </div>
              <div className="text-sm text-foreground/70">
                <span className="text-neon-blue">Miner:</span> {block.miner}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

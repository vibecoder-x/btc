'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Box, Clock, Database, Hash, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function BlockDetailPage() {
  const params = useParams();
  const height = params.height as string;

  // Simulated block data
  const blockData = {
    height: parseInt(height),
    hash: '00000000000000000003a1f7c62e2ef5a1bce35d2e7f5a3c1b8e9d3a2c5f8b1a',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    size: 1234567,
    weight: 3987654,
    version: 536870912,
    merkleRoot: '8a7b9c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
    nonce: 2573456789,
    bits: '170d21b9',
    difficulty: '58.47 T',
    txCount: 2456,
    totalFees: 0.12345678,
    reward: 6.25,
    miner: 'Foundry USA',
  };

  // Generate random transaction IDs
  const generateTxId = () => {
    const chars = '0123456789abcdef';
    let txid = '';
    for (let i = 0; i < 64; i++) {
      txid += chars[Math.floor(Math.random() * chars.length)];
    }
    return txid;
  };

  const [transactions, setTransactions] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      txid: generateTxId(),
      fee: (Math.random() * 0.001).toFixed(8),
      size: Math.floor(Math.random() * 1000 + 200),
    }))
  );
  const [showingAll, setShowingAll] = useState(false);

  const loadMoreTransactions = () => {
    const newTxs = Array.from({ length: 10 }, (_, i) => ({
      txid: generateTxId(),
      fee: (Math.random() * 0.001).toFixed(8),
      size: Math.floor(Math.random() * 1000 + 200),
    }));
    setTransactions([...transactions, ...newTxs]);
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
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-blue to-neon-orange flex items-center justify-center glow-blue mr-4">
            <Box className="w-8 h-8 text-space-black" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-neon-blue">Block {blockData.height.toLocaleString()}</h1>
            <p className="text-foreground/70">Confirmed block on the Bitcoin blockchain</p>
          </div>
        </div>

        {/* Block Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-neon-blue mr-2" />
              <span className="text-foreground/70">Timestamp</span>
            </div>
            <p className="text-xl font-semibold">{new Date(blockData.timestamp).toLocaleString()}</p>
          </div>
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center mb-2">
              <Database className="w-5 h-5 text-neon-orange mr-2" />
              <span className="text-foreground/70">Size</span>
            </div>
            <p className="text-xl font-semibold">{(blockData.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-neon-green mr-2" />
              <span className="text-foreground/70">Transactions</span>
            </div>
            <p className="text-xl font-semibold">{blockData.txCount.toLocaleString()}</p>
          </div>
        </div>

        {/* Block Details */}
        <div className="glassmorphism rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-neon-blue mb-6">Block Details</h2>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center border-b border-neon-blue/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Block Hash</span>
              <code className="text-neon-blue font-mono text-sm break-all">{blockData.hash}</code>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-neon-blue/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Merkle Root</span>
              <code className="text-neon-blue font-mono text-sm break-all">{blockData.merkleRoot}</code>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-neon-blue/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Difficulty</span>
              <span className="text-foreground">{blockData.difficulty}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-neon-blue/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Nonce</span>
              <span className="text-foreground font-mono">{blockData.nonce.toLocaleString()}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-neon-blue/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Bits</span>
              <span className="text-foreground font-mono">{blockData.bits}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-neon-blue/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Weight</span>
              <span className="text-foreground">{blockData.weight.toLocaleString()} WU</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-neon-blue/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Miner</span>
              <span className="text-neon-orange font-semibold">{blockData.miner}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-neon-blue/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Block Reward</span>
              <span className="text-neon-green font-semibold">{blockData.reward} BTC</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Total Fees</span>
              <span className="text-neon-green font-semibold">{blockData.totalFees} BTC</span>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="glassmorphism rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-neon-blue mb-6 flex items-center">
            <Hash className="w-6 h-6 mr-2" />
            Transactions ({blockData.txCount})
          </h2>
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glassmorphism rounded-lg p-4 hover:bg-neon-blue/5 transition-colors duration-200"
              >
                <Link href={`/tx/${tx.txid}`} className="block">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <code className="text-neon-blue font-mono text-sm mb-2 md:mb-0 break-all">
                      {tx.txid}
                    </code>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-foreground/70">{tx.size} bytes</span>
                      <span className="text-neon-green">{tx.fee} BTC</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            <div className="text-center py-4">
              <button
                onClick={loadMoreTransactions}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-orange hover:glow-blue transition-all duration-300 font-semibold text-space-black text-lg shadow-lg hover:shadow-neon-blue/50"
              >
                Load More Transactions
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

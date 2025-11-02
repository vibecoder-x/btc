'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Zap, Clock, TrendingUp, PauseCircle, PlayCircle,
  DollarSign, Download, Hash
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function MempoolPage() {
  const [isPaused, setIsPaused] = useState(false);
  const [txCount, setTxCount] = useState(45234);
  const [mempoolSize, setMempoolSize] = useState(123.45);

  // Simulated real-time updates
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTxCount(prev => prev + Math.floor(Math.random() * 5 - 2));
      setMempoolSize(prev => Math.max(0, prev + (Math.random() * 2 - 1)));
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Fee market data
  const feeEstimates = [
    { priority: 'High', satPerVB: 45, time: '~10 min', color: '#FF6B35' },
    { priority: 'Medium', satPerVB: 25, time: '~30 min', color: '#FFD700' },
    { priority: 'Low', satPerVB: 12, time: '~2 hours', color: '#4CAF50' },
  ];

  // Recent transactions (simulated stream)
  const generateTxId = () => {
    const chars = '0123456789abcdef';
    let txid = '';
    for (let i = 0; i < 64; i++) {
      txid += chars[Math.floor(Math.random() * chars.length)];
    }
    return txid;
  };

  const recentTx = Array.from({ length: 10 }, (_, i) => ({
    txid: generateTxId(),
    feeRate: Math.floor(Math.random() * 50) + 10,
    size: Math.floor(Math.random() * 500) + 200,
    time: Date.now() - i * 5000,
  }));

  // Historical fee data
  const feeHistory = Array.from({ length: 24 }, (_, i) => ({
    time: `${23 - i}h`,
    high: 40 + Math.random() * 20,
    medium: 20 + Math.random() * 15,
    low: 10 + Math.random() * 10,
  }));

  // Mempool size history
  const mempoolHistory = Array.from({ length: 7 }, (_, i) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
    size: 100 + Math.random() * 50,
  }));

  // Block candidates
  const blockCandidates = Array.from({ length: 5 }, (_, i) => ({
    number: i + 1,
    txCount: Math.floor(Math.random() * 2000) + 1000,
    fees: (Math.random() * 0.5 + 0.1).toFixed(4),
    size: (Math.random() * 0.5 + 0.5).toFixed(2),
  }));

  const nextBlockTime = 8; // minutes

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-foreground/70 mb-6">
        <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Mempool</span>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl gradient-gold-orange flex items-center justify-center glow-gold">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-gradient-gold">Live Mempool</h1>
        </div>
        <p className="text-foreground/70 text-lg">Real-time Bitcoin mempool visualization and fee market analysis</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-3d p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-foreground/70 text-sm">Pending Transactions</p>
            <Hash className="w-5 h-5 text-[#FFD700]" />
          </div>
          <p className="text-4xl font-bold text-gradient-gold">{txCount.toLocaleString()}</p>
          <p className="text-sm text-green-400 mt-2">+{Math.floor(Math.random() * 50)} new</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-3d p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-foreground/70 text-sm">Mempool Size</p>
            <Activity className="w-5 h-5 text-[#FF6B35]" />
          </div>
          <p className="text-4xl font-bold text-[#FF6B35]">{mempoolSize.toFixed(2)} MB</p>
          <p className="text-sm text-foreground/50 mt-2">Current size</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-3d p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-foreground/70 text-sm">Next Block</p>
            <Clock className="w-5 h-5 text-[#FFD700]" />
          </div>
          <p className="text-4xl font-bold text-[#FFD700]">{nextBlockTime}m</p>
          <p className="text-sm text-foreground/50 mt-2">Estimated time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-3d p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-foreground/70 text-sm">Average Fee</p>
            <DollarSign className="w-5 h-5 text-[#FF6B35]" />
          </div>
          <p className="text-4xl font-bold text-[#FF6B35]">25</p>
          <p className="text-sm text-foreground/50 mt-2">sat/vB</p>
        </motion.div>
      </div>

      {/* Fee Market Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-3d p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6" />
          Fee Market Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feeEstimates.map((estimate, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="p-6 rounded-xl border-2 transition-all hover:scale-105 cursor-pointer"
              style={{ borderColor: estimate.color, backgroundColor: `${estimate.color}10` }}
            >
              <p className="text-sm text-foreground/70 mb-2">{estimate.priority} Priority</p>
              <p className="text-3xl font-bold mb-1" style={{ color: estimate.color }}>
                {estimate.satPerVB} sat/vB
              </p>
              <p className="text-sm text-foreground/60">Confirmation {estimate.time}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Live Transaction Stream */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card-3d p-8 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gradient-gold flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Live Transaction Stream
          </h2>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-4 py-2 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] transition-colors flex items-center gap-2"
          >
            {isPaused ? (
              <>
                <PlayCircle className="w-5 h-5" />
                Resume
              </>
            ) : (
              <>
                <PauseCircle className="w-5 h-5" />
                Pause
              </>
            )}
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {recentTx.map((tx, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 glassmorphism rounded-lg hover:border-[#FFD700]/40 transition-all"
            >
              <Link href={`/tx/${tx.txid}`} className="flex-1">
                <code className="text-[#FFD700] text-xs font-mono">
                  {tx.txid.slice(0, 16)}...{tx.txid.slice(-16)}
                </code>
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <span className={`font-semibold ${
                  tx.feeRate > 40 ? 'text-[#FF6B35]' : tx.feeRate > 20 ? 'text-[#FFD700]' : 'text-green-400'
                }`}>
                  {tx.feeRate} sat/vB
                </span>
                <span className="text-foreground/60">{tx.size} bytes</span>
                <span className="text-foreground/40 text-xs">
                  {Math.floor((Date.now() - tx.time) / 1000)}s ago
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Fee History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card-3d p-8"
        >
          <h3 className="text-xl font-bold text-gradient-gold mb-4">Fee Rates (Last 24 Hours)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={feeHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#888" style={{ fontSize: '12px' }} />
              <YAxis stroke="#888" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #FFD700' }}
                labelStyle={{ color: '#FFD700' }}
              />
              <Line type="monotone" dataKey="high" stroke="#FF6B35" strokeWidth={2} name="High Priority" />
              <Line type="monotone" dataKey="medium" stroke="#FFD700" strokeWidth={2} name="Medium Priority" />
              <Line type="monotone" dataKey="low" stroke="#4CAF50" strokeWidth={2} name="Low Priority" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Mempool Size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card-3d p-8"
        >
          <h3 className="text-xl font-bold text-gradient-gold mb-4">Mempool Size (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mempoolHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#888" style={{ fontSize: '12px' }} />
              <YAxis stroke="#888" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #FFD700' }}
                labelStyle={{ color: '#FFD700' }}
              />
              <Bar dataKey="size" fill="#FFD700" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Block Candidates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="card-3d p-8"
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Upcoming Block Candidates
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#FFD700]/20">
                <th className="text-left py-4 px-4 text-foreground/70 font-semibold">Block</th>
                <th className="text-right py-4 px-4 text-foreground/70 font-semibold">Transactions</th>
                <th className="text-right py-4 px-4 text-foreground/70 font-semibold">Total Fees</th>
                <th className="text-right py-4 px-4 text-foreground/70 font-semibold">Size (MB)</th>
              </tr>
            </thead>
            <tbody>
              {blockCandidates.map((block, index) => (
                <tr
                  key={index}
                  className="border-b border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg ${
                      index === 0 ? 'bg-[#FFD700] text-black font-bold' : 'bg-[#FFD700]/10 text-[#FFD700]'
                    }`}>
                      #{block.number}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-foreground">
                    {block.txCount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-[#FFD700]">
                    {block.fees} BTC
                  </td>
                  <td className="py-4 px-4 text-right text-foreground/70">
                    {block.size} MB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

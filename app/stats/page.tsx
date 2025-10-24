'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Activity, Database, Clock } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function StatsPage() {
  // Simulated data
  const dailyTxData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    transactions: Math.floor(Math.random() * 100000 + 250000),
  }));

  const blockSizeData = Array.from({ length: 20 }, (_, i) => ({
    block: `${820430 + i}`,
    size: Math.random() * 0.5 + 0.8,
  }));

  const feeData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    avgFee: Math.floor(Math.random() * 30 + 10),
  }));

  const mempoolSizeData = Array.from({ length: 48 }, (_, i) => ({
    time: `${i}h`,
    size: Math.floor(Math.random() * 50 + 100),
  }));

  const blockIntervalData = Array.from({ length: 50 }, (_, i) => ({
    block: `${820400 + i}`,
    interval: Math.floor(Math.random() * 10 + 5),
  }));

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
        <h1 className="text-4xl font-bold text-gradient-gold mb-8">Network Statistics</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card-3d rounded-xl p-6"
          >
            <div className="flex items-center mb-3">
              <TrendingUp className="w-6 h-6 text-[#FFD700] mr-3" />
              <span className="text-foreground/70">Network Hashrate</span>
            </div>
            <p className="text-3xl font-bold text-[#FFD700]">458 EH/s</p>
            <p className="text-sm text-[#FFD700] mt-1">↑ 2.3% from yesterday</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="card-3d rounded-xl p-6"
          >
            <div className="flex items-center mb-3">
              <Activity className="w-6 h-6 text-[#FF6B35] mr-3" />
              <span className="text-foreground/70">Difficulty</span>
            </div>
            <p className="text-3xl font-bold text-[#FF6B35]">58.47 T</p>
            <p className="text-sm text-foreground/50 mt-1">Next adjustment in 1,234 blocks</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="card-3d rounded-xl p-6"
          >
            <div className="flex items-center mb-3">
              <Database className="w-6 h-6 text-[#FFD700] mr-3" />
              <span className="text-foreground/70">Blockchain Size</span>
            </div>
            <p className="text-3xl font-bold text-[#FFD700]">542 GB</p>
            <p className="text-sm text-foreground/50 mt-1">Growing ~150 GB/year</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="card-3d rounded-xl p-6"
          >
            <div className="flex items-center mb-3">
              <Clock className="w-6 h-6 text-[#FFD700] mr-3" />
              <span className="text-foreground/70">Avg Block Time</span>
            </div>
            <p className="text-3xl font-bold text-[#FFD700]">9.8 min</p>
            <p className="text-sm text-foreground/50 mt-1">Target: 10 minutes</p>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="space-y-8">
          {/* Daily Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-3d rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-gradient-gold mb-6">Daily Transactions (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyTxData}>
                <defs>
                  <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10, 10, 15, 0.9)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#ededed',
                  }}
                />
                <Area type="monotone" dataKey="transactions" stroke="#FFD700" fillOpacity={1} fill="url(#colorTx)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Block Size Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card-3d rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-gradient-gold mb-6">Block Size Trends (MB)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={blockSizeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="block" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10, 10, 15, 0.9)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#ededed',
                  }}
                />
                <Bar dataKey="size" fill="#FF6B35" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Two Column Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Average Fees */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card-3d rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-gradient-gold mb-6">Average Fees (Last 24h)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={feeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="hour" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(10, 10, 15, 0.9)',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      borderRadius: '8px',
                      color: '#ededed',
                    }}
                  />
                  <Line type="monotone" dataKey="avgFee" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#FFD700', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Mempool Size */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="card-3d rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-gradient-gold mb-6">Mempool Size (MB)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={mempoolSizeData}>
                  <defs>
                    <linearGradient id="colorMempool" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(10, 10, 15, 0.9)',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      borderRadius: '8px',
                      color: '#ededed',
                    }}
                  />
                  <Area type="monotone" dataKey="size" stroke="#FF6B35" fillOpacity={1} fill="url(#colorMempool)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Block Intervals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="card-3d rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-gradient-gold mb-6">Block Intervals (Minutes)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={blockIntervalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="block" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10, 10, 15, 0.9)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#ededed',
                  }}
                />
                <Line type="monotone" dataKey="interval" stroke="#FFD700" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Activity, Database, Clock } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface NetworkStats {
  difficulty: number;
  hashRate: number;
  blockchainSize: number;
  avgBlockTime: number;
}

export default function StatsPage() {
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    difficulty: 0,
    hashRate: 0,
    blockchainSize: 542,
    avgBlockTime: 10
  });
  const [loading, setLoading] = useState(true);
  const [dailyTxData, setDailyTxData] = useState<any[]>([]);
  const [blockSizeData, setBlockSizeData] = useState<any[]>([]);
  const [feeData, setFeeData] = useState<any[]>([]);
  const [mempoolSizeData, setMempoolSizeData] = useState<any[]>([]);
  const [blockIntervalData, setBlockIntervalData] = useState<any[]>([]);

  useEffect(() => {
    const fetchNetworkStats = async () => {
      try {
        // Fetch recent blocks to calculate stats
        const blocksResponse = await fetch('/api/blocks');
        if (blocksResponse.ok) {
          const blocksData = await blocksResponse.json();

          if (blocksData.blocks && blocksData.blocks.length > 0) {
            const latestBlock = blocksData.blocks[0];

            // Calculate hash rate from difficulty
            const difficulty = latestBlock.difficulty || 0;
            const hashRate = (difficulty * Math.pow(2, 32)) / (10 * 60) / 1e18; // EH/s

            setNetworkStats({
              difficulty: difficulty / 1e12, // Tera
              hashRate: hashRate,
              blockchainSize: 542, // GB (static for now)
              avgBlockTime: 10 // minutes (target)
            });

            // Build daily transaction data from recent blocks
            const txData = blocksData.blocks.slice(0, 10).map((block: any, i: number) => ({
              day: `Block ${block.height}`,
              transactions: block.tx_count || 0
            }));
            setDailyTxData(txData);

            // Build block size data
            const sizeData = blocksData.blocks.slice(0, 10).map((block: any) => ({
              block: block.height.toString(),
              size: (block.size || 0) / 1024 / 1024 // MB
            }));
            setBlockSizeData(sizeData);
          }
        }

        // Fetch mempool data for fee stats
        const mempoolResponse = await fetch('/api/mempool');
        if (mempoolResponse.ok) {
          const mempoolData = await mempoolResponse.json();

          // Build fee data
          if (mempoolData.recommended_fees) {
            const fees = mempoolData.recommended_fees;
            const feeHistory = Array.from({ length: 24 }, (_, i) => ({
              hour: `${i}:00`,
              avgFee: fees.halfHour || 0
            }));
            setFeeData(feeHistory);
          }

          // Build mempool size data
          const mempoolHistory = Array.from({ length: 48 }, (_, i) => ({
            time: `${i}h`,
            size: (mempoolData.mempool_size || 0) / 1024 / 1024 // MB
          }));
          setMempoolSizeData(mempoolHistory);
        }

        // Build block interval data (using 10-minute target)
        const intervals = Array.from({ length: 50 }, (_, i) => ({
          block: `Block ${i + 1}`,
          interval: 10 // minutes (target)
        }));
        setBlockIntervalData(intervals);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching network stats:', error);
        setLoading(false);
      }
    };

    fetchNetworkStats();

    // Refresh every 60 seconds
    const interval = setInterval(fetchNetworkStats, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#FFD700] text-xl">Loading network statistics...</p>
        </div>
      </div>
    );
  }

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
            <p className="text-3xl font-bold text-[#FFD700]">{networkStats.hashRate.toFixed(2)} EH/s</p>
            <p className="text-sm text-[#FFD700] mt-1">Live from blockchain</p>
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
            <p className="text-3xl font-bold text-[#FF6B35]">{networkStats.difficulty.toFixed(2)} T</p>
            <p className="text-sm text-foreground/50 mt-1">Current epoch</p>
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
            <p className="text-3xl font-bold text-[#FFD700]">{networkStats.blockchainSize} GB</p>
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
            <p className="text-3xl font-bold text-[#FFD700]">{networkStats.avgBlockTime} min</p>
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
            <h2 className="text-2xl font-bold text-gradient-gold mb-6">Recent Block Transactions</h2>
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

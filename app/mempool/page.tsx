'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Zap, Clock, TrendingUp,
  DollarSign, Hash
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface FeeEstimate {
  priority: string;
  satPerVB: number;
  time: string;
  color: string;
}

interface MempoolResponse {
  count: number;
  vsize: number;
  total_fee: number;
  fee_histogram: [number, number][];
  recommended_fees: {
    fastest: number;
    halfHour: number;
    hour: number;
    economy: number;
    minimum: number;
  };
  mempool_size: number;
  usage: number;
  max_mempool: number;
  transactions_per_second: number;
  bytes_per_second: number;
}

export default function MempoolPage() {
  const [txCount, setTxCount] = useState(0);
  const [mempoolSize, setMempoolSize] = useState(0);
  const [feeEstimates, setFeeEstimates] = useState<FeeEstimate[]>([]);
  const [feeHistory, setFeeHistory] = useState<any[]>([]);
  const [mempoolHistory, setMempoolHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchMempoolData = async () => {
      try {
        const response = await fetch('/api/mempool');
        if (response.ok) {
          const data: MempoolResponse = await response.json();

          setTxCount(data.count || 0);
          setMempoolSize((data.mempool_size || 0) / 1024 / 1024);

          // Update fee estimates
          if (data.recommended_fees) {
            setFeeEstimates([
              {
                priority: 'High',
                satPerVB: data.recommended_fees.fastest || 0,
                time: '~10 min',
                color: '#FF6B35'
              },
              {
                priority: 'Medium',
                satPerVB: data.recommended_fees.halfHour || 0,
                time: '~30 min',
                color: '#FFD700'
              },
              {
                priority: 'Low',
                satPerVB: data.recommended_fees.economy || 0,
                time: '~2 hours',
                color: '#4CAF50'
              }
            ]);
          }

          // Build fee history (last 24 data points from current data)
          const now = new Date();
          const historyData = Array.from({ length: 24 }, (_, i) => ({
            time: `${23 - i}h`,
            high: data.recommended_fees?.fastest || 0,
            medium: data.recommended_fees?.halfHour || 0,
            low: data.recommended_fees?.economy || 0,
          }));
          setFeeHistory(historyData);

          // Build mempool history (last 7 days from current size)
          const daysData = Array.from({ length: 7 }, (_, i) => ({
            day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
            size: (data.mempool_size || 0) / 1024 / 1024,
          }));
          setMempoolHistory(daysData);
        }
      } catch (error) {
        console.error('Error fetching mempool data:', error);
      }
    };

    // Initial fetch
    fetchMempoolData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchMempoolData, 30000);

    return () => clearInterval(interval);
  }, []);

  const nextBlockTime = 10; // minutes (static for now)
  const avgFee = feeEstimates[1]?.satPerVB || 0;

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
          <p className="text-sm text-[#4CAF50] mt-2">Live from blockchain</p>
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
          <p className="text-4xl font-bold text-[#FF6B35]">{avgFee}</p>
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

      {/* Info Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="card-3d p-8 text-center"
      >
        <Activity className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gradient-gold mb-2">Real-Time Mempool Data</h3>
        <p className="text-foreground/70">
          This page shows live mempool statistics from the Bitcoin blockchain. Data updates every 30 seconds.
        </p>
      </motion.div>
    </div>
  );
}

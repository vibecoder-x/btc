'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Cpu, Zap, DollarSign, Clock,
  ArrowRight, Calendar, Hash
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function MiningPage() {
  const [hashRate, setHashRate] = useState(450);
  const [powerConsumption, setPowerConsumption] = useState(3250);
  const [electricityCost, setElectricityCost] = useState(0.10);

  // Network stats
  const networkStats = {
    difficulty: 72329800234590.84,
    nextAdjustment: 156,
    estimatedChange: '+2.3%',
    globalHashRate: 450.5,
    hashRateTrend7d: '+5.2%',
    hashRateTrend30d: '+12.8%',
  };

  // Mining pool distribution
  const poolData = [
    { name: 'Foundry USA', value: 28.5, color: '#FFD700' },
    { name: 'AntPool', value: 24.2, color: '#FF6B35' },
    { name: 'F2Pool', value: 14.8, color: '#4CAF50' },
    { name: 'ViaBTC', value: 11.3, color: '#2196F3' },
    { name: 'Binance Pool', value: 8.7, color: '#9C27B0' },
    { name: 'Others', value: 12.5, color: '#607D8B' },
  ];

  // Recent blocks - fetch from API
  const [recentBlocks, setRecentBlocks] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecentBlocks = async () => {
      try {
        const response = await fetch('/api/blocks');
        if (response.ok) {
          const data = await response.json();

          // Transform blocks to match expected format
          const transformedBlocks = data.blocks.slice(0, 20).map((block: any, i: number) => ({
            height: block.height,
            miner: block.miner || 'Unknown',
            time: block.timestamp * 1000,
            reward: 3.125, // Current block reward after April 2024 halving
            fees: ((block.fee || 0) / 100000000).toFixed(4),
            timeBetween: i > 0 ? Math.floor((block.timestamp - data.blocks[i-1]?.timestamp) / 60) : 10,
          }));

          setRecentBlocks(transformedBlocks);
        }
      } catch (error) {
        console.error('Error fetching recent blocks:', error);
      }
    };

    fetchRecentBlocks();

    // Refresh every 2 minutes
    const interval = setInterval(fetchRecentBlocks, 120000);
    return () => clearInterval(interval);
  }, []);

  // Difficulty history
  const difficultyHistory = Array.from({ length: 24 }, (_, i) => ({
    epoch: 24 - i,
    difficulty: 70000000000000 + Math.random() * 5000000000000,
    hashRate: 400 + Math.random() * 100,
  }));

  // Popular ASICs
  const asicModels = [
    {
      model: 'Antminer S19 XP',
      hashRate: 140,
      power: 3010,
      efficiency: 21.5,
      price: 5299,
    },
    {
      model: 'Whatsminer M50S',
      hashRate: 126,
      power: 3276,
      efficiency: 26,
      price: 4499,
    },
    {
      model: 'Antminer S19 Pro',
      hashRate: 110,
      power: 3250,
      efficiency: 29.5,
      price: 3999,
    },
    {
      model: 'AvalonMiner 1246',
      hashRate: 90,
      power: 3420,
      efficiency: 38,
      price: 2899,
    },
  ];

  // Profitability calculation
  const calculateProfitability = () => {
    const btcPrice = 45000;
    const dailyRevenueBTC = (hashRate * 1000000000000 * 144 * 6.25) / (networkStats.globalHashRate * 1000000000000000000);
    const dailyRevenueUSD = dailyRevenueBTC * btcPrice;
    const dailyElectricityCost = (powerConsumption / 1000) * 24 * electricityCost;
    const dailyProfit = dailyRevenueUSD - dailyElectricityCost;
    const monthlyProfit = dailyProfit * 30;
    const yearlyProfit = dailyProfit * 365;

    return {
      dailyBTC: dailyRevenueBTC,
      dailyUSD: dailyRevenueUSD,
      dailyCost: dailyElectricityCost,
      dailyProfit,
      monthlyProfit,
      yearlyProfit,
      breakEven: asicModels[0].price / dailyProfit,
    };
  };

  const profitability = calculateProfitability();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-foreground/70 mb-6">
        <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Mining Analytics</span>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl gradient-gold-orange flex items-center justify-center glow-gold">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gradient-gold">Bitcoin Mining Analytics</h1>
        </div>
        <p className="text-foreground/70 text-lg">
          Comprehensive mining statistics, pool distribution, and profitability calculators
        </p>
      </motion.div>

      {/* Network Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-3d p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-6 flex items-center gap-2">
          <Hash className="w-6 h-6" />
          Network Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 glassmorphism rounded-xl">
            <p className="text-sm text-foreground/70 mb-2">Current Difficulty</p>
            <p className="text-2xl font-bold text-[#FFD700] mb-1">
              {(networkStats.difficulty / 1000000000000).toFixed(2)}T
            </p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{networkStats.estimatedChange}</span>
            </div>
          </div>

          <div className="p-6 glassmorphism rounded-xl">
            <p className="text-sm text-foreground/70 mb-2">Next Adjustment</p>
            <p className="text-2xl font-bold text-[#FFD700] mb-1">
              {networkStats.nextAdjustment} blocks
            </p>
            <p className="text-sm text-foreground/50">~{Math.floor(networkStats.nextAdjustment * 10 / 60)} hours</p>
          </div>

          <div className="p-6 glassmorphism rounded-xl">
            <p className="text-sm text-foreground/70 mb-2">Global Hash Rate</p>
            <p className="text-2xl font-bold text-[#FF6B35] mb-1">
              {networkStats.globalHashRate} EH/s
            </p>
            <div className="flex gap-2 text-xs">
              <span className="text-green-400">7d: {networkStats.hashRateTrend7d}</span>
              <span className="text-green-400">30d: {networkStats.hashRateTrend30d}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mining Pool Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-3d p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-6">Mining Pool Distribution</h2>
        <p className="text-foreground/70 text-sm mb-6">Last 1000 blocks</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={poolData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${entry.value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {poolData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {poolData.map((pool, index) => (
              <div key={index} className="flex items-center justify-between p-4 glassmorphism rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: pool.color }} />
                  <span className="font-semibold text-foreground">{pool.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#FFD700]">{pool.value}%</p>
                  <p className="text-xs text-foreground/50">{Math.floor(pool.value * 10)} blocks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Profitability Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-3d p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-6 flex items-center gap-2">
          <DollarSign className="w-6 h-6" />
          Mining Profitability Calculator
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-foreground/70 mb-2">
                Hash Rate (TH/s)
              </label>
              <input
                type="number"
                value={hashRate}
                onChange={(e) => setHashRate(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg bg-[#0A0A0A] border border-[#FFD700]/30 text-foreground focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground/70 mb-2">
                Power Consumption (W)
              </label>
              <input
                type="number"
                value={powerConsumption}
                onChange={(e) => setPowerConsumption(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg bg-[#0A0A0A] border border-[#FFD700]/30 text-foreground focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground/70 mb-2">
                Electricity Cost ($/kWh)
              </label>
              <input
                type="number"
                step="0.01"
                value={electricityCost}
                onChange={(e) => setElectricityCost(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg bg-[#0A0A0A] border border-[#FFD700]/30 text-foreground focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            {/* ASIC Presets */}
            <div>
              <p className="text-sm text-foreground/70 mb-3">Quick Presets:</p>
              <div className="flex flex-wrap gap-2">
                {asicModels.map((asic, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setHashRate(asic.hashRate);
                      setPowerConsumption(asic.power);
                    }}
                    className="px-3 py-1 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] text-sm transition-colors"
                  >
                    {asic.model}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="p-6 glassmorphism rounded-xl">
              <p className="text-sm text-foreground/70 mb-2">Daily Revenue</p>
              <p className="text-3xl font-bold text-[#FFD700] mb-1">
                ${profitability.dailyUSD.toFixed(2)}
              </p>
              <p className="text-sm text-foreground/50">{profitability.dailyBTC.toFixed(8)} BTC</p>
            </div>

            <div className="p-6 glassmorphism rounded-xl">
              <p className="text-sm text-foreground/70 mb-2">Daily Electricity Cost</p>
              <p className="text-3xl font-bold text-[#FF6B35]">
                ${profitability.dailyCost.toFixed(2)}
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-[#FFD700]/20 to-[#FF6B35]/20 rounded-xl border border-[#FFD700]/30">
              <p className="text-sm text-foreground/70 mb-2">Daily Profit</p>
              <p className={`text-4xl font-bold mb-2 ${profitability.dailyProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${profitability.dailyProfit.toFixed(2)}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-foreground/60">Monthly</p>
                  <p className="font-semibold text-foreground">${profitability.monthlyProfit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-foreground/60">Yearly</p>
                  <p className="font-semibold text-foreground">${profitability.yearlyProfit.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="p-4 glassmorphism rounded-lg">
              <p className="text-xs text-foreground/60 mb-1">Break-even (S19 XP @ $5,299)</p>
              <p className="text-lg font-semibold text-[#FFD700]">
                {profitability.breakEven.toFixed(0)} days
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Blocks by Pool */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-3d p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-6">Recent Blocks by Pool</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#FFD700]/20">
                <th className="text-left py-4 px-4 text-foreground/70 font-semibold">Block</th>
                <th className="text-left py-4 px-4 text-foreground/70 font-semibold">Miner</th>
                <th className="text-right py-4 px-4 text-foreground/70 font-semibold">Time</th>
                <th className="text-right py-4 px-4 text-foreground/70 font-semibold">Reward</th>
                <th className="text-right py-4 px-4 text-foreground/70 font-semibold">Fees</th>
              </tr>
            </thead>
            <tbody>
              {recentBlocks.slice(0, 10).map((block, index) => (
                <tr
                  key={index}
                  className="border-b border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <Link
                      href={`/blocks/${block.height}`}
                      className="text-[#FFD700] hover:text-[#FF6B35] font-mono transition-colors"
                    >
                      {block.height.toLocaleString()}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-foreground">{block.miner}</td>
                  <td className="py-4 px-4 text-right text-foreground/70 text-sm">
                    {new Date(block.time).toLocaleTimeString()}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-[#FFD700]">
                    {block.reward} BTC
                  </td>
                  <td className="py-4 px-4 text-right text-[#FF6B35] font-semibold">
                    {block.fees} BTC
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Hardware Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-3d p-8"
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-6 flex items-center gap-2">
          <Cpu className="w-6 h-6" />
          Mining Hardware Comparison
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {asicModels.map((asic, index) => (
            <div
              key={index}
              className="p-6 glassmorphism rounded-xl hover:border-[#FFD700]/40 transition-all"
            >
              <h3 className="text-lg font-bold text-[#FFD700] mb-4">{asic.model}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Hash Rate</span>
                  <span className="font-semibold text-foreground">{asic.hashRate} TH/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Power</span>
                  <span className="font-semibold text-foreground">{asic.power} W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Efficiency</span>
                  <span className="font-semibold text-foreground">{asic.efficiency} J/TH</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#FFD700]/20">
                  <span className="text-foreground/70">Price</span>
                  <span className="font-bold text-[#FFD700]">${asic.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

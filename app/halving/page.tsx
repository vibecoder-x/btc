'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Clock, TrendingUp, Zap, Calendar, DollarSign,
  ArrowRight, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface HalvingEvent {
  number: number;
  date: string;
  block: number;
  rewardBefore: number;
  rewardAfter: number;
  priceAtHalving: number;
  priceOneYearLater: number;
}

export default function HalvingPage() {
  const [currentBlock, setCurrentBlock] = useState(0);
  const [nextHalvingBlock, setNextHalvingBlock] = useState(1050000);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showHistory, setShowHistory] = useState(true);
  const [showEducation, setShowEducation] = useState(true);

  const HALVING_INTERVAL = 210000;
  const BLOCK_TIME = 600; // 10 minutes in seconds

  // Calculate next halving block dynamically
  const getNextHalvingBlock = (currentHeight: number) => {
    const currentHalvingNumber = Math.floor(currentHeight / HALVING_INTERVAL);
    return (currentHalvingNumber + 1) * HALVING_INTERVAL;
  };

  // Historical halving data
  const halvingHistory: HalvingEvent[] = [
    {
      number: 1,
      date: 'November 28, 2012',
      block: 210000,
      rewardBefore: 50,
      rewardAfter: 25,
      priceAtHalving: 12,
      priceOneYearLater: 1000,
    },
    {
      number: 2,
      date: 'July 9, 2016',
      block: 420000,
      rewardBefore: 25,
      rewardAfter: 12.5,
      priceAtHalving: 650,
      priceOneYearLater: 2500,
    },
    {
      number: 3,
      date: 'May 11, 2020',
      block: 630000,
      rewardBefore: 12.5,
      rewardAfter: 6.25,
      priceAtHalving: 8600,
      priceOneYearLater: 55000,
    },
    {
      number: 4,
      date: 'April 19, 2024',
      block: 840000,
      rewardBefore: 6.25,
      rewardAfter: 3.125,
      priceAtHalving: 64000,
      priceOneYearLater: 0, // Future
    },
  ];

  // Fetch current block height
  useEffect(() => {
    const fetchCurrentBlock = async () => {
      try {
        // Use the existing /api/blocks endpoint which provides tipHeight
        const response = await fetch('/api/blocks');
        if (response.ok) {
          const data = await response.json();
          const height = data.tipHeight || 920000;
          setCurrentBlock(height);
          setNextHalvingBlock(getNextHalvingBlock(height));
        } else {
          // Fallback to a reasonable default
          const fallbackHeight = 920000;
          setCurrentBlock(fallbackHeight);
          setNextHalvingBlock(getNextHalvingBlock(fallbackHeight));
        }
      } catch (error) {
        console.error('Error fetching current block:', error);
        // Fallback to a reasonable default
        const fallbackHeight = 920000;
        setCurrentBlock(fallbackHeight);
        setNextHalvingBlock(getNextHalvingBlock(fallbackHeight));
      }
    };

    fetchCurrentBlock();
    const interval = setInterval(fetchCurrentBlock, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate time remaining
  useEffect(() => {
    if (currentBlock === 0) return;

    const calculateTimeRemaining = () => {
      const blocksRemaining = Math.max(0, nextHalvingBlock - currentBlock);
      const secondsRemaining = Math.max(0, blocksRemaining * BLOCK_TIME);

      const days = Math.max(0, Math.floor(secondsRemaining / 86400));
      const hours = Math.max(0, Math.floor((secondsRemaining % 86400) / 3600));
      const minutes = Math.max(0, Math.floor((secondsRemaining % 3600) / 60));
      const seconds = Math.max(0, Math.floor(secondsRemaining % 60));

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [currentBlock, nextHalvingBlock]);

  const blocksRemaining = Math.max(0, nextHalvingBlock - currentBlock);
  const previousHalvingBlock = nextHalvingBlock - HALVING_INTERVAL;
  const progressPercentage = currentBlock > 0
    ? Math.min(100, Math.max(0, ((currentBlock - previousHalvingBlock) / HALVING_INTERVAL) * 100))
    : 0;
  const estimatedDate = new Date(Date.now() + blocksRemaining * BLOCK_TIME * 1000);

  // Supply data for chart
  const supplyData = [
    { year: 2009, supply: 0, reward: 50 },
    { year: 2012, supply: 10.5, reward: 25 },
    { year: 2016, supply: 15.75, reward: 12.5 },
    { year: 2020, supply: 18.375, reward: 6.25 },
    { year: 2024, supply: 19.688, reward: 3.125 },
    { year: 2028, supply: 20.344, reward: 1.5625 },
    { year: 2032, supply: 20.672, reward: 0.78125 },
  ];

  // Inflation rate data
  const inflationData = [
    { halving: 'Pre-Halving 1', rate: 100 },
    { halving: 'Halving 1', rate: 50 },
    { halving: 'Halving 2', rate: 12.5 },
    { halving: 'Halving 3', rate: 4.2 },
    { halving: 'Halving 4', rate: 1.7 },
    { halving: 'Halving 5', rate: 0.85 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-foreground/70 mb-6">
        <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Bitcoin Halving</span>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-20 h-20 rounded-2xl gradient-gold-orange flex items-center justify-center glow-gold animate-pulse">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gradient-gold">Bitcoin Halving Countdown</h1>
        </div>
        <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
          Track the next Bitcoin halving event - when miner rewards are cut in half,
          reducing new supply and historically impacting price
        </p>
      </motion.div>

      {/* Countdown Timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="card-3d p-8 md:p-12 mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gradient-gold mb-8 text-center flex items-center justify-center gap-3">
          <Clock className="w-7 h-7 md:w-8 md:h-8" />
          Next Bitcoin Halving
        </h2>

        {/* Countdown Display - CoinGecko Style */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 flex-wrap">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl md:text-7xl font-bold text-[#FFD700] tabular-nums">
                {timeRemaining.days.toString().padStart(3, '0')}
              </span>
            </div>
            <span className="text-xs md:text-sm text-foreground/60 mt-2 uppercase tracking-wider">Days</span>
          </div>

          {/* Separator */}
          <span className="text-4xl md:text-6xl font-bold text-[#FFD700]/40 pb-6">:</span>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl md:text-7xl font-bold text-[#FFD700] tabular-nums">
                {timeRemaining.hours.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs md:text-sm text-foreground/60 mt-2 uppercase tracking-wider">Hours</span>
          </div>

          {/* Separator */}
          <span className="text-4xl md:text-6xl font-bold text-[#FFD700]/40 pb-6">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl md:text-7xl font-bold text-[#FFD700] tabular-nums">
                {timeRemaining.minutes.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs md:text-sm text-foreground/60 mt-2 uppercase tracking-wider">Minutes</span>
          </div>

          {/* Separator */}
          <span className="text-4xl md:text-6xl font-bold text-[#FFD700]/40 pb-6">:</span>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl md:text-7xl font-bold text-[#FFD700] tabular-nums">
                {timeRemaining.seconds.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs md:text-sm text-foreground/60 mt-2 uppercase tracking-wider">Seconds</span>
          </div>
        </div>

        {/* Key Stats - CoinGecko Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="text-center p-4 rounded-xl bg-foreground/5 border border-[#FFD700]/20">
            <p className="text-xs md:text-sm text-foreground/60 mb-2 uppercase tracking-wide">Blocks Remaining</p>
            <p className="text-xl md:text-2xl font-bold text-[#FFD700]">{blocksRemaining.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-foreground/5 border border-[#FFD700]/20">
            <p className="text-xs md:text-sm text-foreground/60 mb-2 uppercase tracking-wide">Current Height</p>
            <p className="text-xl md:text-2xl font-bold text-[#FFD700]">{currentBlock.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-foreground/5 border border-[#FFD700]/20">
            <p className="text-xs md:text-sm text-foreground/60 mb-2 uppercase tracking-wide">Halving Block</p>
            <p className="text-xl md:text-2xl font-bold text-[#FFD700]">{nextHalvingBlock.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-foreground/5 border border-[#FFD700]/20">
            <p className="text-xs md:text-sm text-foreground/60 mb-2 uppercase tracking-wide">Estimated Date</p>
            <p className="text-sm md:text-base font-bold text-[#FFD700]">
              {estimatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs md:text-sm text-foreground/60 mb-3">
            <span className="font-semibold">Progress to Halving</span>
            <span className="text-[#FFD700] font-bold">{progressPercentage.toFixed(2)}%</span>
          </div>
          <div className="h-3 bg-foreground/10 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-[#FFD700] to-[#FF6B35] relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </motion.div>
          </div>
        </div>

        {/* Reward Info */}
        <div className="flex items-center justify-center gap-6 md:gap-12 text-center pt-6 border-t border-[#FFD700]/20">
          <div>
            <p className="text-xs text-foreground/60 mb-1">Current Block Reward</p>
            <p className="text-2xl md:text-3xl font-bold text-[#FFD700]">3.125 BTC</p>
          </div>
          <div className="text-2xl md:text-4xl text-[#FFD700]/40">→</div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">Next Block Reward</p>
            <p className="text-2xl md:text-3xl font-bold text-[#FF6B35]">1.5625 BTC</p>
          </div>
        </div>
      </motion.div>

      {/* What is Bitcoin Halving */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-3d p-8 mb-8"
      >
        <button
          onClick={() => setShowEducation(!showEducation)}
          className="w-full flex items-center justify-between text-left mb-4"
        >
          <h2 className="text-3xl font-bold text-gradient-gold flex items-center gap-3">
            <Info className="w-8 h-8" />
            What is the Bitcoin Halving?
          </h2>
          {showEducation ? <ChevronUp className="w-6 h-6 text-[#FFD700]" /> : <ChevronDown className="w-6 h-6 text-[#FFD700]" />}
        </button>

        {showEducation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 text-foreground/80"
          >
            <p className="text-lg leading-relaxed">
              The Bitcoin halving is a scheduled event that occurs approximately every four years
              (or every 210,000 blocks) where the reward for mining new blocks is cut in half. This
              mechanism was programmed into Bitcoin's code by Satoshi Nakamoto to control inflation
              and ensure Bitcoin's scarcity.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="p-6 glassmorphism rounded-xl">
                <h3 className="text-xl font-bold text-[#FFD700] mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Why It Matters
                </h3>
                <ul className="space-y-2 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-[#FFD700]" />
                    <span>Reduces new Bitcoin supply entering circulation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-[#FFD700]" />
                    <span>Historically preceded significant price increases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-[#FFD700]" />
                    <span>Makes Bitcoin more scarce over time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-[#FFD700]" />
                    <span>Affects mining economics and network security</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 glassmorphism rounded-xl">
                <h3 className="text-xl font-bold text-[#FFD700] mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Impact on Mining
                </h3>
                <ul className="space-y-2 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-[#FF6B35]" />
                    <span>Miners receive 50% less Bitcoin per block</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-[#FF6B35]" />
                    <span>Transaction fees become more important</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-[#FF6B35]" />
                    <span>Less efficient miners may shut down</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-[#FF6B35]" />
                    <span>Drives innovation in mining technology</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-400">
                <strong>⚠️ Important:</strong> Past performance is not indicative of future results.
                While historical halvings have been followed by price increases, this is not guaranteed
                to repeat.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Historical Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card-3d p-8 mb-8"
      >
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between text-left mb-6"
        >
          <h2 className="text-3xl font-bold text-gradient-gold flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            Historical Halving Events
          </h2>
          {showHistory ? <ChevronUp className="w-6 h-6 text-[#FFD700]" /> : <ChevronDown className="w-6 h-6 text-[#FFD700]" />}
        </button>

        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {halvingHistory.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-6 glassmorphism rounded-xl hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#FFD700] mb-2">
                      Halving #{event.number}
                    </h3>
                    <p className="text-foreground/70">{event.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground/70 mb-1">Block</p>
                    <p className="text-lg font-bold text-foreground">{event.block.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-foreground/50 mb-1">Reward Before</p>
                    <p className="text-lg font-bold text-[#FF6B35]">{event.rewardBefore} BTC</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/50 mb-1">Reward After</p>
                    <p className="text-lg font-bold text-[#4CAF50]">{event.rewardAfter} BTC</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/50 mb-1">Price at Halving</p>
                    <p className="text-lg font-bold text-foreground">${event.priceAtHalving.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/50 mb-1">Price 1 Year Later</p>
                    <p className="text-lg font-bold text-[#FFD700]">
                      {event.priceOneYearLater > 0
                        ? `$${event.priceOneYearLater.toLocaleString()}`
                        : 'TBD'}
                    </p>
                  </div>
                </div>

                {event.priceOneYearLater > 0 && (
                  <div className="flex items-center gap-2 text-sm text-[#4CAF50]">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      +{((event.priceOneYearLater / event.priceAtHalving - 1) * 100).toFixed(0)}%
                      increase in one year
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Bitcoin Supply Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card-3d p-8"
        >
          <h3 className="text-2xl font-bold text-gradient-gold mb-6">Bitcoin Supply Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={supplyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#888" />
              <YAxis stroke="#888" label={{ value: 'Million BTC', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #FFD700' }}
                labelStyle={{ color: '#FFD700' }}
              />
              <Line type="monotone" dataKey="supply" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#FFD700', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-foreground/50 mt-4 text-center">
            Maximum supply: 21 million BTC • Currently mined: ~19.7M BTC
          </p>
        </motion.div>

        {/* Inflation Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card-3d p-8"
        >
          <h3 className="text-2xl font-bold text-gradient-gold mb-6">Annual Inflation Rate (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inflationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="halving" stroke="#888" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #FFD700' }}
                labelStyle={{ color: '#FFD700' }}
              />
              <Bar dataKey="rate" fill="#FFD700" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-foreground/50 mt-4 text-center">
            Post-Halving 5: ~0.85% annual inflation (lower than gold)
          </p>
        </motion.div>
      </div>

      {/* Supply Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="card-3d p-8"
      >
        <h2 className="text-3xl font-bold text-gradient-gold mb-6">Supply Metrics</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-6 glassmorphism rounded-xl text-center">
            <p className="text-foreground/70 mb-2 text-sm">Total BTC Mined</p>
            <p className="text-3xl font-bold text-[#FFD700]">19.7M</p>
            <p className="text-sm text-foreground/50 mt-1">/ 21M</p>
          </div>
          <div className="p-6 glassmorphism rounded-xl text-center">
            <p className="text-foreground/70 mb-2 text-sm">% Mined</p>
            <p className="text-3xl font-bold text-[#FFD700]">93.8%</p>
          </div>
          <div className="p-6 glassmorphism rounded-xl text-center">
            <p className="text-foreground/70 mb-2 text-sm">BTC Remaining</p>
            <p className="text-3xl font-bold text-[#FF6B35]">1.3M</p>
          </div>
          <div className="p-6 glassmorphism rounded-xl text-center">
            <p className="text-foreground/70 mb-2 text-sm">Current Inflation</p>
            <p className="text-3xl font-bold text-[#4CAF50]">1.7%</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

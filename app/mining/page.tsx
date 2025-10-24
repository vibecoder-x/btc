'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bitcoin,
  Cpu,
  Download,
  TrendingUp,
  Zap,
  DollarSign,
  Activity,
  ExternalLink,
  RefreshCw,
  Wallet,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function MiningPage() {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletTxCount, setWalletTxCount] = useState<number>(0);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [hashRate, setHashRate] = useState('');
  const [powerCost, setPowerCost] = useState('0.10');
  const [profitPerDay, setProfitPerDay] = useState<number>(0);

  const WALLET_ADDRESS = 'bc1qq0e9ru8gh5amgm7fslf08clr62tkqyw5ptff0f';

  useEffect(() => {
    fetchWalletData();
    fetchBtcPrice();
  }, []);

  useEffect(() => {
    calculateProfitability();
  }, [hashRate, powerCost, btcPrice]);

  const fetchWalletData = async () => {
    try {
      // Fetch wallet balance from blockchain.info API
      const balanceResponse = await fetch(
        `https://blockchain.info/q/addressbalance/${WALLET_ADDRESS}`
      );
      const balanceSatoshis = await balanceResponse.text();
      const balanceBTC = parseInt(balanceSatoshis) / 100000000;
      setWalletBalance(balanceBTC);

      // Fetch transaction count
      const txResponse = await fetch(
        `https://blockchain.info/q/getreceivedbyaddress/${WALLET_ADDRESS}`
      );
      const txData = await txResponse.text();
      setWalletTxCount(parseInt(txData) || 0);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setWalletBalance(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchBtcPrice = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      const data = await response.json();
      setBtcPrice(data.bitcoin.usd);
    } catch (error) {
      console.error('Error fetching BTC price:', error);
      setBtcPrice(50000);
    }
  };

  const calculateProfitability = () => {
    if (!btcPrice || !hashRate) {
      setProfitPerDay(0);
      return;
    }

    // Convert hash rate to H/s
    let hashRateInHs = parseFloat(hashRate);

    // Bitcoin network difficulty (approximate)
    const networkHashRate = 600000000000000000000; // ~600 EH/s
    const blockReward = 3.125; // Current block reward after halving
    const blocksPerDay = 144;

    // Calculate daily BTC mined
    const userHashRate = hashRateInHs;
    const dailyBTC = (userHashRate / networkHashRate) * blockReward * blocksPerDay;

    // Calculate revenue
    const dailyRevenue = dailyBTC * btcPrice;

    // Calculate power cost (assuming 100W per MH/s for CPU mining)
    const powerWatts = (hashRateInHs / 1000000) * 100;
    const dailyPowerCost = (powerWatts / 1000) * 24 * parseFloat(powerCost);

    // Calculate profit
    const profit = dailyRevenue - dailyPowerCost;
    setProfitPerDay(profit);
  };

  const miningSoftware = [
    {
      name: 'NiceHash',
      description: 'Easy-to-use mining software for beginners',
      type: 'CPU & GPU',
      url: 'https://www.nicehash.com/download',
      recommended: true,
    },
    {
      name: 'CGMiner',
      description: 'Advanced mining software for ASIC/FPGA',
      type: 'ASIC',
      url: 'https://github.com/ckolivas/cgminer',
      recommended: false,
    },
    {
      name: 'BFGMiner',
      description: 'Modular ASIC/FPGA miner',
      type: 'ASIC/FPGA',
      url: 'https://github.com/luke-jr/bfgminer',
      recommended: false,
    },
    {
      name: 'XMRig',
      description: 'CPU mining (for altcoins, can be converted to BTC)',
      type: 'CPU',
      url: 'https://xmrig.com/download',
      recommended: true,
    },
  ];

  const miningPools = [
    {
      name: 'Slush Pool',
      url: 'https://slushpool.com',
      fee: '2%',
      minPayout: '0.001 BTC',
    },
    {
      name: 'F2Pool',
      url: 'https://www.f2pool.com',
      fee: '2.5%',
      minPayout: '0.001 BTC',
    },
    {
      name: 'Antpool',
      url: 'https://www.antpool.com',
      fee: '1-3%',
      minPayout: '0.001 BTC',
    },
    {
      name: 'ViaBTC',
      url: 'https://www.viabtc.com',
      fee: '2%',
      minPayout: '0.001 BTC',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient-gold mb-2 flex items-center gap-3">
          <Bitcoin className="w-10 h-10" />
          Bitcoin Mining Dashboard
        </h1>
        <p className="text-foreground/70">
          Monitor your wallet and set up mining software
        </p>
      </div>

      {/* Success Banner with CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-green-500 mb-2">
                ✅ Want to Mine Without ASIC Hardware?
              </h3>
              <p className="text-foreground/70 text-sm leading-relaxed">
                <strong>You can mine Monero (XMR) with your CPU</strong> and receive Bitcoin payouts!
                <br />• No special hardware needed - just your regular CPU
                <br />• Auto-convert Monero earnings to Bitcoin
                <br />• Payouts sent directly to your BTC wallet
                <br />• Start mining in 5 minutes with our step-by-step guide
              </p>
            </div>
          </div>
          <Link
            href="/mine-cpu"
            className="flex-shrink-0 px-6 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all font-bold text-[#0A0A0A] whitespace-nowrap"
          >
            Start CPU Mining →
          </Link>
        </div>
      </motion.div>

      {/* Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 mb-8"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-orange-500 mb-2">
              Important: Direct Bitcoin Mining Requires ASICs
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              <strong>Desktop/CPU mining Bitcoin directly is not profitable</strong> in 2024. Bitcoin mining now requires specialized ASIC hardware.
              However, you can mine altcoins (like Monero) with your CPU and convert to Bitcoin automatically!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Wallet className="w-6 h-6 text-[#FFD700]" />
            <h3 className="text-xl font-bold text-[#FFD700]">Wallet Balance</h3>
          </div>
          {loading ? (
            <p className="text-foreground/50">Loading...</p>
          ) : (
            <>
              <p className="text-3xl font-bold text-foreground mb-2">
                {walletBalance?.toFixed(8) || '0.00000000'} BTC
              </p>
              <p className="text-sm text-foreground/70">
                ≈ ${btcPrice && walletBalance ? (walletBalance * btcPrice).toFixed(2) : '0.00'} USD
              </p>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-3d rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-6 h-6 text-[#FF6B35]" />
            <h3 className="text-xl font-bold text-[#FF6B35]">Transactions</h3>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{walletTxCount}</p>
          <p className="text-sm text-foreground/70">Total received</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-3d rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-[#FFD700]" />
            <h3 className="text-xl font-bold text-[#FFD700]">BTC Price</h3>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">
            ${btcPrice?.toLocaleString() || '0'}
          </p>
          <p className="text-sm text-foreground/70">Current market price</p>
        </motion.div>
      </div>

      {/* Wallet Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-3d rounded-xl p-6 mb-8"
      >
        <h3 className="text-xl font-bold text-gradient-gold mb-4">Your Mining Wallet</h3>
        <div className="bg-black/50 border border-[#FFD700]/30 rounded-lg p-4 font-mono text-sm break-all mb-3">
          {WALLET_ADDRESS}
        </div>
        <p className="text-xs text-foreground/50">
          Configure this address in your mining software for payouts
        </p>
      </motion.div>

      {/* Profitability Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-3d rounded-xl p-6 mb-8"
      >
        <h3 className="text-2xl font-bold text-gradient-gold mb-6">Mining Profitability Calculator</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-foreground/70 mb-2">
              Hash Rate (H/s)
            </label>
            <input
              type="number"
              value={hashRate}
              onChange={(e) => setHashRate(e.target.value)}
              placeholder="e.g., 1000000 for 1 MH/s"
              className="w-full bg-black/50 border border-[#FFD700]/30 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-[#FFD700]"
            />
            <p className="text-xs text-foreground/50 mt-1">
              Typical CPU: ~100 H/s | GPU: ~1000 H/s
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground/70 mb-2">
              Electricity Cost ($/kWh)
            </label>
            <input
              type="number"
              step="0.01"
              value={powerCost}
              onChange={(e) => setPowerCost(e.target.value)}
              className="w-full bg-black/50 border border-[#FFD700]/30 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-[#FFD700]"
            />
            <p className="text-xs text-foreground/50 mt-1">
              Average US rate: $0.10/kWh
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#FF6B35]/20 border border-[#FFD700]/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-[#FFD700] mb-4">Estimated Daily Profit</h4>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-gradient-gold">
              ${profitPerDay.toFixed(2)}
            </span>
            <span className="text-foreground/70">per day</span>
          </div>
          {profitPerDay < 0 && (
            <p className="text-sm text-red-400 mt-3">
              ⚠️ Mining at a loss. Consider using ASIC miners or mining altcoins.
            </p>
          )}
        </div>
      </motion.div>

      {/* Mining Software */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-3d rounded-xl p-6 mb-8"
      >
        <h3 className="text-2xl font-bold text-gradient-gold mb-6">Mining Software</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {miningSoftware.map((software) => (
            <div
              key={software.name}
              className={`bg-black/50 border rounded-lg p-5 hover:border-[#FFD700] transition-colors ${
                software.recommended ? 'border-[#FFD700]/50' : 'border-[#FFD700]/20'
              }`}
            >
              {software.recommended && (
                <span className="inline-block px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded-full text-xs font-bold mb-3">
                  RECOMMENDED
                </span>
              )}
              <h4 className="text-xl font-bold text-[#FFD700] mb-2">{software.name}</h4>
              <p className="text-foreground/70 text-sm mb-3">{software.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/50 bg-[#FFD700]/10 px-3 py-1 rounded">
                  {software.type}
                </span>
                <a
                  href={software.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#FFD700] hover:text-[#FF6B35] transition-colors text-sm font-semibold"
                >
                  <Download className="w-4 h-4" />
                  Download
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Mining Pools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card-3d rounded-xl p-6 mb-8"
      >
        <h3 className="text-2xl font-bold text-gradient-gold mb-6">Recommended Mining Pools</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#FFD700]/20">
                <th className="text-left py-4 px-4 text-[#FFD700]">Pool Name</th>
                <th className="text-center py-4 px-4 text-[#FFD700]">Fee</th>
                <th className="text-center py-4 px-4 text-[#FFD700]">Min Payout</th>
                <th className="text-right py-4 px-4 text-[#FFD700]">Link</th>
              </tr>
            </thead>
            <tbody>
              {miningPools.map((pool) => (
                <tr key={pool.name} className="border-b border-[#FFD700]/10">
                  <td className="py-4 px-4 text-foreground font-semibold">{pool.name}</td>
                  <td className="py-4 px-4 text-center text-foreground/70">{pool.fee}</td>
                  <td className="py-4 px-4 text-center text-foreground/70">{pool.minPayout}</td>
                  <td className="py-4 px-4 text-right">
                    <a
                      href={pool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#FFD700] hover:text-[#FF6B35] transition-colors text-sm"
                    >
                      Visit
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Setup Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card-3d rounded-xl p-6"
      >
        <h3 className="text-2xl font-bold text-gradient-gold mb-6">Quick Setup Guide</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF6B35] flex items-center justify-center text-[#0A0A0A] font-bold">
              1
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground mb-1">Download Mining Software</h4>
              <p className="text-foreground/70 text-sm">
                For beginners, we recommend NiceHash. Download and install it on your computer.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF6B35] flex items-center justify-center text-[#0A0A0A] font-bold">
              2
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground mb-1">Join a Mining Pool</h4>
              <p className="text-foreground/70 text-sm">
                Register at a mining pool (e.g., Slush Pool) and create a worker account.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF6B35] flex items-center justify-center text-[#0A0A0A] font-bold">
              3
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground mb-1">Configure Your Wallet</h4>
              <p className="text-foreground/70 text-sm">
                Enter your wallet address: <code className="bg-black/50 px-2 py-1 rounded text-[#FFD700]">bc1qq0e9ru8gh5amgm7fslf08clr62tkqyw5ptff0f</code>
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF6B35] flex items-center justify-center text-[#0A0A0A] font-bold">
              4
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground mb-1">Start Mining</h4>
              <p className="text-foreground/70 text-sm">
                Launch the mining software and let it run. Monitor your earnings in the pool dashboard.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF6B35] flex items-center justify-center text-[#0A0A0A] font-bold">
              5
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground mb-1">Track Your Balance</h4>
              <p className="text-foreground/70 text-sm">
                Check this page regularly to see your wallet balance update as you receive payouts.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bitcoin,
  Cpu,
  Download,
  Play,
  Pause,
  TrendingUp,
  Zap,
  DollarSign,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Wallet,
} from 'lucide-react';

export default function CPUMinePage() {
  const [copied, setCopied] = useState(false);
  const [xmrBalance, setXmrBalance] = useState(0);
  const [btcEquivalent, setBtcEquivalent] = useState(0);
  const [xmrPrice, setXmrPrice] = useState<number | null>(null);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [estimatedHashRate, setEstimatedHashRate] = useState('');

  const XMR_WALLET = '42Pt1vxEgKJcBJX5j2vM5WMKFWBKaz5BjCF7BnnyyQnVjpAHEf2canmhGtYf8fDg32PHao6n4jjcE8bdgSzX7HLo2fMzKUF';

  useEffect(() => {
    fetchPrices();
  }, []);

  useEffect(() => {
    if (xmrPrice && btcPrice) {
      calculateBtcEquivalent();
    }
  }, [xmrBalance, xmrPrice, btcPrice]);

  const fetchPrices = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=monero,bitcoin&vs_currencies=usd'
      );
      const data = await response.json();
      setXmrPrice(data.monero.usd);
      setBtcPrice(data.bitcoin.usd);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const calculateBtcEquivalent = () => {
    if (!xmrPrice || !btcPrice) return;
    const xmrInUsd = xmrBalance * xmrPrice;
    const btcAmount = xmrInUsd / btcPrice;
    setBtcEquivalent(btcAmount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadConfig = () => {
    const config = {
      "api": {
        "id": null,
        "worker-id": null
      },
      "http": {
        "enabled": false,
        "host": "127.0.0.1",
        "port": 0,
        "access-token": null,
        "restricted": true
      },
      "autosave": true,
      "background": false,
      "colors": true,
      "title": true,
      "randomx": {
        "init": -1,
        "init-avx2": -1,
        "mode": "auto",
        "1gb-pages": false,
        "rdmsr": true,
        "wrmsr": true,
        "cache_qos": false,
        "numa": true,
        "scratchpad_prefetch_mode": 1
      },
      "cpu": {
        "enabled": true,
        "huge-pages": true,
        "huge-pages-jit": false,
        "hw-aes": null,
        "priority": null,
        "memory-pool": false,
        "yield": true,
        "max-threads-hint": 100,
        "asm": true,
        "argon2-impl": null,
        "cn/0": false,
        "cn-lite/0": false
      },
      "opencl": {
        "enabled": false,
        "cache": true,
        "loader": null,
        "platform": "AMD",
        "adl": true,
        "cn/0": false,
        "cn-lite/0": false
      },
      "cuda": {
        "enabled": false,
        "loader": null,
        "nvml": true,
        "cn/0": false,
        "cn-lite/0": false
      },
      "donate-level": 1,
      "donate-over-proxy": 1,
      "log-file": null,
      "pools": [
        {
          "algo": "rx/0",
          "coin": "monero",
          "url": "pool.supportxmr.com:3333",
          "user": XMR_WALLET,
          "pass": "x",
          "rig-id": null,
          "nicehash": false,
          "keepalive": false,
          "enabled": true,
          "tls": false,
          "tls-fingerprint": null,
          "daemon": false,
          "socks5": null,
          "self-select": null,
          "submit-to-origin": false
        }
      ],
      "print-time": 60,
      "health-print-time": 60,
      "dmi": true,
      "retries": 5,
      "retry-pause": 5,
      "syslog": false,
      "tls": {
        "enabled": false,
        "protocols": null,
        "cert": null,
        "cert_key": null,
        "ciphers": null,
        "ciphersuites": null,
        "dhparam": null
      },
      "dns": {
        "ipv6": false,
        "ttl": 30
      },
      "user-agent": null,
      "verbose": 0,
      "watch": true,
      "pause-on-battery": false,
      "pause-on-active": false
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'xmrig-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const miningSteps = [
    {
      title: 'Download XMRig (Monero Miner)',
      description: 'XMRig is the best CPU miner for Monero. Windows users download from GitHub.',
      action: 'Download',
      link: 'https://github.com/xmrig/xmrig/releases',
    },
    {
      title: 'Extract & Configure',
      description: 'Extract files and download the config file below with your BTC wallet pre-configured.',
      action: 'Get Config',
      onClick: 'downloadConfig',
    },
    {
      title: 'Run XMRig',
      description: 'Open Command Prompt in the XMRig folder and run: xmrig.exe --config=xmrig-config.json',
      action: 'Guide',
      command: true,
    },
    {
      title: 'Start Earning',
      description: 'Your CPU will mine Monero. Auto-convert to BTC on the pool and receive payouts to your BTC wallet.',
      action: 'Monitor',
    },
  ];

  const miningPools = [
    {
      name: 'SupportXMR',
      description: 'Reliable pool with low minimum payout, great for beginners',
      url: 'pool.supportxmr.com:3333',
      fee: '0.6%',
      minPayout: '0.1 XMR (~$18)',
      recommended: true,
    },
    {
      name: 'MoneroOcean',
      description: 'Auto-switches to most profitable RandomX coin, very low minimum',
      url: 'gulf.moneroocean.stream:10128',
      fee: '0%',
      minPayout: '0.003 XMR (~$0.50)',
      recommended: true,
    },
    {
      name: 'Nanopool',
      description: 'Large stable pool with good uptime',
      url: 'xmr-eu1.nanopool.org:14433',
      fee: '1%',
      minPayout: '0.3 XMR (~$54)',
      recommended: false,
    },
  ];

  const cpuHashRates = [
    { cpu: 'AMD Ryzen 9 5950X', hashrate: '20,000 H/s', dailyXMR: '0.025 XMR', dailyUSD: '$4.50' },
    { cpu: 'Intel Core i9-12900K', hashrate: '15,000 H/s', dailyXMR: '0.019 XMR', dailyUSD: '$3.40' },
    { cpu: 'AMD Ryzen 7 5800X', hashrate: '13,000 H/s', dailyXMR: '0.016 XMR', dailyUSD: '$2.90' },
    { cpu: 'Intel Core i7-12700K', hashrate: '11,000 H/s', dailyXMR: '0.014 XMR', dailyUSD: '$2.50' },
    { cpu: 'AMD Ryzen 5 5600X', hashrate: '8,000 H/s', dailyXMR: '0.010 XMR', dailyUSD: '$1.80' },
    { cpu: 'Average Desktop CPU', hashrate: '2,000-5,000 H/s', dailyXMR: '0.003-0.006 XMR', dailyUSD: '$0.50-$1.00' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient-gold mb-2 flex items-center gap-3">
          <Cpu className="w-10 h-10" />
          CPU Mining - Direct Monero (XMR)
        </h1>
        <p className="text-foreground/70">
          Mine Monero directly to your XMR wallet using your CPU
        </p>
      </div>

      {/* Success Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-green-500 mb-2">
              ✅ Yes! You Can Mine Without ASIC Hardware
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              <strong>Monero (XMR) is designed for CPU mining</strong> and cannot be mined with ASICs.
              This means your regular desktop/laptop CPU can actually mine profitably!
              <br /><br />
              <strong>Your Setup - Direct XMR Mining:</strong>
              <br />1. Mine Monero (XMR) with your CPU using XMRig software
              <br />2. Receive XMR directly to your wallet
              <br />3. Convert XMR to BTC anytime on exchanges (Kraken, Binance)
            </p>
          </div>
        </div>
      </motion.div>

      {/* Price Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-[#FFD700]" />
            <h3 className="text-xl font-bold text-[#FFD700]">XMR Price</h3>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">
            ${xmrPrice?.toFixed(2) || '0.00'}
          </p>
          <p className="text-sm text-foreground/70">Per Monero</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-3d rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Bitcoin className="w-6 h-6 text-[#FF6B35]" />
            <h3 className="text-xl font-bold text-[#FF6B35]">BTC Price</h3>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">
            ${btcPrice?.toLocaleString() || '0'}
          </p>
          <p className="text-sm text-foreground/70">Per Bitcoin</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-3d rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-[#FFD700]" />
            <h3 className="text-xl font-bold text-[#FFD700]">XMR to BTC</h3>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">
            {xmrPrice && btcPrice ? (xmrPrice / btcPrice).toFixed(8) : '0.00000000'}
          </p>
          <p className="text-sm text-foreground/70">BTC per XMR</p>
        </motion.div>
      </div>

      {/* Your XMR Wallet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-3d rounded-xl p-6 mb-8"
      >
        <h3 className="text-xl font-bold text-gradient-gold mb-4 flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          Your Monero Wallet (Direct Mining)
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-black/50 border border-[#FFD700]/30 rounded-lg p-4 font-mono text-xs break-all">
            {XMR_WALLET}
          </div>
          <button
            onClick={() => copyToClipboard(XMR_WALLET)}
            className="px-4 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all text-[#0A0A0A]"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-sm text-foreground/70">
            ✅ <strong>Direct XMR Mining:</strong> You will receive Monero (XMR) directly to this wallet.
            You can later convert to Bitcoin on exchanges like <a href="https://www.kraken.com" target="_blank" className="text-[#FFD700] hover:underline">Kraken</a> or <a href="https://www.binance.com" target="_blank" className="text-[#FFD700] hover:underline">Binance</a>.
          </p>
        </div>
      </motion.div>

      {/* Setup Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-3d rounded-xl p-6 mb-8"
      >
        <h3 className="text-2xl font-bold text-gradient-gold mb-6">Quick Setup (5 Minutes)</h3>
        <div className="space-y-6">
          {miningSteps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF6B35] flex items-center justify-center text-[#0A0A0A] font-bold text-lg">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-foreground mb-2">{step.title}</h4>
                <p className="text-foreground/70 text-sm mb-3">{step.description}</p>
                {step.command && (
                  <div className="bg-black/50 border border-[#FFD700]/30 rounded-lg p-3 font-mono text-sm text-[#FFD700] mb-3">
                    xmrig.exe --config=xmrig-config.json
                  </div>
                )}
                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-gold-orange hover:glow-gold transition-all text-[#0A0A0A] font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    {step.action}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {step.onClick === 'downloadConfig' && (
                  <button
                    onClick={downloadConfig}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-gold-orange hover:glow-gold transition-all text-[#0A0A0A] font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    {step.action}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Mining Pools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-3d rounded-xl p-6 mb-8"
      >
        <h3 className="text-2xl font-bold text-gradient-gold mb-6">
          Recommended Monero Mining Pools
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {miningPools.map((pool) => (
            <div
              key={pool.name}
              className={`bg-black/50 border rounded-lg p-5 ${
                pool.recommended ? 'border-[#FFD700]/50' : 'border-[#FFD700]/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-bold text-[#FFD700]">{pool.name}</h4>
                    {pool.recommended && (
                      <span className="px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded-full text-xs font-bold">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <p className="text-foreground/70 text-sm mb-3">{pool.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-foreground/50">Server:</span>
                  <p className="text-foreground font-mono">{pool.url}</p>
                </div>
                <div>
                  <span className="text-foreground/50">Fee:</span>
                  <p className="text-foreground font-semibold">{pool.fee}</p>
                </div>
                <div>
                  <span className="text-foreground/50">Min Payout:</span>
                  <p className="text-foreground font-semibold">{pool.minPayout}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Expected Hash Rates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card-3d rounded-xl p-6 mb-8"
      >
        <h3 className="text-2xl font-bold text-gradient-gold mb-6">Expected Hash Rates & Earnings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#FFD700]/20">
                <th className="text-left py-4 px-4 text-[#FFD700]">CPU Model</th>
                <th className="text-center py-4 px-4 text-[#FFD700]">Hash Rate</th>
                <th className="text-center py-4 px-4 text-[#FFD700]">Daily XMR</th>
                <th className="text-right py-4 px-4 text-[#FFD700]">Daily USD</th>
              </tr>
            </thead>
            <tbody>
              {cpuHashRates.map((item, index) => (
                <tr key={index} className="border-b border-[#FFD700]/10">
                  <td className="py-4 px-4 text-foreground">{item.cpu}</td>
                  <td className="py-4 px-4 text-center text-foreground/70">{item.hashrate}</td>
                  <td className="py-4 px-4 text-center text-foreground/70">{item.dailyXMR}</td>
                  <td className="py-4 px-4 text-right text-foreground/70">{item.dailyUSD}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-foreground/50 mt-4">
          * Earnings calculated at current XMR difficulty and price. Actual results may vary.
        </p>
      </motion.div>

      {/* Important Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card-3d rounded-xl p-6"
      >
        <h3 className="text-2xl font-bold text-gradient-gold mb-6">Important Notes</h3>
        <div className="space-y-4 text-foreground/70">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong>Electricity Cost:</strong> Make sure your electricity cost is low enough for profitable mining.
              Calculate: (CPU Watts × 24 hours × $0.10/kWh) vs daily earnings.
            </p>
          </div>
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong>CPU Temperature:</strong> Monitor your CPU temperature. Keep it under 80°C for safety.
              Consider better cooling if temps are high.
            </p>
          </div>
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong>Antivirus:</strong> Some antivirus software flags mining software as threats.
              Add XMRig to your antivirus exceptions (only download from official GitHub).
            </p>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong>24/7 Mining:</strong> Leave your miner running 24/7 for best results. Payouts happen automatically
              when you reach the minimum threshold.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

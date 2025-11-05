'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Copy,
  Check,
  LogOut,
  TrendingUp,
  Zap,
  Crown,
  AlertCircle,
  ArrowRight,
  Eye,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { formatAddress, getChainIcon } from '@/hooks/useMultiChainPayment';

interface UnlimitedStatus {
  hasUnlimited: boolean;
  activatedAt?: string;
  txHash?: string;
  chain?: string;
}

interface UsageStats {
  today: number;
  thisMonth: number;
  limit: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();

  const [unlimitedStatus, setUnlimitedStatus] = useState<UnlimitedStatus>({ hasUnlimited: false });
  const [usageStats, setUsageStats] = useState<UsageStats>({ today: 0, thisMonth: 0, limit: 100 });
  const [loading, setLoading] = useState(true);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);
  const [watchedAddresses, setWatchedAddresses] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [addingAddress, setAddingAddress] = useState(false);

  useEffect(() => {
    loadDashboardData();
    loadWatchedAddresses();
  }, [address, isConnected]);

  const loadWatchedAddresses = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`watched_addresses_${address}`);
      if (saved) {
        setWatchedAddresses(JSON.parse(saved));
      }
    }
  };

  const addWatchAddress = () => {
    if (!newAddress.trim()) return;

    // Basic Bitcoin address validation
    const isValidBtcAddress = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(newAddress.trim());
    if (!isValidBtcAddress) {
      alert('Please enter a valid Bitcoin address');
      return;
    }

    const updatedAddresses = [...watchedAddresses, newAddress.trim()];
    setWatchedAddresses(updatedAddresses);
    localStorage.setItem(`watched_addresses_${address}`, JSON.stringify(updatedAddresses));
    setNewAddress('');
    setAddingAddress(false);
  };

  const removeWatchAddress = (addressToRemove: string) => {
    const updatedAddresses = watchedAddresses.filter(addr => addr !== addressToRemove);
    setWatchedAddresses(updatedAddresses);
    localStorage.setItem(`watched_addresses_${address}`, JSON.stringify(updatedAddresses));
  };

  const loadDashboardData = async () => {
    try {
      // Check for connected wallet
      if (!isConnected || !address) {
        router.push('/login');
        return;
      }

      // Check if wallet has unlimited access
      const response = await fetch(`/api/payment/check-unlimited?address=${address}`);

      if (!response.ok) {
        console.error('API error:', response.status);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.hasUnlimitedAccess) {
        setUnlimitedStatus({
          hasUnlimited: true,
          activatedAt: data.activatedAt,
          chain: data.chainName,
        });
        setUsageStats({ today: 0, thisMonth: 0, limit: Infinity });
      } else {
        // Free tier - would need to fetch usage data from another endpoint
        setUsageStats({
          today: 0,
          thisMonth: 0,
          limit: 100,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    router.push('/');
  };

  const copyWalletAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const copyTxHash = () => {
    if (!unlimitedStatus.txHash) return;
    navigator.clipboard.writeText(unlimitedStatus.txHash);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const usagePercentage = usageStats.limit === Infinity
    ? 0
    : Math.min((usageStats.today / usageStats.limit) * 100, 100);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-[#FFD700] text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gradient-gold mb-2">Dashboard</h1>
          <p className="text-foreground/70">Monitor your API usage and manage your account</p>
        </div>
        <button
          onClick={handleDisconnect}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>

      {/* Wallet Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-3d rounded-xl p-6 mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-foreground/70">Connected Wallet</p>
              <p className="font-mono text-foreground">{formatAddress(address || '')}</p>
            </div>
          </div>
          <button
            onClick={copyWalletAddress}
            className="px-4 py-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors flex items-center gap-2"
          >
            {copiedWallet ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Plan Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={`card-3d rounded-xl p-8 mb-8 ${
          unlimitedStatus.hasUnlimited ? 'border-2 border-[#FFD700]' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              unlimitedStatus.hasUnlimited ? 'gradient-gold-orange' : 'bg-[#FFD700]/20'
            }`}>
              {unlimitedStatus.hasUnlimited ? (
                <Crown className="w-8 h-8 text-white" />
              ) : (
                <Zap className="w-8 h-8 text-[#FFD700]" />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gradient-gold mb-1">
                {unlimitedStatus.hasUnlimited ? 'Unlimited Plan' : 'Free Plan'}
              </h2>
              <p className="text-foreground/70">
                {unlimitedStatus.hasUnlimited
                  ? 'Lifetime unlimited API access'
                  : '100 requests per day'}
              </p>
            </div>
          </div>
          {!unlimitedStatus.hasUnlimited && (
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white flex items-center gap-2"
            >
              Upgrade
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>

        {unlimitedStatus.hasUnlimited && (
          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-[#FFD700]/20">
            <div>
              <p className="text-sm text-foreground/70 mb-1">Activated On</p>
              <p className="text-foreground font-semibold">
                {unlimitedStatus.activatedAt ? formatDate(unlimitedStatus.activatedAt) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-foreground/70 mb-1">Payment Chain</p>
              <p className="text-foreground font-semibold capitalize">
                {unlimitedStatus.chain || 'N/A'}
              </p>
            </div>
            {unlimitedStatus.txHash && (
              <div className="md:col-span-2">
                <p className="text-sm text-foreground/70 mb-2">Transaction Hash</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-[#0A0A0A] border border-[#FFD700]/30 text-sm font-mono overflow-hidden text-ellipsis">
                    {unlimitedStatus.txHash}
                  </code>
                  <button
                    onClick={copyTxHash}
                    className="px-3 py-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
                  >
                    {copiedTx ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="card-3d rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-[#FF6B35]" />
            <h3 className="text-xl font-bold text-[#FF6B35]">Requests Today</h3>
          </div>
          <p className="text-4xl font-bold text-foreground mb-2">
            {usageStats.today.toLocaleString()}
          </p>
          <p className="text-sm text-foreground/70">
            {unlimitedStatus.hasUnlimited
              ? 'Unlimited'
              : `of ${usageStats.limit} daily limit`}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="card-3d rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-[#FFD700]" />
            <h3 className="text-xl font-bold text-[#FFD700]">This Month</h3>
          </div>
          <p className="text-4xl font-bold text-foreground mb-2">
            {usageStats.thisMonth.toLocaleString()}
          </p>
          <p className="text-sm text-foreground/70">Total requests</p>
        </motion.div>
      </div>

      {/* Watch Addresses Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="card-3d rounded-xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-[#FFD700]" />
            <h2 className="text-2xl font-bold text-gradient-gold">Watched Addresses</h2>
          </div>
          <button
            onClick={() => setAddingAddress(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        </div>

        <p className="text-foreground/70 mb-4">
          Monitor your favorite Bitcoin addresses and track their activity
        </p>

        {/* Add Address Form */}
        {addingAddress && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-4 bg-[#0A0A0A] border border-[#FFD700]/30 rounded-lg"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter Bitcoin address (bc1... or 1... or 3...)"
                className="flex-1 px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#FFD700]/20 text-foreground focus:border-[#FFD700] focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && addWatchAddress()}
              />
              <button
                onClick={addWatchAddress}
                className="px-4 py-2 rounded-lg gradient-gold-orange text-white font-semibold hover:glow-gold transition-all"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setAddingAddress(false);
                  setNewAddress('');
                }}
                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Watched Addresses List */}
        {watchedAddresses.length > 0 ? (
          <div className="space-y-3">
            {watchedAddresses.map((addr, index) => (
              <motion.div
                key={addr}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#FFD700]/20 rounded-lg hover:border-[#FFD700]/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <code className="text-sm font-mono text-foreground truncate block">
                    {addr}
                  </code>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/address/${addr}`}
                    className="p-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
                    title="View Address"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => removeWatchAddress(addr)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Remove Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-foreground/50">
            <Eye className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No addresses being watched yet</p>
            <p className="text-sm mt-1">Add addresses to monitor their activity</p>
          </div>
        )}
      </motion.div>

      {/* Usage Progress Bar (Free Tier Only) */}
      {!unlimitedStatus.hasUnlimited && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="card-3d rounded-xl p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold text-gradient-gold">Daily Usage</h3>
            <span className="text-sm text-foreground/70">
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full rounded-full ${
                usagePercentage >= 90
                  ? 'bg-red-500'
                  : usagePercentage >= 70
                  ? 'bg-orange-500'
                  : 'bg-gradient-to-r from-[#FFD700] to-[#FF6B35]'
              }`}
            />
          </div>
          {usagePercentage >= 90 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-orange-400">
              <AlertCircle className="w-4 h-4" />
              <span>You're approaching your daily limit. Upgrade to unlimited for just $50!</span>
            </div>
          )}
        </motion.div>
      )}

      {/* API Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="card-3d rounded-xl p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-4">Using the API</h2>
        <p className="text-foreground/70 mb-4">
          No API keys required! Your wallet address is your authentication.
        </p>
        <div className="bg-[#0A0A0A] border border-[#FFD700]/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <span className="text-[#888]">// Include your wallet address in the header</span><br />
          <span className="text-[#FF6B35]">fetch</span>(<span className="text-[#4CAF50]">'https://btcindexer.com/api/block/latest'</span>, {'{'}<br />
          {'  '}<span className="text-[#FFD700]">headers</span>: {'{'}<br />
          {'    '}<span className="text-[#4CAF50]">'X-Wallet-Address'</span>: <span className="text-[#4CAF50]">'{address || 'your-wallet-address'}'</span><br />
          {'  }'}
          {'}'})<br />
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Link
          href="/docs"
          className="card-3d rounded-xl p-6 hover:scale-105 transition-transform"
        >
          <h3 className="text-xl font-bold text-gradient-gold mb-2">API Documentation</h3>
          <p className="text-foreground/70">
            Learn how to integrate BTCindexer API into your application
          </p>
        </Link>

        {!unlimitedStatus.hasUnlimited && (
          <Link
            href="/pricing"
            className="card-3d rounded-xl p-6 hover:scale-105 transition-transform border-2 border-[#FFD700]/50"
          >
            <h3 className="text-xl font-bold text-gradient-gold mb-2">Upgrade to Unlimited</h3>
            <p className="text-foreground/70">
              Get unlimited requests for life with just a one-time $50 payment
            </p>
          </Link>
        )}
      </motion.div>
    </div>
  );
}

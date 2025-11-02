'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Wallet, ArrowDownCircle, ArrowUpCircle, Hash, Copy, Check,
  QrCode, Bookmark, Download, ChevronDown, ChevronUp, Filter, Calendar,
  AlertTriangle, TrendingUp, PieChart as PieChartIcon, Clock
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function AddressPage() {
  const params = useParams();
  const address = params.address as string;
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showUTXO, setShowUTXO] = useState(false);
  const [showCharts, setShowCharts] = useState(true);
  const [filter, setFilter] = useState('all');
  const [bookmarked, setBookmarked] = useState(false);
  const [btcPrice] = useState(45000);

  // Detect address type
  const getAddressType = (addr: string) => {
    if (addr.startsWith('bc1q')) return 'P2WPKH (Bech32)';
    if (addr.startsWith('bc1p')) return 'P2TR (Taproot)';
    if (addr.startsWith('3')) return 'P2SH';
    if (addr.startsWith('1')) return 'P2PKH';
    return 'Unknown';
  };

  const addressType = getAddressType(address);

  // Simulated address data
  const addressData = {
    address: address,
    balance: 1.23456789,
    totalReceived: 15.6789,
    totalSent: 14.44433211,
    txCount: 127,
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isReused: true,
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

  const transactions = Array.from({ length: 20 }, (_, i) => ({
    txid: generateTxId(),
    time: new Date(Date.now() - 1000 * 60 * 60 * i).toISOString(),
    amount: (Math.random() * 0.5 - 0.25),
    confirmations: Math.floor(Math.random() * 100) + 1,
    type: Math.random() > 0.5 ? 'received' : 'sent',
  }));

  // Chart data
  const balanceHistory = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (29 - i)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    balance: 1 + Math.random() * 0.5,
  }));

  const volumeData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * (11 - i)).toLocaleDateString('en-US', { month: 'short' }),
    volume: Math.random() * 2,
  }));

  const pieData = [
    { name: 'Received', value: addressData.totalReceived, color: '#FFD700' },
    { name: 'Sent', value: addressData.totalSent, color: '#FF6B35' },
  ];

  // UTXO data
  const utxoSet = [
    { txid: generateTxId(), outputIndex: 0, amount: 0.5, confirmations: 45 },
    { txid: generateTxId(), outputIndex: 1, amount: 0.3, confirmations: 23 },
    { txid: generateTxId(), outputIndex: 0, amount: 0.43456789, confirmations: 67 },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportData = (format: 'csv' | 'json') => {
    if (format === 'json') {
      const data = JSON.stringify(transactions, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `address-${address.slice(0, 8)}-transactions.json`;
      a.click();
    } else {
      const csv = ['Time,TX ID,Amount,Confirmations',
        ...transactions.map(tx => `${tx.time},${tx.txid},${tx.amount},${tx.confirmations}`)
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `address-${address.slice(0, 8)}-transactions.csv`;
      a.click();
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'sent') return tx.amount < 0;
    if (filter === 'received') return tx.amount > 0;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-foreground/70 mb-6">
        <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Address</span>
        <span className="mx-2">/</span>
        <span className="text-foreground/50">{address.slice(0, 8)}...</span>
      </nav>

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
        {/* Address reuse warning */}
        {addressData.isReused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg"
          >
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <div>
              <p className="font-semibold text-orange-400">Address Reuse Detected</p>
              <p className="text-sm text-foreground/70">This address has been used multiple times, which may compromise privacy.</p>
            </div>
          </motion.div>
        )}

        {/* Address Header */}
        <div className="card-3d p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center flex-1">
              <div className="w-16 h-16 rounded-xl gradient-gold-orange flex items-center justify-center glow-gold mr-4">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gradient-gold">Bitcoin Address</h1>
                  <span className="px-3 py-1 rounded-lg bg-[#FFD700]/10 text-[#FFD700] text-sm font-semibold">
                    {addressType}
                  </span>
                </div>
                <code className="text-sm text-foreground/70 break-all font-mono block">{addressData.address}</code>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => copyToClipboard(addressData.address)}
                className="p-2 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] transition-colors"
                title="Copy Address"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowQR(!showQR)}
                className="p-2 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] transition-colors"
                title="Show QR Code"
              >
                <QrCode className="w-5 h-5" />
              </button>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  bookmarked ? 'bg-[#FFD700] text-white' : 'bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20'
                }`}
                title="Watch this address"
              >
                <Bookmark className="w-5 h-5" fill={bookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* QR Code */}
          <AnimatePresence>
            {showQR && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-white rounded-lg flex justify-center"
              >
                <div className="text-center">
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-2">
                    <span className="text-gray-600 text-sm">QR: {address.slice(0, 8)}...</span>
                  </div>
                  <p className="text-xs text-gray-600">Scan to copy address</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Balance Summary */}
        <div className="card-3d p-8 mb-8">
          <h2 className="text-2xl font-bold text-gradient-gold mb-6">Balance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 glassmorphism rounded-xl">
              <p className="text-foreground/70 mb-2 text-sm">Current Balance</p>
              <p className="text-3xl font-bold text-[#FFD700]">{addressData.balance.toFixed(8)} BTC</p>
              <p className="text-sm text-foreground/50 mt-1">
                ≈ ${(addressData.balance * btcPrice).toLocaleString()}
              </p>
            </div>
            <div className="p-6 glassmorphism rounded-xl">
              <p className="text-foreground/70 mb-2 flex items-center text-sm">
                <ArrowDownCircle className="w-4 h-4 mr-2 text-[#FFD700]" />
                Total Received
              </p>
              <p className="text-2xl font-bold text-[#FFD700]">{addressData.totalReceived.toFixed(8)} BTC</p>
              <p className="text-sm text-foreground/50 mt-1">
                ≈ ${(addressData.totalReceived * btcPrice).toLocaleString()}
              </p>
            </div>
            <div className="p-6 glassmorphism rounded-xl">
              <p className="text-foreground/70 mb-2 flex items-center text-sm">
                <ArrowUpCircle className="w-4 h-4 mr-2 text-[#FF6B35]" />
                Total Sent
              </p>
              <p className="text-2xl font-bold text-[#FF6B35]">{addressData.totalSent.toFixed(8)} BTC</p>
              <p className="text-sm text-foreground/50 mt-1">
                ≈ ${(addressData.totalSent * btcPrice).toLocaleString()}
              </p>
            </div>
            <div className="p-6 glassmorphism rounded-xl">
              <p className="text-foreground/70 mb-2 flex items-center text-sm">
                <Hash className="w-4 h-4 mr-2 text-[#FFD700]" />
                Transactions
              </p>
              <p className="text-2xl font-bold text-foreground">{addressData.txCount}</p>
            </div>
            <div className="p-6 glassmorphism rounded-xl">
              <p className="text-foreground/70 mb-2 flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-[#FFD700]" />
                First Seen
              </p>
              <p className="text-lg font-semibold text-foreground">
                {new Date(addressData.firstSeen).toLocaleDateString()}
              </p>
            </div>
            <div className="p-6 glassmorphism rounded-xl">
              <p className="text-foreground/70 mb-2 flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-[#FFD700]" />
                Last Activity
              </p>
              <p className="text-lg font-semibold text-foreground">
                {new Date(addressData.lastActivity).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Charts & Analytics */}
        <div className="card-3d p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gradient-gold flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Charts & Analytics
            </h2>
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="px-4 py-2 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] transition-colors"
            >
              {showCharts ? 'Hide' : 'Show'} Charts
            </button>
          </div>

          <AnimatePresence>
            {showCharts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-8 overflow-hidden"
              >
                {/* Balance Over Time */}
                <div>
                  <h3 className="text-lg font-semibold text-[#FFD700] mb-4">Balance History (Last 30 Days)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={balanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#888" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#888" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #FFD700' }}
                        labelStyle={{ color: '#FFD700' }}
                      />
                      <Line type="monotone" dataKey="balance" stroke="#FFD700" strokeWidth={2} dot={{ fill: '#FFD700' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Transaction Volume */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#FFD700] mb-4">Transaction Volume (Monthly)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={volumeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="month" stroke="#888" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#888" style={{ fontSize: '12px' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #FFD700' }}
                          labelStyle={{ color: '#FFD700' }}
                        />
                        <Bar dataKey="volume" fill="#FFD700" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Receive vs Send */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#FFD700] mb-4">Received vs Sent</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: any) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #FFD700' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* UTXO Set (Collapsible) */}
        <div className="card-3d p-8 mb-8">
          <button
            onClick={() => setShowUTXO(!showUTXO)}
            className="w-full flex items-center justify-between text-left group"
          >
            <div>
              <h2 className="text-2xl font-bold text-gradient-gold flex items-center gap-2">
                Unspent Outputs (UTXO)
              </h2>
              <p className="text-sm text-foreground/60 mt-1">
                {utxoSet.length} UTXOs • Total: {utxoSet.reduce((sum, u) => sum + u.amount, 0).toFixed(8)} BTC
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#FFD700]/10 group-hover:bg-[#FFD700]/20 transition-colors">
              {showUTXO ? <ChevronUp className="w-5 h-5 text-[#FFD700]" /> : <ChevronDown className="w-5 h-5 text-[#FFD700]" />}
            </div>
          </button>

          <AnimatePresence>
            {showUTXO && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 overflow-hidden"
              >
                <div className="space-y-3">
                  {utxoSet.map((utxo, index) => (
                    <div key={index} className="p-4 glassmorphism rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-xs text-[#FFD700] font-mono">
                          {utxo.txid.slice(0, 20)}...:{utxo.outputIndex}
                        </code>
                        <span className="text-sm text-[#FFD700] font-semibold">
                          {utxo.amount.toFixed(8)} BTC
                        </span>
                      </div>
                      <p className="text-xs text-foreground/50">{utxo.confirmations} confirmations</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Transaction History */}
        <div className="card-3d p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gradient-gold">Transaction History</h2>

            <div className="flex items-center gap-3">
              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    filter === 'all' ? 'bg-[#FFD700] text-black' : 'bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('received')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    filter === 'received' ? 'bg-[#FFD700] text-black' : 'bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20'
                  }`}
                >
                  Received
                </button>
                <button
                  onClick={() => setFilter('sent')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    filter === 'sent' ? 'bg-[#FF6B35] text-white' : 'bg-[#FF6B35]/10 text-[#FF6B35] hover:bg-[#FF6B35]/20'
                  }`}
                >
                  Sent
                </button>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => exportData('csv')}
                  className="px-3 py-1 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] text-sm flex items-center gap-1 transition-colors"
                  title="Export CSV"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
                <button
                  onClick={() => exportData('json')}
                  className="px-3 py-1 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] text-sm flex items-center gap-1 transition-colors"
                  title="Export JSON"
                >
                  <Download className="w-4 h-4" />
                  JSON
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#FFD700]/20">
                  <th className="text-left py-4 px-4 text-foreground/70 font-semibold">Transaction ID</th>
                  <th className="text-left py-4 px-4 text-foreground/70 font-semibold">Time</th>
                  <th className="text-right py-4 px-4 text-foreground/70 font-semibold">Amount</th>
                  <th className="text-center py-4 px-4 text-foreground/70 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors duration-200"
                  >
                    <td className="py-4 px-4">
                      <Link
                        href={`/tx/${tx.txid}`}
                        className="text-[#FFD700] hover:text-[#FF6B35] font-mono text-sm transition-colors"
                      >
                        {tx.txid.slice(0, 16)}...{tx.txid.slice(-16)}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-foreground/70 text-sm">
                      {new Date(tx.time).toLocaleString()}
                    </td>
                    <td className={`py-4 px-4 text-right font-semibold ${
                      tx.amount > 0 ? 'text-[#FFD700]' : 'text-[#FF6B35]'
                    }`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(8)} BTC
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs">
                        {tx.confirmations} conf
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredTransactions.map((tx, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glassmorphism rounded-xl p-4"
              >
                <Link href={`/tx/${tx.txid}`} className="block mb-3">
                  <code className="text-[#FFD700] text-xs break-all">
                    {tx.txid.slice(0, 16)}...{tx.txid.slice(-16)}
                  </code>
                </Link>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground/70">
                    {new Date(tx.time).toLocaleDateString()}
                  </span>
                  <span className={`text-lg font-semibold ${
                    tx.amount > 0 ? 'text-[#FFD700]' : 'text-[#FF6B35]'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(8)} BTC
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground/50">
                    {new Date(tx.time).toLocaleTimeString()}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs">
                    {tx.confirmations} conf
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            <button className="px-4 py-2 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-colors duration-300">
              Previous
            </button>
            <span className="text-foreground/70">Page 1 of 7</span>
            <button className="px-4 py-2 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-colors duration-300">
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

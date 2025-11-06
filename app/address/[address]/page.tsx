'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Wallet, ArrowDownCircle, ArrowUpCircle, Hash, Copy, Check,
  QrCode, Bookmark, Download, ChevronDown, ChevronUp, Filter, Calendar,
  AlertTriangle, TrendingUp, PieChart as PieChartIcon, Clock, X, Eye, EyeOff
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import { useAccount } from 'wagmi';

export default function AddressPage() {
  const params = useParams();
  const address = params.address as string;
  const { address: walletAddress, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showUTXO, setShowUTXO] = useState(false);
  const [showCharts, setShowCharts] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isWatched, setIsWatched] = useState(false);
  const [btcPrice] = useState(45000);
  const [addressData, setAddressData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [utxos, setUtxos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 25;

  // Fetch address data from API
  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/address/${address}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch address data');
        }

        const data = await response.json();

        // Transform data to match expected format
        const transformedData = {
          address: data.address,
          balance: data.balance / 100000000, // Convert satoshis to BTC
          totalReceived: data.total_received / 100000000,
          totalSent: data.total_sent / 100000000,
          txCount: data.tx_count || 0,
          firstSeen: new Date().toISOString(), // Blockstream doesn't provide this
          lastActivity: new Date().toISOString(), // Blockstream doesn't provide this
          isReused: data.tx_count > 1,
        };

        setAddressData(transformedData);

        // Process transactions
        if (data.transactions && data.transactions.length > 0) {
          const processedTxs = data.transactions.map((tx: any) => {
            // Calculate amount for this address (received - sent)
            let amount = 0;

            // Calculate total output to this address
            const received = tx.vout?.reduce((sum: number, output: any) => {
              if (output.scriptpubkey_address === address) {
                return sum + (output.value || 0);
              }
              return sum;
            }, 0) || 0;

            // Calculate total input from this address
            const sent = tx.vin?.reduce((sum: number, input: any) => {
              if (input.prevout?.scriptpubkey_address === address) {
                return sum + (input.prevout?.value || 0);
              }
              return sum;
            }, 0) || 0;

            amount = (received - sent) / 100000000; // Convert to BTC

            return {
              txid: tx.txid,
              time: new Date(tx.status?.block_time ? tx.status.block_time * 1000 : Date.now()).toISOString(),
              amount,
              confirmations: tx.status?.confirmed ? tx.status.block_height : 0,
              type: amount > 0 ? 'received' : 'sent',
            };
          });
          setTransactions(processedTxs);
        }

        // Process UTXOs
        if (data.utxos && data.utxos.length > 0) {
          const processedUtxos = data.utxos.map((utxo: any) => ({
            txid: utxo.txid,
            outputIndex: utxo.vout,
            amount: utxo.value / 100000000, // Convert to BTC
            confirmations: utxo.status?.confirmed ? utxo.status.block_height : 0,
          }));
          setUtxos(processedUtxos);
        }

      } catch (err: any) {
        console.error('Error fetching address:', err);
        setError(err.message || 'Failed to load address data');
      } finally {
        setLoading(false);
      }
    };

    fetchAddressData();
  }, [address]);

  // Check if address is being watched
  useEffect(() => {
    if (isConnected && walletAddress && typeof window !== 'undefined') {
      const savedAddresses = localStorage.getItem(`watched_addresses_${walletAddress}`);
      if (savedAddresses) {
        const watchedList = JSON.parse(savedAddresses);
        setIsWatched(watchedList.includes(address));
      }
    }
  }, [address, walletAddress, isConnected]);

  // Toggle watch status
  const toggleWatch = () => {
    if (!isConnected || !walletAddress) {
      alert('Please connect your wallet to use the watch feature');
      return;
    }

    const storageKey = `watched_addresses_${walletAddress}`;
    const savedAddresses = localStorage.getItem(storageKey);
    let watchedList: string[] = savedAddresses ? JSON.parse(savedAddresses) : [];

    if (isWatched) {
      // Remove from watch list
      watchedList = watchedList.filter(addr => addr !== address);
      setIsWatched(false);
    } else {
      // Add to watch list
      watchedList.push(address);
      setIsWatched(true);
    }

    localStorage.setItem(storageKey, JSON.stringify(watchedList));
  };

  // Detect address type
  const getAddressType = (addr: string) => {
    if (addr.startsWith('bc1q')) return 'P2WPKH (Bech32)';
    if (addr.startsWith('bc1p')) return 'P2TR (Taproot)';
    if (addr.startsWith('3')) return 'P2SH';
    if (addr.startsWith('1')) return 'P2PKH';
    return 'Unknown';
  };

  const addressType = getAddressType(address);

  // Generate chart data from real transactions
  const generateBalanceHistory = () => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Sort transactions by time (oldest first)
    const sortedTxs = [...transactions].sort((a, b) =>
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    // Calculate running balance
    let runningBalance = 0;
    const history = sortedTxs.map(tx => {
      runningBalance += tx.amount;
      return {
        date: new Date(tx.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: Math.abs(runningBalance),
      };
    });

    // Return last 30 points
    return history.slice(-30);
  };

  const generateVolumeData = () => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Group transactions by month
    const monthlyVolume: { [key: string]: number } = {};

    transactions.forEach(tx => {
      const month = new Date(tx.time).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyVolume[month]) {
        monthlyVolume[month] = 0;
      }
      monthlyVolume[month] += Math.abs(tx.amount);
    });

    // Convert to array and sort by date
    return Object.entries(monthlyVolume)
      .map(([month, volume]) => ({ month, volume }))
      .slice(-12); // Last 12 months
  };

  const balanceHistory = generateBalanceHistory();
  const volumeData = generateVolumeData();

  const pieData = addressData ? [
    { name: 'Received', value: addressData.totalReceived, color: '#FFD700' },
    { name: 'Sent', value: addressData.totalSent, color: '#FF6B35' },
  ] : [];

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

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / transactionsPerPage));
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#FFD700] text-xl">Loading address data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !addressData) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center card-3d p-12 max-w-lg">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Address</h2>
          <p className="text-foreground/70 mb-6">{error || 'Address data not available'}</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-lg gradient-gold-orange hover:glow-gold text-white font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

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
                onClick={toggleWatch}
                className={`p-2 rounded-lg transition-colors ${
                  isWatched ? 'bg-[#FFD700] text-white' : 'bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20'
                }`}
                title={isWatched ? 'Unwatch this address' : 'Watch this address'}
              >
                {isWatched ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* QR Code Modal */}
          <AnimatePresence>
            {showQR && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/95 backdrop-blur-md"
                  onClick={() => setShowQR(false)}
                />

                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-md bg-[#0F0F0F] border-2 border-[#FFD700]/30 rounded-2xl p-8 z-10 shadow-2xl"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setShowQR(false)}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground/70" />
                  </button>

                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FF6B35] mb-4">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gradient-gold mb-2">
                      Bitcoin Address
                    </h2>
                    <p className="text-sm text-foreground/70">
                      Scan to copy or send Bitcoin
                    </p>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-white rounded-xl">
                      <QRCodeSVG
                        value={addressData.address}
                        size={200}
                        level="H"
                        includeMargin={true}
                        fgColor="#000000"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-6">
                    <p className="text-xs text-foreground/50 mb-2 text-center">Bitcoin Address ({addressType}):</p>
                    <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#FFD700]/20">
                      <code className="text-[#FFD700] font-mono text-xs break-all block text-center">
                        {addressData.address}
                      </code>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(addressData.address)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-gold-orange hover:glow-gold transition-all duration-300 text-white font-semibold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Address Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  {/* Balance Info */}
                  <div className="mt-6 p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20">
                    <p className="text-xs text-foreground/50 mb-2 text-center">Current Balance:</p>
                    <p className="text-lg font-bold text-[#FFD700] text-center">
                      {addressData.balance.toFixed(8)} BTC
                    </p>
                    <p className="text-xs text-foreground/50 text-center mt-1">
                      ≈ ${(addressData.balance * btcPrice).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              </div>
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
                {utxos.length} UTXOs • Total: {utxos.reduce((sum, u) => sum + u.amount, 0).toFixed(8)} BTC
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
                  {utxos.map((utxo, index) => (
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
                {paginatedTransactions.map((tx, index) => (
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
          {filteredTransactions.length > transactionsPerPage && (
            <div className="mt-8 flex items-center justify-center space-x-4">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg glassmorphism hover:bg-[#FFD700]/10 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-foreground/70">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg glassmorphism hover:bg-[#FFD700]/10 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

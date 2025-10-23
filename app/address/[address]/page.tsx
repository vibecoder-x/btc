'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, ArrowDownCircle, ArrowUpCircle, Hash } from 'lucide-react';
import Link from 'next/link';

export default function AddressPage() {
  const params = useParams();
  const address = params.address as string;

  // Simulated address data
  const addressData = {
    address: address,
    balance: 1.23456789,
    totalReceived: 15.6789,
    totalSent: 14.44433211,
    txCount: 127,
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
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-neon-blue hover:text-neon-orange transition-colors duration-300 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-blue to-neon-orange flex items-center justify-center glow-blue mr-4">
            <Wallet className="w-8 h-8 text-space-black" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-neon-blue mb-2">Address</h1>
            <code className="text-sm text-foreground/70 break-all">{addressData.address}</code>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glassmorphism rounded-xl p-6">
            <p className="text-foreground/70 mb-2">Current Balance</p>
            <p className="text-3xl font-bold text-neon-green">{addressData.balance.toFixed(8)} BTC</p>
            <p className="text-sm text-foreground/50 mt-1">
              ≈ ${(addressData.balance * 45000).toLocaleString()}
            </p>
          </div>
          <div className="glassmorphism rounded-xl p-6">
            <p className="text-foreground/70 mb-2 flex items-center">
              <ArrowDownCircle className="w-4 h-4 mr-2 text-neon-green" />
              Total Received
            </p>
            <p className="text-2xl font-bold text-neon-green">{addressData.totalReceived.toFixed(8)} BTC</p>
          </div>
          <div className="glassmorphism rounded-xl p-6">
            <p className="text-foreground/70 mb-2 flex items-center">
              <ArrowUpCircle className="w-4 h-4 mr-2 text-neon-orange" />
              Total Sent
            </p>
            <p className="text-2xl font-bold text-neon-orange">{addressData.totalSent.toFixed(8)} BTC</p>
          </div>
          <div className="glassmorphism rounded-xl p-6">
            <p className="text-foreground/70 mb-2 flex items-center">
              <Hash className="w-4 h-4 mr-2 text-neon-blue" />
              Transactions
            </p>
            <p className="text-2xl font-bold text-neon-blue">{addressData.txCount}</p>
          </div>
        </div>

        {/* Transactions List */}
        <div className="glassmorphism rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-neon-blue mb-6">Transaction History</h2>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neon-blue/20">
                  <th className="text-left py-4 px-4 text-foreground/70 font-semibold">Transaction ID</th>
                  <th className="text-left py-4 px-4 text-foreground/70 font-semibold">Time</th>
                  <th className="text-right py-4 px-4 text-foreground/70 font-semibold">Amount</th>
                  <th className="text-center py-4 px-4 text-foreground/70 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-neon-blue/10 hover:bg-neon-blue/5 transition-colors duration-200"
                  >
                    <td className="py-4 px-4">
                      <Link
                        href={`/tx/${tx.txid}`}
                        className="text-neon-blue hover:text-neon-orange font-mono text-sm transition-colors"
                      >
                        {tx.txid.slice(0, 16)}...{tx.txid.slice(-16)}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-foreground/70 text-sm">
                      {new Date(tx.time).toLocaleString()}
                    </td>
                    <td className={`py-4 px-4 text-right font-semibold ${
                      tx.amount > 0 ? 'text-neon-green' : 'text-neon-orange'
                    }`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(8)} BTC
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-xs">
                        {tx.confirmations} confirmations
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {transactions.map((tx, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glassmorphism rounded-xl p-4"
              >
                <Link href={`/tx/${tx.txid}`} className="block mb-3">
                  <code className="text-neon-blue text-xs break-all">
                    {tx.txid.slice(0, 16)}...{tx.txid.slice(-16)}
                  </code>
                </Link>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground/70">
                    {new Date(tx.time).toLocaleDateString()}
                  </span>
                  <span className={`text-lg font-semibold ${
                    tx.amount > 0 ? 'text-neon-green' : 'text-neon-orange'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(8)} BTC
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground/50">
                    {new Date(tx.time).toLocaleTimeString()}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-neon-green/20 text-neon-green text-xs">
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

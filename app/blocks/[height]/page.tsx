'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Box, Clock, Database, Hash, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function BlockDetailPage() {
  const params = useParams();
  const height = params.height as string;
  const [blockData, setBlockData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextStartIndex, setNextStartIndex] = useState(0);

  // Fetch block data from API
  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/block/${height}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch block data');
        }

        const data = await response.json();

        // Calculate total fees from transactions
        const totalFees = data.transactions?.reduce((sum: number, tx: any) => {
          return sum + ((tx.fee || 0) / 100000000);
        }, 0) || 0;

        // Transform data to match expected format
        const transformedData = {
          height: data.height,
          hash: data.id,
          timestamp: new Date(data.timestamp * 1000).toISOString(),
          size: data.size,
          weight: data.weight,
          version: data.version,
          merkleRoot: data.merkle_root,
          nonce: data.nonce,
          bits: data.bits,
          difficulty: (data.difficulty / 1000000000000).toFixed(2) + ' T',
          txCount: data.tx_count,
          totalFees,
          reward: 6.25, // Current Bitcoin block reward
          miner: data.miner || 'Unknown',
          previousHash: data.previousblockhash,
          nextHash: data.nextblockhash,
        };

        setBlockData(transformedData);

        // Process transactions
        if (data.transactions) {
          const processedTxs = data.transactions.map((tx: any) => ({
            txid: tx.txid,
            fee: ((tx.fee || 0) / 100000000).toFixed(8),
            size: tx.size || 0,
            weight: tx.weight || 0,
          }));
          setTransactions(processedTxs);
        }

        // Set pagination state
        setHasMore(data.hasMore || false);
        setNextStartIndex(data.nextStartIndex || 0);

      } catch (err: any) {
        console.error('Error fetching block:', err);
        setError(err.message || 'Failed to load block data');
      } finally {
        setLoading(false);
      }
    };

    fetchBlockData();
  }, [height]);

  // Load more transactions
  const loadMoreTransactions = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      const response = await fetch(`/api/block/${height}?start_index=${nextStartIndex}`);

      if (!response.ok) {
        throw new Error('Failed to load more transactions');
      }

      const data = await response.json();

      if (data.transactions) {
        const processedTxs = data.transactions.map((tx: any) => ({
          txid: tx.txid,
          fee: ((tx.fee || 0) / 100000000).toFixed(8),
          size: tx.size || 0,
          weight: tx.weight || 0,
        }));
        setTransactions([...transactions, ...processedTxs]);
      }

      setHasMore(data.hasMore || false);
      setNextStartIndex(data.nextStartIndex || 0);

    } catch (err: any) {
      console.error('Error loading more transactions:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#FFD700] text-xl">Loading block...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !blockData) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center glassmorphism p-12 max-w-lg">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Block</h2>
          <p className="text-foreground/70 mb-6">{error || 'Block data not available'}</p>
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
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center glow-gold mr-4">
            <Box className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient-gold">Block {blockData.height.toLocaleString()}</h1>
            <p className="text-foreground/70">Confirmed block on the Bitcoin blockchain</p>
          </div>
        </div>

        {/* Block Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-[#FFD700] mr-2" />
              <span className="text-foreground/70">Timestamp</span>
            </div>
            <p className="text-xl font-semibold">{new Date(blockData.timestamp).toLocaleString()}</p>
          </div>
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center mb-2">
              <Database className="w-5 h-5 text-[#FF6B35] mr-2" />
              <span className="text-foreground/70">Size</span>
            </div>
            <p className="text-xl font-semibold">{(blockData.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-[#4CAF50] mr-2" />
              <span className="text-foreground/70">Transactions</span>
            </div>
            <p className="text-xl font-semibold">{blockData.txCount.toLocaleString()}</p>
          </div>
        </div>

        {/* Block Details */}
        <div className="glassmorphism rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gradient-gold mb-6">Block Details</h2>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center border-b border-[#FFD700]/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Block Hash</span>
              <code className="text-[#FFD700] font-mono text-sm break-all">{blockData.hash}</code>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-[#FFD700]/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Merkle Root</span>
              <code className="text-[#FFD700] font-mono text-sm break-all">{blockData.merkleRoot}</code>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-[#FFD700]/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Difficulty</span>
              <span className="text-foreground">{blockData.difficulty}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-[#FFD700]/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Nonce</span>
              <span className="text-foreground font-mono">{blockData.nonce.toLocaleString()}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-[#FFD700]/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Bits</span>
              <span className="text-foreground font-mono">{blockData.bits}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-[#FFD700]/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Weight</span>
              <span className="text-foreground">{blockData.weight.toLocaleString()} WU</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-[#FFD700]/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Miner</span>
              <span className="text-[#FF6B35] font-semibold">{blockData.miner}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-[#FFD700]/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Block Reward</span>
              <span className="text-[#4CAF50] font-semibold">{blockData.reward} BTC</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Total Fees</span>
              <span className="text-[#4CAF50] font-semibold">{blockData.totalFees} BTC</span>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="glassmorphism rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gradient-gold mb-6 flex items-center">
            <Hash className="w-6 h-6 mr-2" />
            Transactions ({blockData.txCount})
          </h2>
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glassmorphism rounded-lg p-4 hover:bg-[#FFD700]/5 transition-colors duration-200"
              >
                <Link href={`/tx/${tx.txid}`} className="block">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <code className="text-[#FFD700] font-mono text-sm mb-2 md:mb-0 break-all">
                      {tx.txid}
                    </code>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-foreground/70">{tx.size} bytes</span>
                      <span className="text-[#4CAF50]">{tx.fee} BTC</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {hasMore && (
              <div className="text-center py-8">
                <p className="text-foreground/60 mb-4">
                  Showing {transactions.length} of {blockData.txCount} transactions
                </p>
                <button
                  onClick={loadMoreTransactions}
                  disabled={loadingMore}
                  className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FF6B35] hover:glow-gold transition-all duration-300 font-semibold text-white text-lg shadow-lg hover:shadow-[#FFD700]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </span>
                  ) : (
                    `Load More Transactions (${Math.min(25, blockData.txCount - transactions.length)} more)`
                  )}
                </button>
              </div>
            )}

            {!hasMore && transactions.length >= blockData.txCount && transactions.length > 0 && (
              <div className="text-center py-6 glassmorphism rounded-lg">
                <p className="text-[#FFD700] font-semibold">
                  ✓ All {blockData.txCount} transactions loaded
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

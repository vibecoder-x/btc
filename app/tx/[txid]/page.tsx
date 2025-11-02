'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Hash, ArrowRight, CheckCircle, Clock, Copy, Check,
  Share2, QrCode, ExternalLink, ChevronDown, ChevronUp, AlertTriangle,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function TransactionPage() {
  const params = useParams();
  const txid = params.txid as string;
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);
  const [btcPrice] = useState(45000);
  const [txData, setTxData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transaction data from API
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/tx/${txid}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch transaction data');
        }

        const data = await response.json();

        // Transform API response to match our UI format
        const transformedData = {
          txid: data.txid,
          status: data.status?.confirmed ? 'Confirmed' : 'Unconfirmed',
          confirmations: data.status?.block_height ? 1 : 0,
          blockHeight: data.status?.block_height || 0,
          timestamp: data.status?.block_time ? new Date(data.status.block_time * 1000).toISOString() : new Date().toISOString(),
          size: data.size || 0,
          vsize: data.weight ? Math.ceil(data.weight / 4) : 0,
          weight: data.weight || 0,
          fee: (data.fee || 0) / 100000000, // Convert satoshis to BTC
          feeRate: data.fee && data.weight ? ((data.fee / (data.weight / 4))).toFixed(2) : 0,
          lockTime: data.locktime || 0,
          version: data.version || 2,
          rbfEnabled: data.vin?.some((input: any) => input.sequence < 0xfffffffe) || false,
          inputs: data.vin?.map((input: any) => ({
            address: input.prevout?.scriptpubkey_address || 'Unknown',
            amount: (input.prevout?.value || 0) / 100000000,
            prevTx: input.txid ? `${input.txid.slice(0, 8)}...${input.txid.slice(-8)}` : 'Unknown',
            scriptType: input.prevout?.scriptpubkey_type?.toUpperCase() || 'Unknown',
          })) || [],
          outputs: data.vout?.map((output: any) => ({
            address: output.scriptpubkey_address || 'OP_RETURN',
            amount: (output.value || 0) / 100000000,
            scriptType: output.scriptpubkey_type?.toUpperCase() || 'Unknown',
          })) || [],
          rawHex: '0200000001...' // Raw hex not provided by API
        };

        setTxData(transformedData);
      } catch (err: any) {
        console.error('Error fetching transaction:', err);
        setError(err.message || 'Failed to load transaction data');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [txid]);

  const totalInput = txData?.inputs?.reduce((sum: number, input: any) => sum + input.amount, 0) || 0;
  const totalOutput = txData?.outputs?.reduce((sum: number, output: any) => sum + output.amount, 0) || 0;
  const isHighFee = (txData?.feeRate || 0) > 50;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=Bitcoin Transaction ${txid.slice(0, 10)}...&url=${window.location.href}`;
    window.open(url, '_blank');
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#FFD700] text-xl">Loading transaction...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !txData) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center card-3d p-12 max-w-lg">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Transaction</h2>
          <p className="text-foreground/70 mb-6">{error || 'Transaction data not available'}</p>
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
        <span className="text-foreground">Transaction</span>
        <span className="mx-2">/</span>
        <span className="text-foreground/50">{txid.slice(0, 8)}...</span>
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
        {/* Transaction Header */}
        <div className="card-3d p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center flex-1">
              <div className="w-16 h-16 rounded-xl gradient-gold-orange flex items-center justify-center glow-gold mr-4">
                <Hash className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gradient-gold mb-2">Transaction Details</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-sm text-foreground/70 break-all font-mono">{txData.txid}</code>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => copyToClipboard(txData.txid)}
                className="p-2 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] transition-colors"
                title="Copy Transaction ID"
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
                onClick={shareOnTwitter}
                className="p-2 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] transition-colors"
                title="Share on Twitter"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* QR Code Modal */}
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
                    <span className="text-gray-600 text-sm">QR Code: {txid.slice(0, 8)}...</span>
                  </div>
                  <p className="text-xs text-gray-600">Scan to view transaction</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Warning Messages */}
        {(isHighFee || txData.rbfEnabled) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            {isHighFee && (
              <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="font-semibold text-orange-400">High Fee Detected</p>
                  <p className="text-sm text-foreground/70">This transaction has a fee rate of {txData.feeRate} sat/vB, which is higher than average.</p>
                </div>
              </div>
            )}
            {txData.rbfEnabled && (
              <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-semibold text-blue-400">RBF Enabled</p>
                  <p className="text-sm text-foreground/70">This transaction has Replace-By-Fee enabled and can be replaced before confirmation.</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Status Banner */}
        <div className="glassmorphism rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-[#FFD700] mr-3" />
              <div>
                <p className="text-xl font-semibold text-[#FFD700]">{txData.status}</p>
                <p className="text-sm text-foreground/70">{txData.confirmations} confirmations</p>
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-6">
              <div>
                <p className="text-sm text-foreground/70 mb-1">Block Height</p>
                <Link
                  href={`/blocks/${txData.blockHeight}`}
                  className="text-[#FFD700] hover:text-[#FF6B35] font-mono font-semibold transition-colors flex items-center gap-1"
                >
                  {txData.blockHeight.toLocaleString()}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <div>
                <p className="text-sm text-foreground/70 mb-1">Timestamp</p>
                <p className="font-semibold flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {new Date(txData.timestamp).toLocaleString()}
                </p>
              </div>
              <Link
                href={`/blocks/${txData.blockHeight}`}
                className="px-4 py-2 rounded-lg gradient-gold-orange hover:glow-gold text-white font-semibold transition-all flex items-center gap-2"
              >
                View in Block
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Transaction Overview */}
        <div className="card-3d p-8 mb-8">
          <h2 className="text-2xl font-bold text-gradient-gold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Transaction Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#FFD700]/10">
                <span className="text-foreground/70">Total Input</span>
                <div className="text-right">
                  <p className="text-foreground font-semibold">{totalInput.toFixed(8)} BTC</p>
                  <p className="text-sm text-foreground/50">${(totalInput * btcPrice).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#FFD700]/10">
                <span className="text-foreground/70">Total Output</span>
                <div className="text-right">
                  <p className="text-foreground font-semibold">{totalOutput.toFixed(8)} BTC</p>
                  <p className="text-sm text-foreground/50">${(totalOutput * btcPrice).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pb-3">
                <span className="text-foreground/70">Transaction Fee</span>
                <div className="text-right">
                  <p className="text-[#FF6B35] font-semibold">{txData.fee.toFixed(8)} BTC</p>
                  <p className="text-sm text-foreground/50">${(txData.fee * btcPrice).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#FFD700]/10">
                <span className="text-foreground/70">Fee Rate</span>
                <span className="text-[#FF6B35] font-semibold">{txData.feeRate} sat/vB</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#FFD700]/10">
                <span className="text-foreground/70">Size</span>
                <span className="text-foreground">{txData.size} bytes</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#FFD700]/10">
                <span className="text-foreground/70">Virtual Size</span>
                <span className="text-foreground">{txData.vsize} vBytes</span>
              </div>
              <div className="flex justify-between items-center pb-3">
                <span className="text-foreground/70">Weight</span>
                <span className="text-foreground">{txData.weight} WU</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inputs and Outputs */}
        <div className="card-3d p-8 mb-8">
          <h2 className="text-2xl font-bold text-gradient-gold mb-6">Transaction Flow</h2>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-start">
            {/* Inputs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#FFD700]">
                  Inputs ({txData.inputs.length})
                </h3>
                <span className="text-sm text-foreground/50">From</span>
              </div>
              <div className="space-y-3">
                {txData.inputs.map((input: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glassmorphism rounded-lg p-4 hover:border-[#FFD700]/40 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        href={`/address/${input.address}`}
                        className="text-[#FFD700] hover:text-[#FF6B35] font-mono text-xs break-all"
                      >
                        {input.address.slice(0, 20)}...{input.address.slice(-10)}
                      </Link>
                      <span className="text-xs px-2 py-1 rounded bg-[#FFD700]/10 text-[#FFD700]">{input.scriptType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[#FFD700] font-semibold">{input.amount.toFixed(8)} BTC</p>
                      <p className="text-xs text-foreground/50">${(input.amount * btcPrice).toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-foreground/40 mt-2 font-mono">Prev: {input.prevTx}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-[#FFD700]/5 rounded-lg border border-[#FFD700]/20">
                <p className="text-foreground/70 text-sm mb-1">Total Input</p>
                <div className="flex items-baseline justify-between">
                  <p className="text-xl font-bold text-[#FFD700]">{totalInput.toFixed(8)} BTC</p>
                  <p className="text-sm text-foreground/50">${(totalInput * btcPrice).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full gradient-gold-orange flex items-center justify-center glow-gold shadow-lg">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs text-foreground/50">Fee</p>
                <p className="text-sm font-semibold text-[#FF6B35]">{txData.fee.toFixed(8)} BTC</p>
              </div>
            </div>

            {/* Outputs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#FF6B35]">
                  Outputs ({txData.outputs.length})
                </h3>
                <span className="text-sm text-foreground/50">To</span>
              </div>
              <div className="space-y-3">
                {txData.outputs.map((output: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glassmorphism rounded-lg p-4 hover:border-[#FF6B35]/40 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        href={`/address/${output.address}`}
                        className="text-[#FFD700] hover:text-[#FF6B35] font-mono text-xs break-all"
                      >
                        {output.address.slice(0, 20)}...{output.address.slice(-10)}
                      </Link>
                      <span className="text-xs px-2 py-1 rounded bg-[#FF6B35]/10 text-[#FF6B35]">{output.scriptType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[#FF6B35] font-semibold">{output.amount.toFixed(8)} BTC</p>
                      <p className="text-xs text-foreground/50">${(output.amount * btcPrice).toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-[#FF6B35]/5 rounded-lg border border-[#FF6B35]/20">
                <p className="text-foreground/70 text-sm mb-1">Total Output</p>
                <div className="flex items-baseline justify-between">
                  <p className="text-xl font-bold text-[#FF6B35]">{totalOutput.toFixed(8)} BTC</p>
                  <p className="text-sm text-foreground/50">${(totalOutput * btcPrice).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details (Collapsible) */}
        <div className="card-3d p-8">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="w-full flex items-center justify-between text-left group"
          >
            <h2 className="text-2xl font-bold text-gradient-gold flex items-center gap-2">
              Technical Details
            </h2>
            <div className="p-2 rounded-lg bg-[#FFD700]/10 group-hover:bg-[#FFD700]/20 transition-colors">
              {showTechnical ? (
                <ChevronUp className="w-5 h-5 text-[#FFD700]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#FFD700]" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {showTechnical && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 glassmorphism rounded-lg">
                    <p className="text-sm text-foreground/70 mb-1">Version</p>
                    <p className="text-foreground font-semibold font-mono">{txData.version}</p>
                  </div>
                  <div className="p-4 glassmorphism rounded-lg">
                    <p className="text-sm text-foreground/70 mb-1">Lock Time</p>
                    <p className="text-foreground font-semibold font-mono">{txData.lockTime}</p>
                  </div>
                </div>

                <div className="p-4 glassmorphism rounded-lg">
                  <p className="text-sm text-foreground/70 mb-3">Raw Transaction Hex</p>
                  <div className="bg-[#0A0A0A] rounded-lg p-4 overflow-x-auto border border-[#FFD700]/20">
                    <code className="text-[#FFD700] font-mono text-xs break-all leading-relaxed">
                      {txData.rawHex}
                    </code>
                  </div>
                </div>

                {txData.inputs.some((i: any) => i.scriptType.includes('W')) && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm font-semibold text-blue-400 mb-1">SegWit Transaction</p>
                    <p className="text-xs text-foreground/70">
                      This transaction uses Segregated Witness (SegWit), which provides lower fees and better scalability.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

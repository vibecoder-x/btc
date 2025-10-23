'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Hash, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TransactionPage() {
  const params = useParams();
  const txid = params.txid as string;

  // Simulated transaction data
  const txData = {
    txid: txid,
    status: 'Confirmed',
    confirmations: 6,
    blockHeight: 820450,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    size: 256,
    vsize: 178,
    weight: 712,
    fee: 0.00004567,
    feeRate: 25.65,
    inputs: [
      {
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        amount: 0.5,
      },
      {
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        amount: 0.25,
      },
    ],
    outputs: [
      {
        address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
        amount: 0.4,
      },
      {
        address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        amount: 0.34995433,
      },
    ],
    rawHex: '0200000001f5d8...',
  };

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
            <Hash className="w-8 h-8 text-space-black" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-neon-blue mb-2">Transaction</h1>
            <code className="text-sm text-foreground/70 break-all">{txData.txid}</code>
          </div>
        </div>

        {/* Status Banner */}
        <div className="glassmorphism rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-neon-green mr-3" />
              <div>
                <p className="text-xl font-semibold text-neon-green">Confirmed</p>
                <p className="text-sm text-foreground/70">{txData.confirmations} confirmations</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm text-foreground/70 mb-1">Block Height</p>
                <Link
                  href={`/blocks/${txData.blockHeight}`}
                  className="text-neon-blue hover:text-neon-orange font-mono font-semibold transition-colors"
                >
                  {txData.blockHeight.toLocaleString()}
                </Link>
              </div>
              <div>
                <p className="text-sm text-foreground/70 mb-1">Timestamp</p>
                <p className="font-semibold flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {new Date(txData.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="glassmorphism rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-neon-blue mb-6">Transaction Details</h2>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center border-b border-neon-blue/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Size</span>
              <span className="text-foreground">{txData.size} bytes</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-neon-blue/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Virtual Size</span>
              <span className="text-foreground">{txData.vsize} vbytes</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-neon-blue/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Weight</span>
              <span className="text-foreground">{txData.weight} WU</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-neon-blue/10 pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Fee</span>
              <span className="text-neon-orange font-semibold">{txData.fee} BTC</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center pb-4">
              <span className="text-foreground/70 w-48 mb-2 md:mb-0">Fee Rate</span>
              <span className="text-neon-orange font-semibold">{txData.feeRate} sat/vB</span>
            </div>
          </div>
        </div>

        {/* Inputs and Outputs */}
        <div className="glassmorphism rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-neon-blue mb-6">Inputs & Outputs</h2>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            {/* Inputs */}
            <div>
              <h3 className="text-lg font-semibold text-neon-green mb-4">
                Inputs ({txData.inputs.length})
              </h3>
              <div className="space-y-3">
                {txData.inputs.map((input, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glassmorphism rounded-lg p-4"
                  >
                    <Link
                      href={`/address/${input.address}`}
                      className="text-neon-blue hover:text-neon-orange font-mono text-sm break-all block mb-2"
                    >
                      {input.address}
                    </Link>
                    <p className="text-neon-green font-semibold">{input.amount} BTC</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <p className="text-foreground/70 text-sm">Total Input</p>
                <p className="text-xl font-bold text-neon-green">
                  {txData.inputs.reduce((sum, input) => sum + input.amount, 0).toFixed(8)} BTC
                </p>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-blue to-neon-orange flex items-center justify-center glow-blue">
                <ArrowRight className="w-6 h-6 text-space-black" />
              </div>
            </div>

            {/* Outputs */}
            <div>
              <h3 className="text-lg font-semibold text-neon-orange mb-4">
                Outputs ({txData.outputs.length})
              </h3>
              <div className="space-y-3">
                {txData.outputs.map((output, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glassmorphism rounded-lg p-4"
                  >
                    <Link
                      href={`/address/${output.address}`}
                      className="text-neon-blue hover:text-neon-orange font-mono text-sm break-all block mb-2"
                    >
                      {output.address}
                    </Link>
                    <p className="text-neon-orange font-semibold">{output.amount} BTC</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <p className="text-foreground/70 text-sm">Total Output</p>
                <p className="text-xl font-bold text-neon-orange">
                  {txData.outputs.reduce((sum, output) => sum + output.amount, 0).toFixed(8)} BTC
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Raw Transaction */}
        <div className="glassmorphism rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-neon-blue mb-4">Raw Transaction</h2>
          <div className="bg-space-black/50 rounded-lg p-4 overflow-x-auto">
            <code className="text-neon-green font-mono text-sm break-all">{txData.rawHex}</code>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

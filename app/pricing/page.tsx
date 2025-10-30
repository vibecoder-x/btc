'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Coins, Globe } from 'lucide-react';
import Link from 'next/link';
import { ENDPOINT_PRICING } from '@/lib/x402/types';

export default function PricingPage() {
  // Group endpoints by category
  const categories = {
    'Block Data': ENDPOINT_PRICING.filter(e => e.path.includes('/block')),
    'Transactions': ENDPOINT_PRICING.filter(e => e.path.includes('/tx')),
    'Addresses': ENDPOINT_PRICING.filter(e => e.path.includes('/address') && !e.path.includes('brc20')),
    'Inscriptions': ENDPOINT_PRICING.filter(e => e.path.includes('/inscription') || e.path.includes('/collection')),
    'BRC-20 Tokens': ENDPOINT_PRICING.filter(e => e.path.includes('/brc20')),
    'Analytics': ENDPOINT_PRICING.filter(e => e.path.includes('/stats') || e.path.includes('/mempool') || e.path.includes('/fees')),
    'Batch Operations': ENDPOINT_PRICING.filter(e => e.path.includes('/batch')),
  };

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
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gradient-gold mb-4">Pay-Per-Use API Pricing</h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            No subscriptions, no API keys. Pay only for what you use with Base, Solana, or Polygon.
          </p>

          {/* Payment Methods */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0052FF]/10 border border-[#0052FF]/30">
              <span className="text-2xl">🔵</span>
              <span className="text-foreground font-semibold">Base</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <span className="text-2xl">⚡</span>
              <span className="text-foreground font-semibold">Solana</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600/10 border border-purple-600/30">
              <span className="text-2xl">💜</span>
              <span className="text-foreground font-semibold">Polygon</span>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card-3d rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8" />
            How x402 Pay-Per-Use Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 text-[#FFD700] flex items-center justify-center text-xl font-bold mb-3 mx-auto">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Make API Call</h3>
              <p className="text-sm text-foreground/70">Call any endpoint without authentication</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 text-[#FFD700] flex items-center justify-center text-xl font-bold mb-3 mx-auto">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Receive Payment Request</h3>
              <p className="text-sm text-foreground/70">Get 402 response with payment details</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 text-[#FFD700] flex items-center justify-center text-xl font-bold mb-3 mx-auto">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Pay with Crypto</h3>
              <p className="text-sm text-foreground/70">Send payment on your preferred chain</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 text-[#FFD700] flex items-center justify-center text-xl font-bold mb-3 mx-auto">
                4
              </div>
              <h3 className="font-semibold text-foreground mb-2">Get Your Data</h3>
              <p className="text-sm text-foreground/70">Instant access after confirmation</p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Tables by Category */}
        {Object.entries(categories).map(([category, endpoints], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + categoryIndex * 0.1 }}
            className="card-3d rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gradient-gold mb-6">{category}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#FFD700]/20">
                    <th className="text-left py-4 px-4 text-[#FFD700]">Endpoint</th>
                    <th className="text-left py-4 px-4 text-[#FFD700]">Description</th>
                    <th className="text-center py-4 px-4 text-[#FFD700]">Method</th>
                    <th className="text-right py-4 px-4 text-[#FFD700]">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map((endpoint, index) => (
                    <tr key={index} className="border-b border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm text-neon-blue">{endpoint.path}</td>
                      <td className="py-4 px-4 text-foreground/70">{endpoint.description}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                          endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {endpoint.method}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-[#FFD700]">
                        ${endpoint.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="card-3d rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6 flex items-center gap-3">
            <Coins className="w-8 h-8" />
            Why Pay-Per-Use?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">💰 Only Pay What You Use</h3>
              <p className="text-foreground/70">
                No monthly subscriptions or upfront costs. Pay only for the exact API calls you make.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">🔐 No API Keys Required</h3>
              <p className="text-foreground/70">
                No registration, no authentication. Just make a request and pay if you need the data.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">⚡ Instant Access</h3>
              <p className="text-foreground/70">
                Payment confirmed in 1-2 minutes. Your data is delivered immediately after confirmation.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">🌐 Multi-Chain Support</h3>
              <p className="text-foreground/70">
                Pay with Base (ETH), Solana (SOL), or Polygon (MATIC). Choose your preferred chain.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">💎 Transparent Pricing</h3>
              <p className="text-foreground/70">
                All prices are fixed in USD and clearly displayed. No hidden fees or surprises.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">🔄 No Commitments</h3>
              <p className="text-foreground/70">
                Use our API once or a million times. Scale up or down instantly without contracts.
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="card-3d rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">
                How do I get started?
              </h3>
              <p className="text-foreground/70">
                Simply make an API request to any endpoint. You'll receive a 402 Payment Required response with payment instructions. Send the specified amount to the provided address, submit your transaction hash, and get your data after confirmation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">
                Which wallets can I use?
              </h3>
              <p className="text-foreground/70">
                For Base and Polygon: MetaMask, Coinbase Wallet, or any EVM-compatible wallet. For Solana: Phantom, Solflare, or any Solana wallet.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">
                How long does payment confirmation take?
              </h3>
              <p className="text-foreground/70">
                Base and Polygon transactions typically confirm in 10-30 seconds. Solana confirms in 1-2 seconds. We require at least 1 confirmation before delivering data.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">
                What if I need high volume access?
              </h3>
              <p className="text-foreground/70">
                For enterprise customers requiring dedicated infrastructure or bulk pricing, please contact us at contact@btcindexer.com for custom solutions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">
                Are there any rate limits?
              </h3>
              <p className="text-foreground/70">
                No rate limits! Pay-per-use means you can make as many requests as you want. Each request requires payment, giving you complete flexibility.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="card-3d rounded-2xl p-8 text-center"
        >
          <Globe className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gradient-gold mb-4">Ready to Get Started?</h2>
          <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
            Start using the Bitcoin Indexer API right now. No signup required, no API keys needed.
          </p>
          <Link
            href="/docs"
            className="inline-block px-8 py-4 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-semibold text-[#0A0A0A] text-lg"
          >
            View API Documentation
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

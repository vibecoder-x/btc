'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Code } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-neon-blue hover:text-neon-orange transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glassmorphism rounded-2xl p-8 border border-neon-blue/30"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-orange mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-neon-blue mb-2">No Login Required</h1>
            <p className="text-foreground/70">
              Our API uses x402 pay-per-use protocol - no accounts needed
            </p>
          </div>

          {/* Info Section */}
          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/20">
              <h3 className="text-lg font-bold text-neon-green mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Just Start Using the API
              </h3>
              <p className="text-sm text-foreground/70">
                No registration, no API keys, no passwords. Simply make an API request and pay only when you need data.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
              <h3 className="text-lg font-bold text-neon-blue mb-2">How It Works:</h3>
              <ol className="text-sm text-foreground/70 space-y-2">
                <li>1. Call any API endpoint</li>
                <li>2. Receive 402 payment request</li>
                <li>3. Pay with Base, Solana, or Polygon</li>
                <li>4. Get your data instantly</li>
              </ol>
            </div>
          </div>

          {/* Supported Chains */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="text-center p-4 rounded-xl bg-[#0052FF]/10 border border-[#0052FF]/20">
              <span className="block text-2xl mb-2">🔵</span>
              <p className="text-xs font-semibold text-foreground">Base</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <span className="block text-2xl mb-2">⚡</span>
              <p className="text-xs font-semibold text-foreground">Solana</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-purple-600/10 border border-purple-600/20">
              <span className="block text-2xl mb-2">💜</span>
              <p className="text-xs font-semibold text-foreground">Polygon</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              href="/docs"
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-orange hover:glow-blue transition-all duration-300 font-bold text-white flex items-center justify-center gap-2"
            >
              <Code className="w-5 h-5" />
              View API Documentation
            </Link>
            <Link
              href="/pricing"
              className="w-full px-6 py-3 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-all duration-300 font-semibold text-foreground text-center block"
            >
              See Pricing
            </Link>
          </div>
        </motion.div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <div className="inline-flex flex-col gap-2 text-xs text-foreground/50">
            <div className="flex items-center gap-4 justify-center">
              <span>✅ No accounts</span>
              <span>✅ No API keys</span>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <span>✅ No subscriptions</span>
              <span>✅ Pay per use</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

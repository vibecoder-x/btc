'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Code, Globe } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
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
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-neon-blue mb-2">Get Started</h1>
            <p className="text-foreground/70 mb-4">
              Start using our Bitcoin indexer API in seconds
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/20 border border-neon-green/30">
              <Zap className="w-4 h-4 text-neon-green" />
              <span className="text-sm font-semibold text-neon-green">No signup required</span>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8 space-y-3">
            <div className="p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <h3 className="font-bold text-neon-blue mb-1">Start Immediately</h3>
                  <p className="text-sm text-foreground/70">
                    No registration forms, no email verification. Just call the API and go.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neon-orange/10 border border-neon-orange/20">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💰</span>
                <div>
                  <h3 className="font-bold text-neon-orange mb-1">Pay Per Use</h3>
                  <p className="text-sm text-foreground/70">
                    Only pay for what you use. Prices start at $0.01 per request.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/20">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <h3 className="font-bold text-neon-green mb-1">No Credentials Needed</h3>
                  <p className="text-sm text-foreground/70">
                    No API keys, no passwords. Pay with crypto and access data.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mb-8 p-6 rounded-xl bg-space-black/50 border border-neon-blue/20">
            <h3 className="text-lg font-bold text-neon-blue mb-4 text-center">
              How x402 Works
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue font-bold text-xs">
                  1
                </div>
                <p className="text-foreground/70 flex-1">
                  Make an API request to any endpoint
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-orange/20 flex items-center justify-center text-neon-orange font-bold text-xs">
                  2
                </div>
                <p className="text-foreground/70 flex-1">
                  Receive 402 Payment Required response
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple font-bold text-xs">
                  3
                </div>
                <p className="text-foreground/70 flex-1">
                  Pay with Base, Solana, or Polygon
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green font-bold text-xs">
                  4
                </div>
                <p className="text-foreground/70 flex-1">
                  Get your data instantly after confirmation
                </p>
              </div>
            </div>
          </div>

          {/* Supported Chains */}
          <div className="mb-8">
            <p className="text-sm text-foreground/70 text-center mb-3">Pay with:</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-[#0052FF]/10 border border-[#0052FF]/20">
                <span className="block text-2xl mb-1">🔵</span>
                <p className="text-xs font-semibold text-foreground">Base</p>
                <p className="text-xs text-foreground/50">ETH</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="block text-2xl mb-1">⚡</span>
                <p className="text-xs font-semibold text-foreground">Solana</p>
                <p className="text-xs text-foreground/50">SOL</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-purple-600/10 border border-purple-600/20">
                <span className="block text-2xl mb-1">💜</span>
                <p className="text-xs font-semibold text-foreground">Polygon</p>
                <p className="text-xs text-foreground/50">MATIC</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              href="/docs"
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-orange hover:glow-blue transition-all duration-300 font-bold text-white flex items-center justify-center gap-2"
            >
              <Code className="w-5 h-5" />
              Read API Documentation
            </Link>
            <Link
              href="/pricing"
              className="w-full px-6 py-3 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-all duration-300 font-semibold text-foreground text-center block"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <div className="inline-flex flex-col gap-2 text-xs text-foreground/50">
            <div className="flex items-center gap-4 justify-center">
              <span>✅ No email required</span>
              <span>✅ No passwords</span>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <span>✅ No API keys</span>
              <span>✅ Instant access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

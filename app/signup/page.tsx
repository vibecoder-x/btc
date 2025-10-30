'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Wallet, Crown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-[#FFD700] hover:text-[#FF6B35] transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glassmorphism rounded-2xl p-8 border border-[#FFD700]/30"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FF6B35] mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient-gold mb-2">Get Started</h1>
            <p className="text-foreground/70 mb-4">
              Connect your wallet and access the Bitcoin indexer API
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4CAF50]/20 border border-[#4CAF50]/30">
              <Zap className="w-4 h-4 text-[#4CAF50]" />
              <span className="text-sm font-semibold text-[#4CAF50]">No email or password needed</span>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="mb-8 space-y-4">
            <div className="p-5 rounded-xl bg-[#FFD700]/10 border-2 border-[#FFD700]/30">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-[#FFD700]" />
                <h3 className="font-bold text-[#FFD700] text-lg">Free Tier</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-2">100 requests/day</p>
              <p className="text-sm text-foreground/70 mb-4">
                Perfect for testing and small projects
              </p>
              <ul className="space-y-2 text-sm text-foreground/70 mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-[#4CAF50]">✓</span>
                  All API endpoints
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4CAF50]">✓</span>
                  Personal dashboard
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4CAF50]">✓</span>
                  Usage tracking
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#FF6B35]/10 border-2 border-[#FF6B35]">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-6 h-6 text-[#FF6B35]" />
                <h3 className="font-bold text-gradient-gold text-lg">Unlimited Tier</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-2">
                $50 <span className="text-base font-normal text-foreground/50">one-time payment</span>
              </p>
              <p className="text-sm text-foreground/70 mb-4">
                Lifetime unlimited access
              </p>
              <ul className="space-y-2 text-sm text-foreground/70 mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-[#4CAF50]">✓</span>
                  Unlimited API requests
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4CAF50]">✓</span>
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4CAF50]">✓</span>
                  Advanced analytics
                </li>
              </ul>
            </div>
          </div>

          {/* How it works */}
          <div className="mb-8 p-6 rounded-xl bg-space-black/50 border border-[#FFD700]/20">
            <h3 className="text-lg font-bold text-[#FFD700] mb-4 text-center">
              How It Works
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] font-bold text-xs">
                  1
                </div>
                <p className="text-foreground/70 flex-1">
                  Connect your MetaMask or Phantom wallet
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF6B35]/20 flex items-center justify-center text-[#FF6B35] font-bold text-xs">
                  2
                </div>
                <p className="text-foreground/70 flex-1">
                  Access your personal dashboard with usage stats
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4CAF50]/20 flex items-center justify-center text-[#4CAF50] font-bold text-xs">
                  3
                </div>
                <p className="text-foreground/70 flex-1">
                  Start with 100 free requests per day
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                  4
                </div>
                <p className="text-foreground/70 flex-1">
                  Upgrade to unlimited anytime for just $50
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full px-6 py-4 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white flex items-center justify-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet to Get Started
            </button>
            <Link
              href="/api"
              className="w-full px-6 py-3 rounded-lg glassmorphism hover:bg-[#FFD700]/10 transition-all duration-300 font-semibold text-foreground text-center block"
            >
              View API Documentation
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

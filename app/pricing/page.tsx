'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient-gold">Simple Pricing</span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-4">
            Choose the plan that works for you. No hidden fees, no surprises.
          </p>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Pay directly with your crypto wallet - no manual transactions needed!
          </p>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
        {/* Free Tier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card-3d rounded-2xl p-8 border border-[#FFD700]/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[#FFD700]/20">
              <Zap className="w-6 h-6 text-[#FFD700]" />
            </div>
            <h2 className="text-3xl font-bold text-[#FFD700]">Free</h2>
          </div>

          <div className="mb-6">
            <div className="text-4xl font-bold text-foreground mb-2">
              $0
            </div>
            <p className="text-foreground/70">Perfect for testing and small projects</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
              <span className="text-foreground/80">100 API requests per day</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
              <span className="text-foreground/80">Basic Bitcoin data access</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
              <span className="text-foreground/80">Standard rate limits</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
              <span className="text-foreground/80">Community support</span>
            </div>
          </div>

          <Link
            href="/docs"
            className="w-full px-6 py-3 rounded-lg glassmorphism border border-[#FFD700]/30 hover:border-[#FFD700] hover:bg-[#FFD700]/10 transition-all duration-300 font-semibold text-foreground text-center block"
          >
            Get Started Free
          </Link>
        </motion.div>

        {/* Unlimited Tier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card-3d rounded-2xl p-8 border-2 border-[#FF6B35] relative overflow-hidden"
        >
          {/* Popular Badge */}
          <div className="absolute top-6 right-6">
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] text-white text-xs font-bold">
              POPULAR
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl gradient-gold-orange">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gradient-gold">Unlimited</h2>
          </div>

          <div className="mb-6">
            <div className="text-4xl font-bold text-foreground mb-2">
              $50
              <span className="text-lg text-foreground/50 font-normal"> one-time</span>
            </div>
            <p className="text-foreground/70">Lifetime unlimited access</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
              <span className="text-foreground/80"><strong>Unlimited</strong> API requests</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
              <span className="text-foreground/80">Full Bitcoin data access</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
              <span className="text-foreground/80">No rate limits</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
              <span className="text-foreground/80">Priority support</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
              <span className="text-foreground/80">Personal dashboard</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
              <span className="text-foreground/80">Lifetime updates</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full px-6 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white text-center flex items-center justify-center gap-2 group"
          >
            Upgrade Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mb-16"
      >
        <h3 className="text-2xl font-bold text-foreground mb-6">
          Pay with Your Favorite Crypto
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg card-3d border border-[#FFD700]/20">
            <span className="text-2xl">🔵</span>
            <span className="font-semibold text-foreground">Base</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg card-3d border border-[#FFD700]/20">
            <span className="text-2xl">💜</span>
            <span className="font-semibold text-foreground">Polygon</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg card-3d border border-[#FFD700]/20">
            <span className="text-2xl">💎</span>
            <span className="font-semibold text-foreground">Ethereum</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg card-3d border border-[#FFD700]/20">
            <span className="text-2xl">₿</span>
            <span className="font-semibold text-foreground">Bitcoin</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg card-3d border border-[#FFD700]/20">
            <span className="text-2xl">⚡</span>
            <span className="font-semibold text-foreground">Solana</span>
          </div>
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h3 className="text-3xl font-bold text-center mb-8 text-gradient-gold">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <div className="card-3d rounded-xl p-6 border border-[#FFD700]/30">
            <h4 className="font-bold text-lg text-[#FFD700] mb-2">
              Is the $50 payment one-time or recurring?
            </h4>
            <p className="text-foreground/70">
              It's a one-time payment for lifetime unlimited access. No recurring fees, no hidden costs.
            </p>
          </div>
          <div className="card-3d rounded-xl p-6 border border-[#FFD700]/30">
            <h4 className="font-bold text-lg text-[#FFD700] mb-2">
              How do I access the API after payment?
            </h4>
            <p className="text-foreground/70">
              After payment, your wallet address is automatically whitelisted for unlimited access. Just connect your wallet and start using the API.
            </p>
          </div>
          <div className="card-3d rounded-xl p-6 border border-[#FFD700]/30">
            <h4 className="font-bold text-lg text-[#FFD700] mb-2">
              Can I use multiple wallets?
            </h4>
            <p className="text-foreground/70">
              The unlimited access is linked to the wallet that made the payment. You can use that wallet across any device.
            </p>
          </div>
          <div className="card-3d rounded-xl p-6 border border-[#FFD700]/30">
            <h4 className="font-bold text-lg text-[#FFD700] mb-2">
              What if I want to switch my plan later?
            </h4>
            <p className="text-foreground/70">
              You can upgrade from Free to Unlimited anytime. Once upgraded, you have lifetime access.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

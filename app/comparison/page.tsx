'use client';

import { motion } from 'framer-motion';
import {
  Check,
  X,
  Crown,
  Zap,
  Shield,
  TrendingUp,
  DollarSign,
  Key,
  Users,
  Clock,
  BarChart3,
  ArrowRight,
  Wallet,
  Globe
} from 'lucide-react';
import Link from 'next/link';

interface Competitor {
  name: string;
  logo?: string;
  pricing: {
    free: string;
    paid: string;
    model: string;
  };
  features: {
    apiAccess: boolean | string;
    rateLimit: string;
    authentication: string;
    uptime: string;
    support: string;
    dataScope: string;
  };
  pros: string[];
  cons: string[];
}

const COMPETITORS: Competitor[] = [
  {
    name: 'BTCindexer',
    pricing: {
      free: '100 requests/day',
      paid: '$50 one-time',
      model: 'Pay Once, Use Forever'
    },
    features: {
      apiAccess: true,
      rateLimit: 'Unlimited with paid plan',
      authentication: 'Wallet signature (no API keys)',
      uptime: '99.9%',
      support: 'Priority support',
      dataScope: 'Full blockchain data'
    },
    pros: [
      'One-time payment, lifetime access',
      'No API keys required',
      'Truly unlimited requests',
      'Crypto-native payment',
      'No subscriptions',
      'Simple pricing'
    ],
    cons: [
      'Newer service',
      'Building community'
    ]
  },
  {
    name: 'Blockchain.com',
    pricing: {
      free: '10,000 requests/month',
      paid: 'Contact sales',
      model: 'Subscription-based'
    },
    features: {
      apiAccess: true,
      rateLimit: 'Varies by plan',
      authentication: 'API key required',
      uptime: '99.5%',
      support: 'Email support',
      dataScope: 'Limited free tier'
    },
    pros: [
      'Established brand',
      'Multiple blockchains',
      'Good documentation'
    ],
    cons: [
      'Monthly subscription fees',
      'Complex pricing tiers',
      'API key management',
      'Rate limiting on free tier',
      'No guaranteed pricing'
    ]
  },
  {
    name: 'BlockCypher',
    pricing: {
      free: '3 requests/sec',
      paid: '$85-$850/month',
      model: 'Subscription-based'
    },
    features: {
      apiAccess: true,
      rateLimit: '3-200 req/sec',
      authentication: 'Token required',
      uptime: '99.9%',
      support: 'Tiered support',
      dataScope: 'Full access paid only'
    },
    pros: [
      'High performance',
      'Multiple chains',
      'Webhook support'
    ],
    cons: [
      'Expensive monthly fees',
      'Complex pricing',
      'Requires tokens',
      'Costs add up quickly',
      'Limited free tier'
    ]
  },
  {
    name: 'Blockstream',
    pricing: {
      free: 'Rate limited',
      paid: 'N/A',
      model: 'Free with limits'
    },
    features: {
      apiAccess: 'Limited',
      rateLimit: 'Strict rate limits',
      authentication: 'None required',
      uptime: '99%',
      support: 'Community only',
      dataScope: 'Basic data'
    },
    pros: [
      'Completely free',
      'No authentication',
      'Bitcoin focused'
    ],
    cons: [
      'Very strict rate limits',
      'No paid tier',
      'No guaranteed uptime',
      'Limited features',
      'No support',
      'Can\'t scale'
    ]
  },
  {
    name: 'Mempool.space',
    pricing: {
      free: 'Rate limited',
      paid: 'Enterprise contact',
      model: 'Free/Enterprise'
    },
    features: {
      apiAccess: 'Limited',
      rateLimit: '10 req/10 sec',
      authentication: 'None required',
      uptime: '99%',
      support: 'Community',
      dataScope: 'Recent data focus'
    },
    pros: [
      'Popular interface',
      'Great visualization',
      'Open source'
    ],
    cons: [
      'Strict rate limits',
      'Limited historical data',
      'No guaranteed SLA',
      'API not primary focus',
      'Enterprise only for scale'
    ]
  }
];

const FEATURE_COMPARISON = [
  { feature: 'Unlimited API Requests', btcindexer: true, blockchain: false, blockcypher: 'Highest tier only', blockstream: false, mempool: false },
  { feature: 'One-time Payment', btcindexer: true, blockchain: false, blockcypher: false, blockstream: 'Free', mempool: false },
  { feature: 'No API Keys', btcindexer: true, blockchain: false, blockcypher: false, blockstream: true, mempool: true },
  { feature: 'Crypto Payment', btcindexer: true, blockchain: false, blockcypher: false, blockstream: false, mempool: false },
  { feature: 'No Monthly Fees', btcindexer: true, blockchain: false, blockcypher: false, blockstream: true, mempool: true },
  { feature: 'Priority Support', btcindexer: true, blockchain: 'Enterprise', blockcypher: 'Highest tier', blockstream: false, mempool: false },
  { feature: 'Guaranteed Uptime', btcindexer: '99.9%', blockchain: '99.5%', blockcypher: '99.9%', blockstream: 'No SLA', mempool: 'No SLA' },
  { feature: 'Full Blockchain Data', btcindexer: true, blockchain: 'Paid only', blockcypher: 'Paid only', blockstream: 'Limited', mempool: 'Limited' },
  { feature: 'Webhook Support', btcindexer: 'Coming soon', blockchain: true, blockcypher: true, blockstream: false, mempool: false },
  { feature: 'Transaction Broadcasting', btcindexer: true, blockchain: true, blockcypher: true, blockstream: true, mempool: true },
];

const renderValue = (value: boolean | string) => {
  if (value === true) {
    return <Check className="w-5 h-5 text-[#4CAF50] mx-auto" />;
  } else if (value === false) {
    return <X className="w-5 h-5 text-red-400 mx-auto" />;
  } else {
    return <span className="text-xs text-foreground/70 text-center">{value}</span>;
  }
};

export default function ComparisonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-gradient-gold mb-4">
          Why Choose BTCindexer?
        </h1>
        <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
          Compare our transparent, one-time payment model with traditional subscription-based services
        </p>
      </motion.div>

      {/* Key Differentiators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-3 gap-6 mb-16"
      >
        <div className="card-3d rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-xl gradient-gold-orange flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-[#FFD700] mb-2">$50 One-Time</h3>
          <p className="text-foreground/70">
            Pay once, use forever. No monthly subscriptions, no surprise charges.
          </p>
        </div>

        <div className="card-3d rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-xl gradient-gold-orange flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-[#FFD700] mb-2">Crypto Native</h3>
          <p className="text-foreground/70">
            Pay with crypto using your wallet. No credit cards, no API keys required.
          </p>
        </div>

        <div className="card-3d rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-xl gradient-gold-orange flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-[#FFD700] mb-2">Truly Unlimited</h3>
          <p className="text-foreground/70">
            No rate limits, no throttling. Make as many requests as you need.
          </p>
        </div>
      </motion.div>

      {/* Feature Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-3d rounded-xl p-8 mb-16 overflow-x-auto"
      >
        <h2 className="text-3xl font-bold text-gradient-gold mb-6 text-center">
          Feature Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#FFD700]/30">
                <th className="text-left py-4 px-4 text-foreground font-bold">Feature</th>
                <th className="text-center py-4 px-4">
                  <div className="flex flex-col items-center">
                    <Crown className="w-6 h-6 text-[#FFD700] mb-2" />
                    <span className="font-bold text-[#FFD700]">BTCindexer</span>
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-foreground/70">Blockchain.com</th>
                <th className="text-center py-4 px-4 text-foreground/70">BlockCypher</th>
                <th className="text-center py-4 px-4 text-foreground/70">Blockstream</th>
                <th className="text-center py-4 px-4 text-foreground/70">Mempool.space</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_COMPARISON.map((row, index) => (
                <tr key={index} className="border-b border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors">
                  <td className="py-4 px-4 text-foreground">{row.feature}</td>
                  <td className="py-4 px-4 bg-[#FFD700]/10">{renderValue(row.btcindexer)}</td>
                  <td className="py-4 px-4">{renderValue(row.blockchain)}</td>
                  <td className="py-4 px-4">{renderValue(row.blockcypher)}</td>
                  <td className="py-4 px-4">{renderValue(row.blockstream)}</td>
                  <td className="py-4 px-4">{renderValue(row.mempool)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Detailed Comparison Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-gradient-gold mb-8 text-center">
          Detailed Provider Comparison
        </h2>

        <div className="grid lg:grid-cols-2 gap-6">
          {COMPETITORS.map((competitor, index) => (
            <motion.div
              key={competitor.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`card-3d rounded-xl p-6 ${
                competitor.name === 'BTCindexer' ? 'border-2 border-[#FFD700]' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-foreground">{competitor.name}</h3>
                {competitor.name === 'BTCindexer' && (
                  <Crown className="w-6 h-6 text-[#FFD700]" />
                )}
              </div>

              {/* Pricing */}
              <div className="mb-4 p-4 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-[#FFD700]" />
                  <span className="font-bold text-[#FFD700]">Pricing</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-foreground/70"><span className="font-semibold">Free:</span> {competitor.pricing.free}</p>
                  <p className="text-foreground/70"><span className="font-semibold">Paid:</span> {competitor.pricing.paid}</p>
                  <p className="text-foreground/70"><span className="font-semibold">Model:</span> {competitor.pricing.model}</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h4 className="font-bold text-foreground mb-2">Key Features</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Rate Limit:</span>
                    <span className="text-foreground font-semibold">{competitor.features.rateLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Authentication:</span>
                    <span className="text-foreground font-semibold">{competitor.features.authentication}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Uptime:</span>
                    <span className="text-foreground font-semibold">{competitor.features.uptime}</span>
                  </div>
                </div>
              </div>

              {/* Pros */}
              <div className="mb-4">
                <h4 className="font-bold text-[#4CAF50] mb-2">Pros</h4>
                <ul className="space-y-1">
                  {competitor.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                      <Check className="w-4 h-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h4 className="font-bold text-red-400 mb-2">Cons</h4>
                <ul className="space-y-1">
                  {competitor.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                      <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Cost Over Time Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-3d rounded-xl p-8 mb-16"
      >
        <h2 className="text-3xl font-bold text-gradient-gold mb-6 text-center">
          Cost Comparison Over Time
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#FFD700]/30">
                <th className="text-left py-3 px-4 text-foreground font-bold">Provider</th>
                <th className="text-right py-3 px-4 text-foreground/70">6 Months</th>
                <th className="text-right py-3 px-4 text-foreground/70">1 Year</th>
                <th className="text-right py-3 px-4 text-foreground/70">2 Years</th>
                <th className="text-right py-3 px-4 text-foreground/70">5 Years</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#FFD700]/10 bg-[#FFD700]/10">
                <td className="py-3 px-4 font-bold text-[#FFD700]">BTCindexer</td>
                <td className="py-3 px-4 text-right text-[#FFD700] font-bold">$50</td>
                <td className="py-3 px-4 text-right text-[#FFD700] font-bold">$50</td>
                <td className="py-3 px-4 text-right text-[#FFD700] font-bold">$50</td>
                <td className="py-3 px-4 text-right text-[#FFD700] font-bold">$50</td>
              </tr>
              <tr className="border-b border-[#FFD700]/10">
                <td className="py-3 px-4 text-foreground">BlockCypher (Basic)</td>
                <td className="py-3 px-4 text-right text-foreground/70">$510</td>
                <td className="py-3 px-4 text-right text-foreground/70">$1,020</td>
                <td className="py-3 px-4 text-right text-foreground/70">$2,040</td>
                <td className="py-3 px-4 text-right text-foreground/70">$5,100</td>
              </tr>
              <tr className="border-b border-[#FFD700]/10">
                <td className="py-3 px-4 text-foreground">Blockchain.com (Est.)</td>
                <td className="py-3 px-4 text-right text-foreground/70">$600+</td>
                <td className="py-3 px-4 text-right text-foreground/70">$1,200+</td>
                <td className="py-3 px-4 text-right text-foreground/70">$2,400+</td>
                <td className="py-3 px-4 text-right text-foreground/70">$6,000+</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-[#4CAF50]/10 border border-[#4CAF50]/30 text-center">
          <p className="text-[#4CAF50] font-bold text-lg">
            Save over $5,000 in 5 years with BTCindexer!
          </p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-3d rounded-xl p-12 text-center"
      >
        <Crown className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-gradient-gold mb-4">
          Ready to Make the Switch?
        </h2>
        <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
          Join developers who chose simplicity, transparency, and lifetime value over complex subscriptions.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/pricing"
            className="px-8 py-4 rounded-xl gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white text-lg flex items-center gap-2"
          >
            Get Started - $50 One-Time
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/playground"
            className="px-8 py-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 hover:bg-[#FFD700]/20 transition-colors font-bold text-[#FFD700] text-lg"
          >
            Try API Playground
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

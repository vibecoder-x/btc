'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check, Zap, Crown, Building2, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      icon: Zap,
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with blockchain data',
      features: [
        '1,000 requests per day',
        '30 requests per minute',
        'All API endpoints',
        'Community support',
        'Basic documentation',
      ],
      cta: 'Get Started',
      highlight: false,
      color: 'from-gray-600 to-gray-700',
    },
    {
      name: 'Premium',
      icon: Crown,
      price: '$29',
      period: 'per month',
      description: 'For developers and growing applications',
      features: [
        '50,000 requests per day',
        '200 requests per minute',
        'All API endpoints',
        'Priority support',
        'Advanced analytics',
        'Custom webhooks',
        '99.9% uptime SLA',
      ],
      cta: 'Upgrade to Premium',
      highlight: true,
      color: 'from-[#FFD700] to-[#FF6B35]',
    },
    {
      name: 'Enterprise',
      icon: Building2,
      price: 'Custom',
      period: 'contact us',
      description: 'Tailored solutions for large-scale operations',
      features: [
        'Unlimited requests',
        'Custom rate limits',
        'Dedicated infrastructure',
        'White-label API',
        '24/7 priority support',
        'Custom SLA',
        'Dedicated account manager',
        'Private blockchain node',
      ],
      cta: 'Contact Sales',
      highlight: false,
      color: 'from-blue-600 to-purple-600',
    },
  ];

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
          <h1 className="text-5xl font-bold text-gradient-gold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Access real-time Bitcoin blockchain data with flexible pricing plans designed for every need
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`card-3d rounded-2xl p-8 relative ${
                plan.highlight ? 'ring-2 ring-[#FFD700] scale-105' : ''
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-[#FFD700] to-[#FF6B35] rounded-full text-sm font-semibold text-[#0A0A0A]">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <plan.icon className="w-10 h-10 text-[#FFD700]" />
                <h3 className="text-2xl font-bold text-gradient-gold">{plan.name}</h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-[#FFD700]">{plan.price}</span>
                  {plan.price !== 'Custom' && (
                    <span className="text-foreground/50">/{plan.period}</span>
                  )}
                </div>
                {plan.price === 'Custom' && (
                  <span className="text-foreground/50">{plan.period}</span>
                )}
              </div>

              <p className="text-foreground/70 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/70">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  plan.highlight
                    ? 'gradient-gold-orange hover:glow-gold text-[#0A0A0A]'
                    : 'bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card-3d rounded-2xl p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#FFD700]/20">
                  <th className="text-left py-4 px-4 text-[#FFD700]">Feature</th>
                  <th className="text-center py-4 px-4 text-[#FFD700]">Free</th>
                  <th className="text-center py-4 px-4 text-[#FFD700]">Premium</th>
                  <th className="text-center py-4 px-4 text-[#FFD700]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-4 px-4 text-foreground">Requests per day</td>
                  <td className="py-4 px-4 text-center text-foreground/70">1,000</td>
                  <td className="py-4 px-4 text-center text-foreground/70">50,000</td>
                  <td className="py-4 px-4 text-center text-foreground/70">Unlimited</td>
                </tr>
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-4 px-4 text-foreground">Rate limit (req/min)</td>
                  <td className="py-4 px-4 text-center text-foreground/70">30</td>
                  <td className="py-4 px-4 text-center text-foreground/70">200</td>
                  <td className="py-4 px-4 text-center text-foreground/70">Custom</td>
                </tr>
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-4 px-4 text-foreground">All endpoints</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-[#FFD700] mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-[#FFD700] mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-[#FFD700] mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-4 px-4 text-foreground">Webhooks</td>
                  <td className="py-4 px-4 text-center text-foreground/30">-</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-[#FFD700] mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-[#FFD700] mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-4 px-4 text-foreground">Priority support</td>
                  <td className="py-4 px-4 text-center text-foreground/30">-</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-[#FFD700] mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-[#FFD700] mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-4 px-4 text-foreground">SLA guarantee</td>
                  <td className="py-4 px-4 text-center text-foreground/30">-</td>
                  <td className="py-4 px-4 text-center text-foreground/70">99.9%</td>
                  <td className="py-4 px-4 text-center text-foreground/70">Custom</td>
                </tr>
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-4 px-4 text-foreground">Dedicated node</td>
                  <td className="py-4 px-4 text-center text-foreground/30">-</td>
                  <td className="py-4 px-4 text-center text-foreground/30">-</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-[#FFD700] mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-foreground">White-label API</td>
                  <td className="py-4 px-4 text-center text-foreground/30">-</td>
                  <td className="py-4 px-4 text-center text-foreground/30">-</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-[#FFD700] mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card-3d rounded-2xl p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-foreground/70">
                Yes! You can change your plan at any time. Upgrades take effect immediately, and
                downgrades take effect at the end of your current billing cycle.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">
                What happens if I exceed my rate limit?
              </h3>
              <p className="text-foreground/70">
                If you exceed your rate limit, you'll receive HTTP 429 responses. You can either wait
                for the rate limit window to reset or upgrade to a higher plan for more capacity.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">Do you offer refunds?</h3>
              <p className="text-foreground/70">
                We offer a 14-day money-back guarantee for Premium plans. If you're not satisfied,
                contact us within 14 days of your purchase for a full refund.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-foreground/70">
                We accept all major credit cards, PayPal, and cryptocurrency payments through Coinbase
                Commerce.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Enterprise Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card-3d rounded-2xl p-8 text-center"
        >
          <Mail className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gradient-gold mb-4">Need a Custom Solution?</h2>
          <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
            For enterprise customers requiring dedicated infrastructure, custom SLAs, or private
            blockchain nodes, reach out to our team.
          </p>
          <a
            href="mailto:contact@btcindexer.com"
            className="inline-block px-8 py-4 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-semibold text-[#0A0A0A] text-lg"
          >
            contact@btcindexer.com
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

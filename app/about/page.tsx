'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, Search, ThumbsUp, ThumbsDown,
  Zap, Shield, Clock, Code, Mail, Twitter, Github, MessageCircle,
  ArrowRight, Wallet
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useConnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export default function AboutPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const { connect, connectors } = useConnect();
  const { open } = useWeb3Modal();

  // Get wallet logo based on connector name
  const getWalletLogo = (connectorName: string): string | null => {
    const name = connectorName.toLowerCase();
    if (name.includes('metamask')) return '/MetaMaskLOGO.png';
    if (name.includes('walletconnect')) return '/WALLETCONNECTlogo.png';
    if (name.includes('brave')) return '/bravewalletlogo.png';
    if (name.includes('coinbase')) return '/coinbasewalletlogo.svg';
    if (name.includes('phantom')) return '/phantomwalletlogo.jpg';
    if (name.includes('trust')) return '/trustwalletllogo.webp';
    if (name.includes('leap')) return '/leapwalletlogo.webp';
    return null;
  };

  const faqs: FAQ[] = [
    // Getting Started
    {
      category: 'Getting Started',
      question: 'What is BTC Indexer?',
      answer: 'BTC Indexer is a professional Bitcoin blockchain explorer and API service that provides real-time access to blockchain data with wallet-based authentication. No email or password required!'
    },
    {
      category: 'Getting Started',
      question: 'How do I create an account?',
      answer: 'Simply connect your Web3 wallet (Ethereum, Solana, or Bitcoin) on our homepage. Your wallet address becomes your account - no registration forms needed!'
    },
    {
      category: 'Getting Started',
      question: 'Which wallets are supported?',
      answer: 'We support MetaMask, Phantom, OKX Wallet, and other WalletConnect-compatible wallets. Both Ethereum and Solana wallets work seamlessly with our platform.'
    },
    {
      category: 'Getting Started',
      question: 'Is my wallet safe to connect?',
      answer: 'Absolutely! We never ask for your private keys or seed phrases. Wallet connection only provides your public address for authentication purposes.'
    },

    // Pricing & Plans
    {
      category: 'Pricing & Plans',
      question: "What's included in the free tier?",
      answer: 'The free tier includes 100 API requests per day, access to all blockchain data, and basic explorer features. Perfect for personal projects and testing!'
    },
    {
      category: 'Pricing & Plans',
      question: 'How does the unlimited plan work?',
      answer: 'For a one-time payment of $50 (payable in ETH, SOL, or BTC), you get lifetime unlimited API access. No monthly fees, no hidden costs, forever!'
    },
    {
      category: 'Pricing & Plans',
      question: 'Can I upgrade anytime?',
      answer: 'Yes! You can upgrade from free to unlimited at any time from your dashboard. The upgrade is instant after payment confirmation.'
    },
    {
      category: 'Pricing & Plans',
      question: 'What payment methods are accepted?',
      answer: 'We accept cryptocurrency payments in ETH, SOL, and BTC directly from your connected wallet. No credit cards or traditional payment methods needed.'
    },
    {
      category: 'Pricing & Plans',
      question: 'Do you offer refunds?',
      answer: 'Due to the nature of cryptocurrency transactions and our lifetime access model, all purchases are final. However, we offer a free tier so you can test the service before upgrading.'
    },

    // API Usage
    {
      category: 'API Usage',
      question: 'How do I authenticate API requests?',
      answer: 'Include your wallet address in the X-Wallet-Address header of your API requests. No API keys needed - your wallet is your authentication!'
    },
    {
      category: 'API Usage',
      question: 'What are the rate limits?',
      answer: 'Free tier: 100 requests/day. Unlimited tier: No rate limits! You can make as many requests as needed for your application.'
    },
    {
      category: 'API Usage',
      question: 'Where can I find API documentation?',
      answer: 'Complete API documentation is available at /docs. We provide examples in multiple programming languages including JavaScript, Python, and cURL.'
    },
    {
      category: 'API Usage',
      question: 'Can I use the API in production?',
      answer: 'Absolutely! Our API is production-ready with 99.9% uptime. Many developers use our unlimited plan for their live applications.'
    },
    {
      category: 'API Usage',
      question: 'Do you provide API support?',
      answer: 'Yes! Unlimited plan users get priority support via email and Discord. Free tier users can access our community Discord for help.'
    },

    // Technical
    {
      category: 'Technical',
      question: 'What data sources do you use?',
      answer: 'We run full Bitcoin nodes and index blockchain data in real-time. Our infrastructure ensures data accuracy and availability 24/7.'
    },
    {
      category: 'Technical',
      question: 'How often is data updated?',
      answer: 'Data is updated in real-time as new blocks are mined. Our mempool data refreshes every few seconds to show the latest unconfirmed transactions.'
    },
    {
      category: 'Technical',
      question: "What's your uptime guarantee?",
      answer: 'We maintain 99.9% uptime with redundant infrastructure and automatic failover. Check our status page at /status for real-time system health.'
    },
    {
      category: 'Technical',
      question: 'Do you have a status page?',
      answer: 'Yes! Visit /status to see real-time system status, uptime metrics, and incident history.'
    },
    {
      category: 'Technical',
      question: 'How do I report bugs?',
      answer: 'Report bugs via our GitHub issues page or email us at support@btcindexer.com. We respond to bug reports within 24 hours.'
    },

    // Security & Privacy
    {
      category: 'Security & Privacy',
      question: 'Do you store my private keys?',
      answer: 'Never! We only receive your public wallet address during connection. We cannot access your funds or private keys.'
    },
    {
      category: 'Security & Privacy',
      question: 'What data do you collect?',
      answer: 'We collect your wallet address, API usage metrics, and timestamps. We do not collect personal information, emails, or browsing data.'
    },
    {
      category: 'Security & Privacy',
      question: 'Is my data encrypted?',
      answer: 'Yes! All API communications use HTTPS/TLS encryption. Our database is encrypted at rest with industry-standard AES-256.'
    },
    {
      category: 'Security & Privacy',
      question: 'GDPR compliance?',
      answer: 'We are GDPR compliant. We collect minimal data, allow data export, and provide the right to be forgotten. Contact us to delete your account data.'
    },

    // Blockchain Specifics
    {
      category: 'Blockchain Specifics',
      question: 'What Bitcoin networks do you support?',
      answer: 'Currently we support Bitcoin mainnet. Testnet support is coming soon for developers who want to test their applications.'
    },
    {
      category: 'Blockchain Specifics',
      question: 'How far back does your data go?',
      answer: 'We index the entire Bitcoin blockchain from the genesis block (2009) to the present. Access any transaction or block in history!'
    },
    {
      category: 'Blockchain Specifics',
      question: 'Do you support other cryptocurrencies?',
      answer: 'Currently focused on Bitcoin. We plan to add support for Lightning Network, and may expand to other chains based on user demand.'
    },
  ];

  const categories = ['Getting Started', 'Pricing & Plans', 'API Usage', 'Technical', 'Security & Privacy', 'Blockchain Specifics'];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-foreground/70 mb-6">
        <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">About</span>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold text-gradient-gold mb-4">About BTC Indexer</h1>
        <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
          Real-time blockchain data, powered by wallet authentication. No passwords, no API keys, just seamless access.
        </p>
      </motion.div>

      {/* What We Do */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-gradient-gold mb-8 text-center">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Search,
              title: 'Blockchain Explorer',
              description: 'Explore transactions, addresses, and blocks with our modern, fast interface'
            },
            {
              icon: Code,
              title: 'API Access',
              description: 'RESTful API with comprehensive documentation and real-time data'
            },
            {
              icon: Clock,
              title: 'Real-time Data',
              description: 'Live mempool monitoring and instant block confirmations'
            },
            {
              icon: Shield,
              title: 'Wallet-Based Auth',
              description: 'Connect your wallet - no email, password, or API keys required'
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="card-3d p-6 text-center hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 rounded-xl gradient-gold-orange flex items-center justify-center mx-auto mb-4 glow-gold">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">{feature.title}</h3>
              <p className="text-foreground/70 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-3d p-8 mb-16"
      >
        <h2 className="text-3xl font-bold text-gradient-gold mb-6">Why Choose Us</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Zap, text: 'No email/password needed - wallet-based authentication' },
            { icon: Shield, text: 'Affordable lifetime pricing - $50 one-time payment' },
            { icon: Clock, text: 'Fast, reliable API with 99.9% uptime' },
            { icon: Code, text: 'Comprehensive documentation with code examples' },
            { icon: Search, text: 'Multi-chain wallet support (ETH, SOL, BTC)' },
            { icon: MessageCircle, text: 'Active community and priority support' },
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-5 h-5 text-[#FFD700]" />
              </div>
              <p className="text-foreground/80">{benefit.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-gradient-gold mb-4 text-center">Frequently Asked Questions</h2>
        <p className="text-foreground/70 text-center mb-8">Find answers to common questions about BTC Indexer</p>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#0A0A0A] border border-[#FFD700]/30 text-foreground placeholder-foreground/50 focus:outline-none focus:border-[#FFD700]"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {categories.map((category, catIndex) => {
            const categoryFAQs = filteredFAQs.filter(faq => faq.category === category);
            if (categoryFAQs.length === 0) return null;

            return (
              <div key={catIndex}>
                <h3 className="text-2xl font-bold text-[#FFD700] mb-4">{category}</h3>
                <div className="space-y-3">
                  {categoryFAQs.map((faq, index) => {
                    const globalIndex = faqs.indexOf(faq);
                    const isExpanded = expandedFAQ === globalIndex;

                    return (
                      <motion.div
                        key={globalIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="card-3d overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedFAQ(isExpanded ? null : globalIndex)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-[#FFD700]/5 transition-colors"
                        >
                          <span className="text-lg font-semibold text-foreground pr-4">{faq.question}</span>
                          <div className="flex-shrink-0">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-[#FFD700]" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-[#FFD700]" />
                            )}
                          </div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 pt-2">
                                <p className="text-foreground/70 leading-relaxed">{faq.answer}</p>
                                <div className="mt-4 flex items-center gap-4">
                                  <span className="text-sm text-foreground/50">Was this helpful?</span>
                                  <button className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors">
                                    <ThumbsUp className="w-4 h-4" />
                                    Yes
                                  </button>
                                  <button className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors">
                                    <ThumbsDown className="w-4 h-4" />
                                    No
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-3d p-8 mb-16"
      >
        <h2 className="text-3xl font-bold text-gradient-gold mb-6 text-center">Get in Touch</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a
            href="mailto:support@btcindexer.com"
            className="flex flex-col items-center gap-3 p-6 glassmorphism rounded-xl hover:border-[#FFD700]/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#FFD700]/10 flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-colors">
              <Mail className="w-6 h-6 text-[#FFD700]" />
            </div>
            <span className="text-foreground/70 text-sm">support@btcindexer.com</span>
          </a>

          <a
            href="https://twitter.com/btcindexer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-6 glassmorphism rounded-xl hover:border-[#FFD700]/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#FFD700]/10 flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-colors">
              <Twitter className="w-6 h-6 text-[#FFD700]" />
            </div>
            <span className="text-foreground/70 text-sm">@btcindexer</span>
          </a>

          <a
            href="https://github.com/btcindexer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-6 glassmorphism rounded-xl hover:border-[#FFD700]/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#FFD700]/10 flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-colors">
              <Github className="w-6 h-6 text-[#FFD700]" />
            </div>
            <span className="text-foreground/70 text-sm">GitHub</span>
          </a>

          <a
            href="https://discord.gg/btcindexer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-6 glassmorphism rounded-xl hover:border-[#FFD700]/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#FFD700]/10 flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-colors">
              <MessageCircle className="w-6 h-6 text-[#FFD700]" />
            </div>
            <span className="text-foreground/70 text-sm">Discord</span>
          </a>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <div className="card-3d p-12">
          <h2 className="text-3xl font-bold text-gradient-gold mb-4">Ready to get started?</h2>
          <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
            Connect your wallet and start exploring the Bitcoin blockchain with our powerful API and explorer tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowWalletModal(true)}
              className="px-8 py-4 rounded-lg gradient-gold-orange hover:glow-gold text-white font-bold transition-all flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              href="/docs"
              className="px-8 py-4 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] font-bold transition-all"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            onClick={() => setShowWalletModal(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#0F0F0F] border-2 border-[#FFD700]/30 rounded-2xl p-6 z-10 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowWalletModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
            >
              <span className="text-xl text-foreground/70">✕</span>
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gradient-gold mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-sm text-foreground/70">
                Choose your preferred wallet to get started
              </p>
            </div>

            {/* Wallet Options */}
            <div className="space-y-3 mb-6">
              {connectors
                .filter(connector => {
                  const name = connector.name.toLowerCase();
                  return !name.includes('social') && !name.includes('email') &&
                         !name.includes('auth') && !name.includes('magic') &&
                         !name.includes('injected');
                })
                .map((connector) => {
                  const logo = getWalletLogo(connector.name);
                  return (
                    <button
                      key={connector.id}
                      onClick={() => {
                        // For WalletConnect, use Web3Modal to show QR code
                        if (connector.name.toLowerCase().includes('walletconnect')) {
                          setShowWalletModal(false);
                          open();
                        } else {
                          // For other wallets, connect directly
                          connect({ connector });
                          setShowWalletModal(false);
                        }
                      }}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0A0A0A] border border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:border-[#FFD700] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        {/* Wallet Icon */}
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5">
                          {logo ? (
                            <Image
                              src={logo}
                              alt={connector.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Wallet className="w-5 h-5 text-[#FFD700]" />
                          )}
                        </div>
                        <span className="font-semibold text-foreground">
                          {connector.name}
                        </span>
                      </div>
                      <div className="text-[#FFD700] group-hover:translate-x-1 transition-transform">
                        →
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Info */}
            <div className="p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20">
              <h3 className="text-sm font-bold text-[#FFD700] mb-2">What You'll Get:</h3>
              <ul className="text-xs text-foreground/70 space-y-1">
                <li>✓ 100 free API requests per day</li>
                <li>✓ Access to your personal dashboard</li>
                <li>✓ Real-time usage statistics</li>
                <li>✓ Upgrade to unlimited anytime for $50</li>
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

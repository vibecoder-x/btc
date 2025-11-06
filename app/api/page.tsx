'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Code, Zap, Shield, Wallet, Copy, Check, Crown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useConnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

export default function ApiPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const { connect, connectors } = useConnect();
  const { open } = useWeb3Modal();

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

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

  const features = [
    {
      icon: Wallet,
      title: 'Wallet Authentication',
      description: 'Connect your wallet once, use the API everywhere',
    },
    {
      icon: Shield,
      title: 'No API Keys',
      description: 'Your wallet address is your authentication',
    },
    {
      icon: Crown,
      title: 'Unlimited Access',
      description: 'Pay $50 once, get unlimited API calls forever',
    },
  ];

  const endpoints = [
    { method: 'GET', path: '/api/block/latest', desc: 'Get latest Bitcoin block' },
    { method: 'GET', path: '/api/block/[height]', desc: 'Get block by height' },
    { method: 'GET', path: '/api/tx/[txid]', desc: 'Get transaction details' },
    { method: 'GET', path: '/api/address/[address]', desc: 'Get address information' },
    { method: 'GET', path: '/api/mempool', desc: 'Get mempool statistics' },
    { method: 'GET', path: '/api/fees/recommended', desc: 'Get recommended fee rates' },
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
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-foreground/70 mb-6">
            Wallet-based Bitcoin indexer API - Simple, secure, unlimited
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 card-3d rounded-lg">
              <span className="text-foreground/70">Base URL:</span>{' '}
              <code className="text-[#FFD700]">https://btcindexer.com/api</code>
            </div>
            <div className="px-4 py-2 card-3d rounded-lg">
              <span className="text-foreground/70">Authentication:</span>{' '}
              <span className="text-[#FF6B35]">Wallet Address</span>
            </div>
            <div className="px-4 py-2 card-3d rounded-lg">
              <span className="text-foreground/70">Free Tier:</span>{' '}
              <span className="text-[#4CAF50]">100/day</span>
            </div>
          </div>
        </div>

        {/* Pricing Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          <div className="card-3d rounded-xl p-6 border border-[#FFD700]/30">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-[#FFD700]" />
              <h3 className="text-2xl font-bold text-[#FFD700]">Free Tier</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">100 requests/day</p>
            <p className="text-foreground/70 mb-4">Perfect for testing and small projects</p>
            <button
              onClick={() => setShowWalletModal(true)}
              className="inline-block px-6 py-3 rounded-lg glassmorphism border border-[#FFD700]/30 hover:bg-[#FFD700]/10 transition-all font-semibold text-foreground text-center w-full"
            >
              Connect Wallet to Start
            </button>
          </div>

          <div className="card-3d rounded-xl p-6 border-2 border-[#FF6B35]">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-[#FF6B35]" />
              <h3 className="text-2xl font-bold text-gradient-gold">Unlimited</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">
              $50 <span className="text-lg font-normal text-foreground/50">one-time</span>
            </p>
            <p className="text-foreground/70 mb-4">Lifetime unlimited API access</p>
            <Link
              href="/pricing"
              className="inline-block px-6 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all font-bold text-white text-center w-full"
            >
              Upgrade Now
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card-3d rounded-xl p-6"
            >
              <feature.icon className="w-10 h-10 text-[#FFD700] mb-3" />
              <h3 className="text-lg font-semibold text-[#FF6B35] mb-2">
                {feature.title}
              </h3>
              <p className="text-foreground/70 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card-3d rounded-xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">Quick Start</h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">Step 1: Connect Your Wallet</h3>
              <p className="text-foreground/70 mb-3">Connect MetaMask or Phantom wallet to authenticate:</p>
              <button
                onClick={() => setShowWalletModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all font-bold text-white"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            </div>

            {/* Step 2 */}
            <div>
              <h3 className="text-xl font-bold text-[#FF6B35] mb-3">Step 2: Make API Request</h3>
              <p className="text-foreground/70 mb-3">Include your wallet address in the request header:</p>
              <div className="bg-[#0A0A0A] rounded-lg p-4 relative border border-[#FFD700]/30">
                <pre className="text-sm overflow-x-auto text-[#4CAF50]">
{`curl https://btcindexer.com/api/block/latest \\
  -H "X-Wallet-Address: 0x1234...5678"`}
                </pre>
                <button
                  onClick={() => handleCopy(`curl https://btcindexer.com/api/block/latest -H "X-Wallet-Address: 0x1234...5678"`, 'step2')}
                  className="absolute top-4 right-4 text-[#FFD700] hover:text-[#FF6B35] transition-colors"
                >
                  {copiedSection === 'step2' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <h3 className="text-xl font-bold text-[#4CAF50] mb-3">Step 3: Get Your Data</h3>
              <p className="text-foreground/70 mb-3">Free tier: 100 requests/day. Unlimited tier: no limits!</p>
              <div className="bg-[#0A0A0A] rounded-lg p-4 border border-[#FFD700]/30">
                <pre className="text-sm overflow-x-auto text-[#4CAF50]">
{`{
  "height": 870000,
  "hash": "00000000000000000001...",
  "timestamp": 1735584000,
  "tx_count": 3245,
  "size": 1432456
}`}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card-3d rounded-xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">API Endpoints</h2>
          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="border-b border-[#FFD700]/20 pb-4 last:border-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center mb-2 md:mb-0">
                    <span className="px-3 py-1 bg-[#4CAF50]/20 text-[#4CAF50] rounded-lg font-mono text-sm font-semibold mr-3">
                      {endpoint.method}
                    </span>
                    <code className="text-[#FFD700] font-mono text-sm">{endpoint.path}</code>
                  </div>
                </div>
                <p className="text-foreground/70 text-sm mt-2">{endpoint.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card-3d rounded-xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">Code Examples</h2>

          {/* JavaScript */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#FF6B35] mb-3">JavaScript / TypeScript</h3>
            <div className="bg-[#0A0A0A] rounded-lg p-4 relative border border-[#FFD700]/30">
              <pre className="text-sm overflow-x-auto text-[#4CAF50]">
{`const walletAddress = '0x1234...5678'; // Your connected wallet

const response = await fetch('https://btcindexer.com/api/block/latest', {
  headers: {
    'X-Wallet-Address': walletAddress
  }
});

const data = await response.json();
console.log(data);`}
              </pre>
              <button
                onClick={() => handleCopy(`const response = await fetch('https://btcindexer.com/api/block/latest', {
  headers: { 'X-Wallet-Address': walletAddress }
});`, 'js-example')}
                className="absolute top-4 right-4 text-[#FFD700] hover:text-[#FF6B35] transition-colors"
              >
                {copiedSection === 'js-example' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Python */}
          <div>
            <h3 className="text-xl font-bold text-[#FF6B35] mb-3">Python</h3>
            <div className="bg-[#0A0A0A] rounded-lg p-4 relative border border-[#FFD700]/30">
              <pre className="text-sm overflow-x-auto text-[#4CAF50]">
{`import requests

wallet_address = "0x1234...5678"  # Your connected wallet

response = requests.get(
    'https://btcindexer.com/api/block/latest',
    headers={'X-Wallet-Address': wallet_address}
)

data = response.json()
print(data)`}
              </pre>
              <button
                onClick={() => handleCopy(`import requests

response = requests.get(
    'https://btcindexer.com/api/block/latest',
    headers={'X-Wallet-Address': wallet_address}
)`, 'py-example')}
                className="absolute top-4 right-4 text-[#FFD700] hover:text-[#FF6B35] transition-colors"
              >
                {copiedSection === 'py-example' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Rate Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card-3d rounded-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gradient-gold mb-4">Rate Limits</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30">
              <div>
                <p className="font-bold text-foreground">Free Tier</p>
                <p className="text-sm text-foreground/70">No wallet or connected wallet</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#FFD700]">100</p>
                <p className="text-xs text-foreground/70">requests/day</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#FF6B35]/10 border border-[#FF6B35]/30">
              <div>
                <p className="font-bold text-foreground">Unlimited Tier</p>
                <p className="text-sm text-foreground/70">$50 one-time payment</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#FF6B35]">∞</p>
                <p className="text-xs text-foreground/70">unlimited</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card-3d rounded-xl p-8 text-center"
        >
          <Code className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gradient-gold mb-4">Ready to Start?</h2>
          <p className="text-foreground/70 mb-6">
            Connect your wallet and start making API calls today
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowWalletModal(true)}
              className="px-6 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white"
            >
              Connect Wallet
            </button>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-lg glassmorphism hover:bg-[#FFD700]/10 transition-all duration-300 font-semibold text-foreground"
            >
              View Pricing
            </Link>
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
      </motion.div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check, Code, Book, Zap, Shield, Wallet, Bitcoin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useConnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useBitcoinWallet } from '@/hooks/useBitcoinWallet';

export default function DocsPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletType, setWalletType] = useState<'evm' | 'bitcoin'>('evm');

  const { connect, connectors } = useConnect();
  const { open } = useWeb3Modal();

  // Bitcoin wallet
  const {
    connectXverse,
    connectLeather,
    connectUnisat,
  } = useBitcoinWallet();

  // Handle Bitcoin wallet connection
  const handleBitcoinWalletConnect = async (walletName: string) => {
    try {
      if (walletName === 'Xverse') {
        await connectXverse();
      } else if (walletName === 'Leather') {
        await connectLeather();
      } else if (walletName === 'Unisat') {
        await connectUnisat();
      }
      setShowWalletModal(false);
    } catch (err: any) {
      console.error('Failed to connect Bitcoin wallet:', err);
      alert(err.message || 'Failed to connect wallet');
    }
  };

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

  const codeExamples = {
    curl: `# Include your wallet address in the header
curl https://btcindexer.com/api/block/latest \\
  -H "X-Wallet-Address: 0x1234...5678"`,
    javascript: `// Include wallet address in request
const walletAddress = '0x1234...5678'; // Your connected wallet

fetch('https://btcindexer.com/api/block/latest', {
  headers: {
    'X-Wallet-Address': walletAddress
  }
})
  .then(response => response.json())
  .then(data => console.log(data));`,
    python: `import requests

# Include wallet address in headers
wallet_address = "0x1234...5678"  # Your connected wallet

response = requests.get(
    'https://btcindexer.com/api/block/latest',
    headers={'X-Wallet-Address': wallet_address}
)

data = response.json()
print(data)`,
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
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gradient-gold mb-4">Documentation</h1>
          <p className="text-xl text-foreground/70">
            Everything you need to know about using the Bitcoin Indexer API with wallet authentication
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card-3d rounded-xl p-6"
          >
            <Book className="w-8 h-8 text-[#FFD700] mb-3" />
            <h3 className="text-xl font-bold text-[#FFD700] mb-2">Wallet Authentication</h3>
            <p className="text-foreground/70">Your wallet is your login - no passwords or API keys</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="card-3d rounded-xl p-6"
          >
            <Zap className="w-8 h-8 text-[#FF6B35] mb-3" />
            <h3 className="text-xl font-bold text-[#FF6B35] mb-2">Free & Unlimited Tiers</h3>
            <p className="text-foreground/70">Start free with 100/day or go unlimited for $50 once</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="card-3d rounded-xl p-6"
          >
            <Shield className="w-8 h-8 text-[#FFD700] mb-3" />
            <h3 className="text-xl font-bold text-[#FFD700] mb-2">Usage Dashboard</h3>
            <p className="text-foreground/70">Track your API usage and plan in real-time</p>
          </motion.div>
        </div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card-3d rounded-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">Getting Started</h2>
          <p className="text-foreground/70 mb-6">
            Connect your wallet and start making API calls with simple authentication using your wallet address.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">1. Connect Your Wallet</h3>
              <p className="text-foreground/70 mb-3">
                Click{' '}
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="text-[#FFD700] hover:text-[#FF6B35] underline"
                >
                  here to connect your wallet
                </button>{' '}
                or use the button below. No email or password needed.
              </p>
              <button
                onClick={() => setShowWalletModal(true)}
                className="px-6 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all font-bold text-white"
              >
                Connect Wallet
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">2. Access Your Dashboard</h3>
              <p className="text-foreground/70 mb-3">
                Once connected, you'll see your personal dashboard with:
              </p>
              <ul className="list-disc list-inside text-foreground/70 space-y-2 ml-4">
                <li>Current plan (Free or Unlimited)</li>
                <li>Daily API usage (100 requests/day on Free tier)</li>
                <li>Upgrade option to Unlimited for $50 one-time payment</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">3. Make API Requests</h3>
              <p className="text-foreground/70 mb-3">
                Include your wallet address in the request header:
              </p>
              <div className="bg-black/50 rounded-lg p-4 font-mono text-sm relative">
                <code className="text-[#FFD700]">{codeExamples.curl}</code>
                <button
                  onClick={() => handleCopy(codeExamples.curl, 'curl')}
                  className="absolute top-4 right-4 text-[#FFD700] hover:text-[#FF6B35] transition-colors"
                >
                  {copiedSection === 'curl' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">4. Track Your Usage</h3>
              <p className="text-foreground/70 mb-3">
                Free tier users can make 100 requests per day. Your dashboard shows real-time usage stats.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">5. Upgrade to Unlimited (Optional)</h3>
              <p className="text-foreground/70 mb-3">
                Need more? Pay $50 once on the{' '}
                <Link href="/pricing" className="text-[#FFD700] hover:text-[#FF6B35] underline">
                  pricing page
                </Link>{' '}
                for lifetime unlimited API access. Payment accepted via Base, Polygon, Ethereum, Bitcoin, or Solana.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Base URL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card-3d rounded-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">Base URL</h2>
          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm relative">
            <code className="text-[#FFD700]">https://btcindexer.com/api/</code>
            <button
              onClick={() => handleCopy('https://btcindexer.com/api/', 'baseurl')}
              className="absolute top-4 right-4 text-[#FFD700] hover:text-[#FF6B35] transition-colors"
            >
              {copiedSection === 'baseurl' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Pricing Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card-3d rounded-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">Pricing Tiers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-[#FFD700]/10 border-2 border-[#FFD700]/30">
              <span className="text-3xl block mb-3">⚡</span>
              <h3 className="text-2xl font-bold text-[#FFD700] mb-2">Free Tier</h3>
              <p className="text-3xl font-bold text-foreground mb-3">100 requests/day</p>
              <p className="text-sm text-foreground/70 mb-4">
                Perfect for testing, small projects, and development
              </p>
              <ul className="space-y-2 text-sm text-foreground/70">
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
                <li className="flex items-center gap-2">
                  <span className="text-[#4CAF50]">✓</span>
                  No credit card required
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-[#FF6B35]/10 border-2 border-[#FF6B35]">
              <span className="text-3xl block mb-3">👑</span>
              <h3 className="text-2xl font-bold text-gradient-gold mb-2">Unlimited Tier</h3>
              <p className="text-3xl font-bold text-foreground mb-1">
                $50 <span className="text-base font-normal text-foreground/50">one-time</span>
              </p>
              <p className="text-sm text-foreground/70 mb-4">
                Lifetime unlimited access - pay once, use forever
              </p>
              <ul className="space-y-2 text-sm text-foreground/70">
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
                <li className="flex items-center gap-2">
                  <span className="text-[#4CAF50]">✓</span>
                  Multi-chain payment (Base, ETH, BTC, SOL, Polygon)
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card-3d rounded-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">Code Examples</h2>

          {/* JavaScript */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#FFD700] mb-3">JavaScript</h3>
            <div className="bg-black/50 rounded-lg p-4 relative">
              <pre className="text-sm overflow-x-auto">
                <code className="text-[#FFD700]">{codeExamples.javascript}</code>
              </pre>
              <button
                onClick={() => handleCopy(codeExamples.javascript, 'javascript')}
                className="absolute top-4 right-4 text-[#FFD700] hover:text-[#FF6B35] transition-colors"
              >
                {copiedSection === 'javascript' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Python */}
          <div>
            <h3 className="text-xl font-bold text-[#FFD700] mb-3">Python</h3>
            <div className="bg-black/50 rounded-lg p-4 relative">
              <pre className="text-sm overflow-x-auto">
                <code className="text-[#FFD700]">{codeExamples.python}</code>
              </pre>
              <button
                onClick={() => handleCopy(codeExamples.python, 'python')}
                className="absolute top-4 right-4 text-[#FFD700] hover:text-[#FF6B35] transition-colors"
              >
                {copiedSection === 'python' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* HTTP Status Codes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card-3d rounded-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">HTTP Status Codes</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#FFD700] font-mono">200 OK</span>
              </div>
              <p className="text-foreground/70 text-sm">Request successful, data returned</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#FFD700] font-mono">400 Bad Request</span>
              </div>
              <p className="text-foreground/70 text-sm">Invalid request parameters</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#FFD700] font-mono">401 Unauthorized</span>
              </div>
              <p className="text-foreground/70 text-sm">Missing or invalid wallet address in header</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#FFD700] font-mono">429 Too Many Requests</span>
              </div>
              <p className="text-foreground/70 text-sm">Rate limit exceeded (Free tier: 100/day). Upgrade to unlimited.</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#FFD700] font-mono">404 Not Found</span>
              </div>
              <p className="text-foreground/70 text-sm">Resource not found</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#FFD700] font-mono">500 Internal Server Error</span>
              </div>
              <p className="text-foreground/70 text-sm">Server error occurred</p>
            </div>
          </div>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="card-3d rounded-2xl p-8 text-center"
        >
          <Code className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gradient-gold mb-4">Ready to Get Started?</h2>
          <p className="text-foreground/70 mb-6">
            Connect your wallet and start using the Bitcoin Indexer API today
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowWalletModal(true)}
              className="px-8 py-4 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-semibold text-white text-lg"
            >
              Connect Wallet
            </button>
            <Link
              href="/api"
              className="px-8 py-4 rounded-lg border-2 border-[#FFD700]/30 text-foreground hover:border-[#FFD700] transition-colors font-semibold text-lg"
            >
              API Reference
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

              {/* Wallet Type Tabs */}
              <div className="flex gap-2 mb-4 p-1 rounded-lg bg-[#0A0A0A] border border-[#FFD700]/20">
                <button
                  onClick={() => setWalletType('evm')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all font-semibold text-sm ${
                    walletType === 'evm'
                      ? 'bg-[#FFD700] text-[#0A0A0A]'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Wallet className="w-4 h-4" />
                    EVM
                  </span>
                </button>
                <button
                  onClick={() => setWalletType('bitcoin')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all font-semibold text-sm ${
                    walletType === 'bitcoin'
                      ? 'bg-[#FFD700] text-[#0A0A0A]'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Bitcoin className="w-4 h-4" />
                    Bitcoin
                  </span>
                </button>
              </div>

              {/* EVM Wallet Options */}
              {walletType === 'evm' && (
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
              )}

              {/* Bitcoin Wallet Options */}
              {walletType === 'bitcoin' && (
                <div className="space-y-3 mb-6">
                  {/* Xverse Wallet */}
                  <button
                    onClick={() => handleBitcoinWalletConnect('Xverse')}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0A0A0A] border border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:border-[#FFD700] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center">
                        <Bitcoin className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <span className="font-semibold text-foreground block">Xverse</span>
                        <span className="text-xs text-foreground/50">Bitcoin & Ordinals</span>
                      </div>
                    </div>
                    <div className="text-[#FFD700] group-hover:translate-x-1 transition-transform">→</div>
                  </button>

                  {/* Leather Wallet */}
                  <button
                    onClick={() => handleBitcoinWalletConnect('Leather')}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0A0A0A] border border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:border-[#FFD700] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B4513] to-[#CD853F] flex items-center justify-center">
                        <Bitcoin className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <span className="font-semibold text-foreground block">Leather</span>
                        <span className="text-xs text-foreground/50">Bitcoin & Stacks</span>
                      </div>
                    </div>
                    <div className="text-[#FFD700] group-hover:translate-x-1 transition-transform">→</div>
                  </button>

                  {/* Unisat Wallet */}
                  <button
                    onClick={() => handleBitcoinWalletConnect('Unisat')}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0A0A0A] border border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:border-[#FFD700] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF8C00] to-[#FFD700] flex items-center justify-center">
                        <Bitcoin className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <span className="font-semibold text-foreground block">Unisat</span>
                        <span className="text-xs text-foreground/50">Bitcoin & BRC-20</span>
                      </div>
                    </div>
                    <div className="text-[#FFD700] group-hover:translate-x-1 transition-transform">→</div>
                  </button>

                  {/* Install Wallet Note */}
                  <div className="mt-4 p-3 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20">
                    <p className="text-xs text-foreground/70 text-center">
                      Don't have a Bitcoin wallet?{' '}
                      <a
                        href="https://www.xverse.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FFD700] hover:text-[#FF6B35] font-semibold"
                      >
                        Install Xverse
                      </a>
                    </p>
                  </div>
                </div>
              )}

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

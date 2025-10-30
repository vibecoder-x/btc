'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check, Code, Book, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DocsPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
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
                Visit our{' '}
                <Link href="/login" className="text-[#FFD700] hover:text-[#FF6B35] underline">
                  login page
                </Link>{' '}
                and connect your MetaMask or Phantom wallet. No email or password needed.
              </p>
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
            <Link
              href="/login"
              className="px-8 py-4 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-semibold text-white text-lg"
            >
              Connect Wallet
            </Link>
            <Link
              href="/api"
              className="px-8 py-4 rounded-lg border-2 border-[#FFD700]/30 text-foreground hover:border-[#FFD700] transition-colors font-semibold text-lg"
            >
              API Reference
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

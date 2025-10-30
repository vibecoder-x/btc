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
    curl: `# No authentication needed - just call the API
curl https://btcindexer.com/api/block/latest`,
    javascript: `// No API keys required
fetch('https://btcindexer.com/api/block/latest')
  .then(response => {
    if (response.status === 402) {
      // Payment required - get payment details
      return response.json();
    }
    return response.json();
  })
  .then(data => console.log(data));`,
    python: `import requests

# No authentication needed
response = requests.get('https://btcindexer.com/api/block/latest')

if response.status_code == 402:
    # Payment required
    payment_info = response.json()
    print(payment_info)
else:
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
            Everything you need to know about using the x402 Bitcoin Indexer API
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
            <h3 className="text-xl font-bold text-[#FFD700] mb-2">No Registration</h3>
            <p className="text-foreground/70">Start using the API immediately without signing up</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="card-3d rounded-xl p-6"
          >
            <Zap className="w-8 h-8 text-[#FF6B35] mb-3" />
            <h3 className="text-xl font-bold text-[#FF6B35] mb-2">Pay Per Use</h3>
            <p className="text-foreground/70">Only pay for the exact data you request</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="card-3d rounded-xl p-6"
          >
            <Shield className="w-8 h-8 text-[#FFD700] mb-3" />
            <h3 className="text-xl font-bold text-[#FFD700] mb-2">Multi-Chain</h3>
            <p className="text-foreground/70">Pay with Base, Solana, or Polygon</p>
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
            With x402, there's no registration or API keys needed. Just make requests and pay when you need data.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">1. Make Your First Request</h3>
              <p className="text-foreground/70 mb-3">
                Call any endpoint directly - no authentication required:
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
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">2. Handle 402 Payment Response</h3>
              <p className="text-foreground/70 mb-3">
                When data requires payment, you'll receive a 402 status with payment details:
              </p>
              <div className="bg-black/50 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto text-[#FFD700]">
{`{
  "error": "Payment Required",
  "amount": 0.02,
  "amountToken": "0.000006",
  "currency": "USD",
  "chain": "base-sepolia",
  "recipient_address": "0x0000...",
  "request_id": "abc123...",
  "expires_at": "2025-10-30T19:00:00Z"
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">3. Send Payment</h3>
              <p className="text-foreground/70 mb-3">
                Use MetaMask, Phantom, or any compatible wallet to send payment to the provided address.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">4. Submit Transaction Hash</h3>
              <p className="text-foreground/70 mb-3">
                After sending payment, submit your transaction hash for verification:
              </p>
              <div className="bg-black/50 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto text-[#FFD700]">
{`POST /api/payment/status
{
  "requestId": "abc123...",
  "txHash": "0x1234..."
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3">5. Receive Your Data</h3>
              <p className="text-foreground/70 mb-3">
                Once payment is confirmed on-chain, you'll receive the requested data automatically.
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

        {/* Supported Chains */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card-3d rounded-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">Supported Payment Chains</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#0052FF]/10 border border-[#0052FF]/20">
              <span className="text-3xl block mb-3">🔵</span>
              <h3 className="text-xl font-bold text-foreground mb-2">Base</h3>
              <p className="text-sm text-foreground/70 mb-3">
                Ethereum L2 network with low fees and fast confirmation
              </p>
              <div className="text-xs text-foreground/50">
                <div>Currency: ETH</div>
                <div>Confirmation: 10-30 seconds</div>
                <div>Wallets: MetaMask, Coinbase</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <span className="text-3xl block mb-3">⚡</span>
              <h3 className="text-xl font-bold text-foreground mb-2">Solana</h3>
              <p className="text-sm text-foreground/70 mb-3">
                Ultra-fast blockchain with instant finality
              </p>
              <div className="text-xs text-foreground/50">
                <div>Currency: SOL</div>
                <div>Confirmation: 1-2 seconds</div>
                <div>Wallets: Phantom, Solflare</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-purple-600/10 border border-purple-600/20">
              <span className="text-3xl block mb-3">💜</span>
              <h3 className="text-xl font-bold text-foreground mb-2">Polygon</h3>
              <p className="text-sm text-foreground/70 mb-3">
                Popular Ethereum sidechain with minimal fees
              </p>
              <div className="text-xs text-foreground/50">
                <div>Currency: MATIC</div>
                <div>Confirmation: 10-30 seconds</div>
                <div>Wallets: MetaMask, Trust</div>
              </div>
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

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card-3d rounded-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">Pricing</h2>
          <p className="text-foreground/70 mb-6">
            All prices are in USD and automatically converted to the native token of your chosen chain.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#FFD700]/20">
                  <th className="text-left py-3 px-4 text-[#FFD700]">Category</th>
                  <th className="text-left py-3 px-4 text-[#FFD700]">Price Range</th>
                  <th className="text-left py-3 px-4 text-[#FFD700]">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-3 px-4 text-foreground">Blocks</td>
                  <td className="py-3 px-4 text-foreground/70">$0.01 - $0.05</td>
                  <td className="py-3 px-4 text-foreground/70">Block data and lists</td>
                </tr>
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-3 px-4 text-foreground">Transactions</td>
                  <td className="py-3 px-4 text-foreground/70">$0.01 - $0.10</td>
                  <td className="py-3 px-4 text-foreground/70">Transaction details and broadcasting</td>
                </tr>
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-3 px-4 text-foreground">Addresses</td>
                  <td className="py-3 px-4 text-foreground/70">$0.03 - $0.10</td>
                  <td className="py-3 px-4 text-foreground/70">Balance and transaction history</td>
                </tr>
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-3 px-4 text-foreground">Inscriptions</td>
                  <td className="py-3 px-4 text-foreground/70">$0.05 - $0.50</td>
                  <td className="py-3 px-4 text-foreground/70">Ordinals and collections</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-foreground">Analytics</td>
                  <td className="py-3 px-4 text-foreground/70">$0.01 - $0.20</td>
                  <td className="py-3 px-4 text-foreground/70">Network stats and mempool</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Link
              href="/pricing"
              className="inline-block px-6 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-semibold text-[#0A0A0A]"
            >
              View Full Pricing
            </Link>
          </div>
        </motion.div>

        {/* HTTP Status Codes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
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
                <span className="text-[#FFD700] font-mono">202 Accepted</span>
              </div>
              <p className="text-foreground/70 text-sm">Payment detected, waiting for blockchain confirmation</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#FFD700] font-mono">402 Payment Required</span>
              </div>
              <p className="text-foreground/70 text-sm">Payment needed to access this endpoint</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#FFD700] font-mono">400 Bad Request</span>
              </div>
              <p className="text-foreground/70 text-sm">Invalid request parameters</p>
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
          transition={{ duration: 0.6, delay: 0.8 }}
          className="card-3d rounded-2xl p-8 text-center"
        >
          <Code className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gradient-gold mb-4">Need Help?</h2>
          <p className="text-foreground/70 mb-6">
            Check out our API examples or contact support for assistance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/api"
              className="px-8 py-4 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-semibold text-[#0A0A0A] text-lg"
            >
              API Examples
            </Link>
            <a
              href="mailto:support@btcindexer.com"
              className="px-8 py-4 rounded-lg border-2 border-[#FFD700]/30 text-foreground hover:border-[#FFD700] transition-colors font-semibold text-lg"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

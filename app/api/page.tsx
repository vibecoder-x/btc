'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Code, Zap, Shield, Globe, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ENDPOINT_PRICING } from '@/lib/x402/types';

export default function ApiPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const features = [
    {
      icon: Zap,
      title: 'Pay Per Use',
      description: 'No subscriptions - pay only for the data you request',
    },
    {
      icon: Shield,
      title: 'No Registration',
      description: 'No API keys, no accounts - just pay and access',
    },
    {
      icon: Globe,
      title: 'Multi-Chain',
      description: 'Pay with Base (ETH), Solana (SOL), or Polygon (MATIC)',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-neon-blue hover:text-neon-orange transition-colors duration-300 mb-6"
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
          <h1 className="text-4xl md:text-5xl font-bold text-neon-blue mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-foreground/70 mb-6">
            Pay-per-use Bitcoin indexer API powered by x402 protocol
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 glassmorphism rounded-lg">
              <span className="text-foreground/70">Base URL:</span>{' '}
              <code className="text-neon-blue">https://btcindexer.com/api</code>
            </div>
            <div className="px-4 py-2 glassmorphism rounded-lg">
              <span className="text-foreground/70">Protocol:</span>{' '}
              <span className="text-neon-green">x402</span>
            </div>
            <div className="px-4 py-2 glassmorphism rounded-lg">
              <span className="text-foreground/70">Authentication:</span>{' '}
              <span className="text-neon-orange">None Required</span>
            </div>
          </div>
        </div>

        {/* x402 Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glassmorphism rounded-xl p-8 mb-12 border border-neon-blue/30"
        >
          <h2 className="text-3xl font-bold text-neon-blue mb-4 flex items-center gap-3">
            <Zap className="w-8 h-8" />
            What is x402?
          </h2>
          <p className="text-foreground/70 mb-4 text-lg">
            x402 is a revolutionary pay-per-use protocol that eliminates subscriptions, API keys,
            and user accounts. Pay for each API call with crypto on Base, Solana, or Polygon.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
              <h3 className="font-semibold text-neon-blue mb-2">1. Make Request</h3>
              <p className="text-sm text-foreground/70">
                Call any API endpoint and receive a 402 Payment Required response
              </p>
            </div>
            <div className="p-4 rounded-lg bg-neon-orange/10 border border-neon-orange/20">
              <h3 className="font-semibold text-neon-orange mb-2">2. Pay with Crypto</h3>
              <p className="text-sm text-foreground/70">
                Send payment on your preferred chain (Base, Solana, or Polygon)
              </p>
            </div>
            <div className="p-4 rounded-lg bg-neon-green/10 border border-neon-green/20">
              <h3 className="font-semibold text-neon-green mb-2">3. Get Data</h3>
              <p className="text-sm text-foreground/70">
                Receive your data instantly after blockchain confirmation
              </p>
            </div>
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
              className="glassmorphism rounded-xl p-6"
            >
              <feature.icon className="w-10 h-10 text-neon-blue mb-3" />
              <h3 className="text-lg font-semibold text-neon-orange mb-2">
                {feature.title}
              </h3>
              <p className="text-foreground/70 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Start Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glassmorphism rounded-xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-neon-blue mb-6">Quick Start</h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div>
              <h3 className="text-xl font-bold text-neon-blue mb-3">Step 1: Make API Request</h3>
              <p className="text-foreground/70 mb-3">Call any endpoint without authentication:</p>
              <div className="bg-space-black/50 rounded-lg p-4 relative">
                <pre className="text-sm overflow-x-auto text-neon-green">
{`curl https://btcindexer.com/api/tx/abc123...`}
                </pre>
                <button
                  onClick={() => handleCopy('curl https://btcindexer.com/api/tx/abc123...', 'step1')}
                  className="absolute top-4 right-4 text-neon-blue hover:text-neon-orange transition-colors"
                >
                  {copiedSection === 'step1' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <h3 className="text-xl font-bold text-neon-orange mb-3">Step 2: Receive 402 Response</h3>
              <p className="text-foreground/70 mb-3">You'll get a payment request with all details:</p>
              <div className="bg-space-black/50 rounded-lg p-4 relative">
                <pre className="text-sm overflow-x-auto text-neon-green">
{`HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "Payment Required",
  "amount": 0.01,
  "amountToken": "0.000003",
  "currency": "USD",
  "chain": "base-sepolia",
  "recipient_address": "0x0000...",
  "request_id": "abc123...",
  "instructions": "Send 0.000003 ETH to the address",
  "expires_at": "2025-10-30T19:00:00Z",
  "scheme": "exact"
}`}
                </pre>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <h3 className="text-xl font-bold text-neon-purple mb-3">Step 3: Send Payment</h3>
              <p className="text-foreground/70 mb-3">Pay with your preferred wallet:</p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-4 rounded-lg bg-[#0052FF]/10 border border-[#0052FF]/20">
                  <span className="text-2xl block mb-2">🔵</span>
                  <p className="font-bold text-foreground mb-1">Base</p>
                  <p className="text-xs text-foreground/70">MetaMask, Coinbase Wallet</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <span className="text-2xl block mb-2">⚡</span>
                  <p className="font-bold text-foreground mb-1">Solana</p>
                  <p className="text-xs text-foreground/70">Phantom, Solflare</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-600/10 border border-purple-600/20">
                  <span className="text-2xl block mb-2">💜</span>
                  <p className="font-bold text-foreground mb-1">Polygon</p>
                  <p className="text-xs text-foreground/70">MetaMask, Trust Wallet</p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <h3 className="text-xl font-bold text-neon-green mb-3">Step 4: Submit Transaction Hash</h3>
              <p className="text-foreground/70 mb-3">After payment, submit your tx hash:</p>
              <div className="bg-space-black/50 rounded-lg p-4 relative">
                <pre className="text-sm overflow-x-auto text-neon-green">
{`curl -X POST https://btcindexer.com/api/payment/status \\
  -H "Content-Type: application/json" \\
  -d '{
    "requestId": "abc123...",
    "txHash": "0x1234..."
  }'`}
                </pre>
              </div>
            </div>

            {/* Step 5 */}
            <div>
              <h3 className="text-xl font-bold text-neon-green mb-3">Step 5: Receive Data</h3>
              <p className="text-foreground/70 mb-3">Get your data after confirmation:</p>
              <div className="bg-space-black/50 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto text-neon-green">
{`{
  "status": "CONFIRMED",
  "requestId": "abc123...",
  "txHash": "0x1234...",
  "confirmations": 3,
  "responseData": {
    "txid": "abc123...",
    "confirmations": 6,
    "size": 256,
    "fee": 0.00004567
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sample Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glassmorphism rounded-xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-neon-blue mb-6">Popular Endpoints</h2>
          <div className="space-y-6">
            {ENDPOINT_PRICING.slice(0, 6).map((endpoint, index) => (
              <div key={index} className="border-b border-neon-blue/20 pb-6 last:border-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <div className="flex items-center mb-2 md:mb-0">
                    <span className="px-3 py-1 bg-neon-green/20 text-neon-green rounded-lg font-mono text-sm font-semibold mr-3">
                      {endpoint.method}
                    </span>
                    <code className="text-neon-blue font-mono text-sm">{endpoint.path}</code>
                  </div>
                  <div className="px-3 py-1 bg-neon-orange/20 rounded-lg">
                    <span className="text-neon-orange font-semibold text-sm">
                      ${endpoint.price.toFixed(2)} USD
                    </span>
                  </div>
                </div>
                <p className="text-foreground/70 text-sm">{endpoint.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/pricing"
              className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-orange hover:glow-blue transition-all duration-300 font-semibold text-white"
            >
              View All Endpoints & Pricing
            </Link>
          </div>
        </motion.div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glassmorphism rounded-xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-neon-blue mb-6">Code Examples</h2>

          {/* JavaScript */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-neon-orange mb-3">JavaScript / TypeScript</h3>
            <div className="bg-space-black/50 rounded-lg p-4 relative">
              <pre className="text-sm overflow-x-auto text-neon-green">
{`// Make API request
const response = await fetch('https://btcindexer.com/api/tx/abc123...');

if (response.status === 402) {
  // Payment required
  const paymentData = await response.json();
  console.log('Pay:', paymentData.amountToken, paymentData.chain);
  console.log('To:', paymentData.recipient_address);
  console.log('Request ID:', paymentData.request_id);

  // After payment, submit tx hash
  const statusResponse = await fetch('https://btcindexer.com/api/payment/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requestId: paymentData.request_id,
      txHash: 'YOUR_TX_HASH'
    })
  });

  const result = await statusResponse.json();
  console.log('Data:', result.responseData);
}`}
              </pre>
              <button
                onClick={() => handleCopy(`// Make API request
const response = await fetch('https://btcindexer.com/api/tx/abc123...');

if (response.status === 402) {
  const paymentData = await response.json();
  // Payment required - see console for details
}`, 'js-example')}
                className="absolute top-4 right-4 text-neon-blue hover:text-neon-orange transition-colors"
              >
                {copiedSection === 'js-example' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Python */}
          <div>
            <h3 className="text-xl font-bold text-neon-orange mb-3">Python</h3>
            <div className="bg-space-black/50 rounded-lg p-4 relative">
              <pre className="text-sm overflow-x-auto text-neon-green">
{`import requests

# Make API request
response = requests.get('https://btcindexer.com/api/tx/abc123...')

if response.status_code == 402:
    # Payment required
    payment_data = response.json()
    print(f"Pay: {payment_data['amountToken']} on {payment_data['chain']}")
    print(f"To: {payment_data['recipient_address']}")
    print(f"Request ID: {payment_data['request_id']}")

    # After payment, submit tx hash
    status_response = requests.post(
        'https://btcindexer.com/api/payment/status',
        json={
            'requestId': payment_data['request_id'],
            'txHash': 'YOUR_TX_HASH'
        }
    )

    result = status_response.json()
    print('Data:', result['responseData'])`}
              </pre>
              <button
                onClick={() => handleCopy(`import requests

response = requests.get('https://btcindexer.com/api/tx/abc123...')

if response.status_code == 402:
    payment_data = response.json()
    # Payment required - see console for details`, 'py-example')}
                className="absolute top-4 right-4 text-neon-blue hover:text-neon-orange transition-colors"
              >
                {copiedSection === 'py-example' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Status Codes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glassmorphism rounded-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-neon-blue mb-4">HTTP Status Codes</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <code className="px-3 py-1 bg-neon-green/20 text-neon-green rounded font-mono text-sm mr-3">
                  200
                </code>
                <span className="text-foreground/70">Success - Data delivered</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <code className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded font-mono text-sm mr-3">
                  202
                </code>
                <span className="text-foreground/70">Accepted - Payment being confirmed</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <code className="px-3 py-1 bg-neon-orange/20 text-neon-orange rounded font-mono text-sm mr-3">
                  402
                </code>
                <span className="text-foreground/70">Payment Required - Send crypto payment</span>
              </div>
            </div>
            <div className="flex items-center">
              <code className="px-3 py-1 bg-red-500/20 text-red-400 rounded font-mono text-sm mr-3">
                400
              </code>
              <span className="text-foreground/70">Bad Request</span>
            </div>
            <div className="flex items-center">
              <code className="px-3 py-1 bg-red-500/20 text-red-400 rounded font-mono text-sm mr-3">
                404
              </code>
              <span className="text-foreground/70">Not Found</span>
            </div>
            <div className="flex items-center">
              <code className="px-3 py-1 bg-red-500/20 text-red-400 rounded font-mono text-sm mr-3">
                500
              </code>
              <span className="text-foreground/70">Internal Server Error</span>
            </div>
          </div>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glassmorphism rounded-xl p-8 text-center"
        >
          <Code className="w-16 h-16 text-neon-blue mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neon-blue mb-4">Need Help?</h2>
          <p className="text-foreground/70 mb-6">
            Have questions about our x402 payment system or API?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/docs"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-orange hover:glow-blue transition-all duration-300 font-semibold text-white"
            >
              Full Documentation
            </Link>
            <a
              href="mailto:support@btcindexer.com"
              className="px-6 py-3 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-all duration-300 font-semibold text-foreground"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Code, Database, Zap, Shield, Bitcoin, Lock, Users } from 'lucide-react';
import Link from 'next/link';
import { X402Example } from '@/components/X402Example';

export default function ApiPage() {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/block/{height}',
      price: 20,
      description: 'Get complete block data by height or hash',
      example: '/api/block/820450',
      response: `{
  "height": 820450,
  "hash": "00000000000000000003...",
  "timestamp": "2024-01-15T10:30:00Z",
  "size": 1234567,
  "txCount": 2456
}`,
    },
    {
      method: 'GET',
      path: '/api/tx/{txid}',
      price: 10,
      description: 'Get transaction details by transaction ID',
      example: '/api/tx/a1b2c3d4...',
      response: `{
  "txid": "a1b2c3d4e5f6...",
  "confirmations": 6,
  "size": 256,
  "fee": 0.00004567
}`,
    },
    {
      method: 'GET',
      path: '/api/address/{address}',
      price: 50,
      description: 'Get address balance and transaction history',
      example: '/api/address/1A1zP1...',
      response: `{
  "address": "1A1zP1eP5QG...",
  "balance": 1.23456789,
  "txCount": 127
}`,
    },
    {
      method: 'GET',
      path: '/api/mempool',
      price: 50,
      description: 'Get current mempool statistics',
      example: '/api/mempool',
      response: `{
  "size": 142000000,
  "txCount": 10523,
  "avgFee": 24
}`,
    },
    {
      method: 'GET',
      path: '/api/inscription/{id}',
      price: 100,
      description: 'Get Bitcoin Ordinals inscription details',
      example: '/api/inscription/abc123...',
      response: `{
  "inscription_id": "abc123...",
  "inscription_number": 12345678,
  "content_type": "image/png",
  "owner": "bc1q..."
}`,
    },
    {
      method: 'GET',
      path: '/api/fees/recommended',
      price: 10,
      description: 'Get recommended fee rates for transactions',
      example: '/api/fees/recommended',
      response: `{
  "fastest": 45,
  "halfHour": 30,
  "hour": 20
}`,
    },
  ];

  const features = [
    {
      icon: Bitcoin,
      title: 'Pay Per Use',
      description: 'No subscriptions - pay only for what you use with Bitcoin',
    },
    {
      icon: Lock,
      title: 'No Registration',
      description: 'No API keys, no accounts - just pay and access',
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Lightning-fast response times with 99.9% uptime',
    },
    {
      icon: Users,
      title: 'Fair Pricing',
      description: 'Transparent micro-payments starting at 10 sats per query',
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Inscription-based authentication on Bitcoin',
    },
    {
      icon: Database,
      title: 'Real-time Data',
      description: 'Always up-to-date blockchain information',
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
              <code className="text-neon-blue">https://btcindexer.com</code>
            </div>
            <div className="px-4 py-2 glassmorphism rounded-lg">
              <span className="text-foreground/70">Protocol:</span>{' '}
              <span className="text-neon-green">x402</span>
            </div>
            <div className="px-4 py-2 glassmorphism rounded-lg">
              <span className="text-foreground/70">Authentication:</span>{' '}
              <span className="text-neon-orange">Bitcoin Inscriptions</span>
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
            <Bitcoin className="w-8 h-8" />
            What is x402?
          </h2>
          <p className="text-foreground/70 mb-4 text-lg">
            x402 is a revolutionary pay-per-use protocol that eliminates subscriptions, API keys,
            and user accounts. Instead, you pay for each API call with Bitcoin inscriptions.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
              <h3 className="font-semibold text-neon-blue mb-2">1. Make Request</h3>
              <p className="text-sm text-foreground/70">
                Call any API endpoint and receive a 402 Payment Required response with payment details
              </p>
            </div>
            <div className="p-4 rounded-lg bg-neon-orange/10 border border-neon-orange/20">
              <h3 className="font-semibold text-neon-orange mb-2">2. Pay with Bitcoin</h3>
              <p className="text-sm text-foreground/70">
                Create an inscription with the provided data and send it to the payment address
              </p>
            </div>
            <div className="p-4 rounded-lg bg-neon-green/10 border border-neon-green/20">
              <h3 className="font-semibold text-neon-green mb-2">3. Get Data</h3>
              <p className="text-sm text-foreground/70">
                Once payment is confirmed, your data is delivered automatically
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

        {/* Endpoints */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl font-bold text-neon-blue mb-6">Endpoints</h2>
          {endpoints.map((endpoint, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glassmorphism rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex items-center mb-3 md:mb-0">
                  <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-lg font-mono text-sm font-semibold mr-3">
                    {endpoint.method}
                  </span>
                  <code className="text-neon-orange font-mono text-sm md:text-base">
                    {endpoint.path}
                  </code>
                </div>
                {endpoint.price && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-neon-green/20 rounded-lg">
                    <Bitcoin className="w-4 h-4 text-neon-green" />
                    <span className="text-neon-green font-semibold text-sm">
                      {endpoint.price} sats
                    </span>
                  </div>
                )}
              </div>
              <p className="text-foreground/70 mb-4">{endpoint.description}</p>

              <div className="mb-4">
                <p className="text-sm text-foreground/50 mb-2">Example:</p>
                <code className="block bg-space-black/50 rounded-lg p-3 text-neon-green font-mono text-sm overflow-x-auto">
                  {endpoint.example}
                </code>
              </div>

              <div>
                <p className="text-sm text-foreground/50 mb-2">Response:</p>
                <pre className="bg-space-black/50 rounded-lg p-4 text-neon-green font-mono text-xs md:text-sm overflow-x-auto">
                  {endpoint.response}
                </pre>
              </div>
            </motion.div>
          ))}
        </div>

        {/* x402 Payment Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glassmorphism rounded-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-neon-blue mb-4">Payment Flow</h2>
          <p className="text-foreground/70 mb-6">
            Our API uses the x402 protocol for pay-per-use access. Here's how it works:
          </p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Make API Request</h3>
                <p className="text-sm text-foreground/70">
                  Call any protected endpoint. You'll receive a 402 Payment Required response with payment details.
                </p>
                <pre className="mt-2 text-xs bg-space-black/50 rounded p-3 text-neon-green overflow-x-auto">
{`HTTP/1.1 402 Payment Required
X-Payment-Amount: 10
X-Payment-Currency: SAT
X-Payment-Address: bc1q...
X-Request-ID: abc123...`}
                </pre>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-orange/20 flex items-center justify-center text-neon-orange font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Create Inscription</h3>
                <p className="text-sm text-foreground/70">
                  Use your Bitcoin wallet (Xverse, Unisat) to create an inscription with the provided data.
                </p>
                <pre className="mt-2 text-xs bg-space-black/50 rounded p-3 text-neon-green overflow-x-auto">
{`{
  "service": "btcindexer",
  "request_id": "abc123...",
  "timestamp": 1234567890
}`}
                </pre>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Send Payment</h3>
                <p className="text-sm text-foreground/70">
                  Send the inscription to the payment address. Wait for confirmation (typically 10-30 minutes).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Receive Data</h3>
                <p className="text-sm text-foreground/70">
                  Once confirmed, your requested data is delivered automatically. No polling needed!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
            <p className="text-sm text-foreground/70">
              <strong className="text-neon-blue">Note:</strong> We provide JavaScript and Python SDKs
              that handle the entire payment flow automatically, making integration seamless.
            </p>
          </div>
        </motion.div>

        {/* Status Codes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
                <span className="text-foreground/70">Accepted - Payment being processed</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <code className="px-3 py-1 bg-neon-orange/20 text-neon-orange rounded font-mono text-sm mr-3">
                  402
                </code>
                <span className="text-foreground/70">Payment Required - x402 payment needed</span>
              </div>
            </div>
            <div className="flex items-center">
              <code className="px-3 py-1 bg-neon-orange/20 text-neon-orange rounded font-mono text-sm mr-3">
                400
              </code>
              <span className="text-foreground/70">Bad Request</span>
            </div>
            <div className="flex items-center">
              <code className="px-3 py-1 bg-neon-orange/20 text-neon-orange rounded font-mono text-sm mr-3">
                404
              </code>
              <span className="text-foreground/70">Not Found</span>
            </div>
            <div className="flex items-center">
              <code className="px-3 py-1 bg-red-500/20 text-red-400 rounded font-mono text-sm mr-3">
                429
              </code>
              <span className="text-foreground/70">Rate Limit Exceeded</span>
            </div>
            <div className="flex items-center">
              <code className="px-3 py-1 bg-red-500/20 text-red-400 rounded font-mono text-sm mr-3">
                500
              </code>
              <span className="text-foreground/70">Internal Server Error</span>
            </div>
          </div>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-neon-blue mb-6">Try It Now</h2>
          <X402Example />
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glassmorphism rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-neon-blue mb-4">Need Help?</h2>
          <p className="text-foreground/70 mb-6">
            Have questions about our API? We're here to help!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-orange hover:glow-blue transition-all duration-300">
              Contact Support
            </button>
            <button className="px-6 py-3 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-all duration-300">
              View Examples
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

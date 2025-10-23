'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Code, Database, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ApiPage() {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/block/{height}',
      description: 'Get block information by height',
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
      path: '/api/stats',
      description: 'Get network statistics',
      example: '/api/stats',
      response: `{
  "hashrate": "458 EH/s",
  "difficulty": "58.47 T",
  "blockchainSize": "542 GB"
}`,
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast response times with 99.9% uptime',
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Industry-standard security with rate limiting',
    },
    {
      icon: Database,
      title: 'Real-time Data',
      description: 'Always up-to-date blockchain information',
    },
    {
      icon: Code,
      title: 'Easy Integration',
      description: 'Simple REST API with JSON responses',
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
            Access blockchain data programmatically with our REST API
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 glassmorphism rounded-lg">
              <span className="text-foreground/70">Base URL:</span>{' '}
              <code className="text-neon-blue">https://btcindexer.com</code>
            </div>
            <div className="px-4 py-2 glassmorphism rounded-lg">
              <span className="text-foreground/70">Version:</span>{' '}
              <span className="text-neon-green">v1</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

        {/* Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glassmorphism rounded-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-neon-blue mb-4">Authentication</h2>
          <p className="text-foreground/70 mb-4">
            Currently, our API is open and does not require authentication. However, we
            implement rate limiting to ensure fair usage:
          </p>
          <ul className="space-y-2 text-foreground/70">
            <li className="flex items-start">
              <span className="text-neon-orange mr-2">•</span>
              <span>Free tier: 60 requests per minute</span>
            </li>
            <li className="flex items-start">
              <span className="text-neon-orange mr-2">•</span>
              <span>Pro tier: 600 requests per minute (coming soon)</span>
            </li>
            <li className="flex items-start">
              <span className="text-neon-orange mr-2">•</span>
              <span>Enterprise: Unlimited requests (contact us)</span>
            </li>
          </ul>
        </motion.div>

        {/* Status Codes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glassmorphism rounded-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-neon-blue mb-4">Status Codes</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <code className="px-3 py-1 bg-neon-green/20 text-neon-green rounded font-mono text-sm mr-3">
                200
              </code>
              <span className="text-foreground/70">Success</span>
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

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

  const endpoints = [
    {
      method: 'GET',
      path: '/blocks/latest',
      description: 'Get the latest block information',
      response: `{
  "hash": "0000000000000000000abc...",
  "height": 820450,
  "time": "2025-10-24T18:04:00Z",
  "tx_count": 2345,
  "size": 1245678,
  "miner": "Foundry USA"
}`,
    },
    {
      method: 'GET',
      path: '/blocks/{height}',
      description: 'Get block by height',
      response: `{
  "hash": "0000000000000000000abc...",
  "height": 820450,
  "time": "2025-10-24T18:04:00Z",
  "tx_count": 2345,
  "transactions": ["txid1...", "txid2..."]
}`,
    },
    {
      method: 'GET',
      path: '/transactions/{txid}',
      description: 'Get transaction details',
      response: `{
  "txid": "abc123...",
  "block_height": 820450,
  "confirmations": 6,
  "value": 1.5,
  "fee": 0.00001234,
  "inputs": [...],
  "outputs": [...]
}`,
    },
    {
      method: 'GET',
      path: '/address/{address}',
      description: 'Get address information and balance',
      response: `{
  "address": "bc1q...",
  "balance": 1.5,
  "total_received": 10.5,
  "total_sent": 9.0,
  "tx_count": 42
}`,
    },
    {
      method: 'GET',
      path: '/mempool',
      description: 'Get current mempool statistics',
      response: `{
  "size": 142857648,
  "tx_count": 8234,
  "avg_fee": 24,
  "min_fee": 1,
  "max_fee": 250
}`,
    },
  ];

  const codeExamples = {
    curl: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.btcindexer.com/v1/blocks/latest`,
    javascript: `fetch('https://api.btcindexer.com/v1/blocks/latest', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data));`,
    python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}

response = requests.get(
    'https://api.btcindexer.com/v1/blocks/latest',
    headers=headers
)

print(response.json())`,
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
          <h1 className="text-5xl font-bold text-gradient-gold mb-4">API Documentation</h1>
          <p className="text-xl text-foreground/70">
            Real-time Bitcoin blockchain data access with simple REST APIs
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
            <h3 className="text-xl font-bold text-[#FFD700] mb-2">Simple REST API</h3>
            <p className="text-foreground/70">Easy-to-use endpoints with JSON responses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="card-3d rounded-xl p-6"
          >
            <Zap className="w-8 h-8 text-[#FF6B35] mb-3" />
            <h3 className="text-xl font-bold text-[#FF6B35] mb-2">Real-time Data</h3>
            <p className="text-foreground/70">Live blockchain updates and mempool monitoring</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="card-3d rounded-xl p-6"
          >
            <Shield className="w-8 h-8 text-[#FFD700] mb-3" />
            <h3 className="text-xl font-bold text-[#FFD700] mb-2">Secure & Reliable</h3>
            <p className="text-foreground/70">Enterprise-grade security with rate limiting</p>
          </motion.div>
        </div>

        {/* Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card-3d rounded-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">Authentication</h2>
          <p className="text-foreground/70 mb-4">
            All API requests require an API key. Include your key in the Authorization header:
          </p>
          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm relative">
            <code className="text-[#FFD700]">Authorization: Bearer YOUR_API_KEY</code>
            <button
              onClick={() => handleCopy('Authorization: Bearer YOUR_API_KEY', 'auth')}
              className="absolute top-4 right-4 text-[#FFD700] hover:text-[#FF6B35] transition-colors"
            >
              {copiedSection === 'auth' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-sm text-foreground/50 mt-4">
            Don't have an API key?{' '}
            <Link href="/pricing" className="text-[#FFD700] hover:text-[#FF6B35]">
              Get started for free
            </Link>
          </p>
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
            <code className="text-[#FFD700]">https://api.btcindexer.com/v1/</code>
            <button
              onClick={() => handleCopy('https://api.btcindexer.com/v1/', 'baseurl')}
              className="absolute top-4 right-4 text-[#FFD700] hover:text-[#FF6B35] transition-colors"
            >
              {copiedSection === 'baseurl' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card-3d rounded-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">API Endpoints</h2>
          <div className="space-y-6">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="border-b border-[#FFD700]/20 pb-6 last:border-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded-lg font-mono text-sm font-semibold">
                    {endpoint.method}
                  </span>
                  <code className="text-foreground font-mono">{endpoint.path}</code>
                </div>
                <p className="text-foreground/70 mb-4">{endpoint.description}</p>
                <div className="bg-black/50 rounded-lg p-4 relative">
                  <pre className="text-sm overflow-x-auto">
                    <code className="text-[#FFD700]">{endpoint.response}</code>
                  </pre>
                  <button
                    onClick={() => handleCopy(endpoint.response, `endpoint-${index}`)}
                    className="absolute top-4 right-4 text-[#FFD700] hover:text-[#FF6B35] transition-colors"
                  >
                    {copiedSection === `endpoint-${index}` ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
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

          {/* cURL */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#FFD700] mb-3">cURL</h3>
            <div className="bg-black/50 rounded-lg p-4 relative">
              <pre className="text-sm overflow-x-auto">
                <code className="text-[#FFD700]">{codeExamples.curl}</code>
              </pre>
              <button
                onClick={() => handleCopy(codeExamples.curl, 'curl')}
                className="absolute top-4 right-4 text-[#FFD700] hover:text-[#FF6B35] transition-colors"
              >
                {copiedSection === 'curl' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

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

        {/* Rate Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card-3d rounded-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">Rate Limits</h2>
          <p className="text-foreground/70 mb-6">
            Rate limits vary by plan. All responses include the following headers:
          </p>
          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm mb-6">
            <div className="text-[#FFD700] mb-1">X-RateLimit-Limit: 1000</div>
            <div className="text-[#FFD700] mb-1">X-RateLimit-Remaining: 999</div>
            <div className="text-[#FFD700]">X-RateLimit-Reset: 1730073600</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#FFD700]/20">
                  <th className="text-left py-3 px-4 text-[#FFD700]">Plan</th>
                  <th className="text-left py-3 px-4 text-[#FFD700]">Requests/Day</th>
                  <th className="text-left py-3 px-4 text-[#FFD700]">Rate/Minute</th>
                  <th className="text-left py-3 px-4 text-[#FFD700]">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-3 px-4 text-foreground">Free</td>
                  <td className="py-3 px-4 text-foreground/70">1,000</td>
                  <td className="py-3 px-4 text-foreground/70">30</td>
                  <td className="py-3 px-4 text-foreground/70">$0</td>
                </tr>
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-3 px-4 text-foreground">Premium</td>
                  <td className="py-3 px-4 text-foreground/70">50,000</td>
                  <td className="py-3 px-4 text-foreground/70">200</td>
                  <td className="py-3 px-4 text-foreground/70">$29/month</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-foreground">Enterprise</td>
                  <td className="py-3 px-4 text-foreground/70">Custom</td>
                  <td className="py-3 px-4 text-foreground/70">Custom</td>
                  <td className="py-3 px-4 text-foreground/70">Contact us</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Link
              href="/pricing"
              className="inline-block px-6 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-semibold text-[#0A0A0A]"
            >
              View All Plans
            </Link>
          </div>
        </motion.div>

        {/* Error Responses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="card-3d rounded-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">Error Responses</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#FFD700] font-mono">401 Unauthorized</span>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <pre className="text-sm">
                  <code className="text-[#FFD700]">{`{
  "error": "Invalid API key"
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#FFD700] font-mono">429 Too Many Requests</span>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <pre className="text-sm">
                  <code className="text-[#FFD700]">{`{
  "error": "Rate limit exceeded",
  "retry_after": 60
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#FFD700] font-mono">404 Not Found</span>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <pre className="text-sm">
                  <code className="text-[#FFD700]">{`{
  "error": "Resource not found"
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enterprise Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="card-3d rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-4">Need Enterprise Access?</h2>
          <p className="text-foreground/70 mb-6">
            For custom data access, dedicated nodes, or SLA guarantees, contact our enterprise team.
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

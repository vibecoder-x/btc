'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Copy,
  Check,
  Code,
  Zap,
  BookOpen,
  ChevronDown,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering to avoid SSR issues with window object
export const dynamic = 'force-dynamic';

interface Endpoint {
  name: string;
  method: string;
  path: string;
  description: string;
  params: {
    name: string;
    type: 'path' | 'query' | 'header';
    description: string;
    required: boolean;
    example: string;
  }[];
  example: string;
}

const API_ENDPOINTS: Endpoint[] = [
  {
    name: 'Get Transaction',
    method: 'GET',
    path: '/api/tx/[txid]',
    description: 'Retrieve details of a specific Bitcoin transaction',
    params: [
      { name: 'txid', type: 'path', description: 'Transaction ID (hash)', required: true, example: '46a59258ae4e6bdd221a02f7c63957977f4fb23729552a465aa51be01009d85e' }
    ],
    example: '/api/tx/46a59258ae4e6bdd221a02f7c63957977f4fb23729552a465aa51be01009d85e'
  },
  {
    name: 'Get Address Info',
    method: 'GET',
    path: '/api/address/[address]',
    description: 'Get information about a Bitcoin address including balance and transactions',
    params: [
      { name: 'address', type: 'path', description: 'Bitcoin address', required: true, example: 'bc1qq0e9ru8gh5amgm7fslf08clr62tkqyw5ptff0f' }
    ],
    example: '/api/address/bc1qq0e9ru8gh5amgm7fslf08clr62tkqyw5ptff0f'
  },
  {
    name: 'Get Block',
    method: 'GET',
    path: '/api/block/[height]',
    description: 'Fetch block information by height or hash',
    params: [
      { name: 'height', type: 'path', description: 'Block height or hash', required: true, example: '820448' }
    ],
    example: '/api/block/820448'
  },
  {
    name: 'Get Latest Blocks',
    method: 'GET',
    path: '/api/blocks',
    description: 'Get a list of recent blocks',
    params: [
      { name: 'startHeight', type: 'query', description: 'Starting block height (optional)', required: false, example: '921963' }
    ],
    example: '/api/blocks'
  },
  {
    name: 'Mempool Stats',
    method: 'GET',
    path: '/api/mempool',
    description: 'Get current mempool statistics',
    params: [],
    example: '/api/mempool'
  },
  {
    name: 'Fee Recommendations',
    method: 'GET',
    path: '/api/fees/recommended',
    description: 'Get recommended transaction fee rates',
    params: [],
    example: '/api/fees/recommended'
  },
  {
    name: 'Bitcoin Price',
    method: 'GET',
    path: '/api/bitcoin-price',
    description: 'Get current Bitcoin price in USD',
    params: [],
    example: '/api/bitcoin-price'
  }
];

export default function PlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(API_ENDPOINTS[0]);
  const [params, setParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [origin, setOrigin] = useState('');

  // Get origin on client side only
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const buildUrl = () => {
    let url = selectedEndpoint.path;

    // Replace path parameters
    selectedEndpoint.params
      .filter(p => p.type === 'path')
      .forEach(param => {
        const value = params[param.name] || param.example;
        url = url.replace(`[${param.name}]`, value);
      });

    // Add query parameters
    const queryParams = selectedEndpoint.params
      .filter(p => p.type === 'query' && params[p.name])
      .map(p => `${p.name}=${params[p.name]}`);

    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }

    return url;
  };

  const executeRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const url = buildUrl();
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Request failed');
      } else {
        setResponse(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to execute request');
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    const url = origin + buildUrl();
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const loadExample = () => {
    const newParams: Record<string, string> = {};
    selectedEndpoint.params.forEach(param => {
      newParams[param.name] = param.example;
    });
    setParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient-gold mb-2">API Playground</h1>
        <p className="text-foreground/70 mb-4">
          Test our Bitcoin API endpoints interactively
        </p>
        <div className="flex gap-4">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            API Docs
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white"
          >
            <Zap className="w-4 h-4" />
            Upgrade to Unlimited
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Request Builder */}
        <div>
          {/* Endpoint Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-3d rounded-xl p-6 mb-6"
          >
            <h2 className="text-xl font-bold text-[#FFD700] mb-4">Select Endpoint</h2>
            <div className="space-y-2">
              {API_ENDPOINTS.map((endpoint) => (
                <button
                  key={endpoint.path}
                  onClick={() => {
                    setSelectedEndpoint(endpoint);
                    setParams({});
                    setResponse(null);
                    setError(null);
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    selectedEndpoint.path === endpoint.path
                      ? 'bg-[#FFD700]/20 border-2 border-[#FFD700]'
                      : 'bg-[#0A0A0A] border border-[#FFD700]/30 hover:bg-[#FFD700]/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-foreground">{endpoint.name}</span>
                    <span className="text-xs px-2 py-1 rounded bg-[#FF6B35]/20 text-[#FF6B35]">
                      {endpoint.method}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70">{endpoint.description}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Parameters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-3d rounded-xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#FFD700]">Parameters</h2>
              {selectedEndpoint.params.length > 0 && (
                <button
                  onClick={loadExample}
                  className="text-sm text-[#FF6B35] hover:text-[#FFD700] transition-colors"
                >
                  Load Example
                </button>
              )}
            </div>

            {selectedEndpoint.params.length === 0 ? (
              <p className="text-sm text-foreground/50">No parameters required</p>
            ) : (
              <div className="space-y-4">
                {selectedEndpoint.params.map((param) => (
                  <div key={param.name}>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      {param.name}
                      {param.required && <span className="text-red-400 ml-1">*</span>}
                      <span className="text-xs text-foreground/50 ml-2">({param.type})</span>
                    </label>
                    <input
                      type="text"
                      value={params[param.name] || ''}
                      onChange={(e) => setParams({ ...params, [param.name]: e.target.value })}
                      placeholder={param.example}
                      className="w-full px-4 py-2 rounded-lg bg-[#0A0A0A] border border-[#FFD700]/30 text-foreground focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                    <p className="text-xs text-foreground/50 mt-1">{param.description}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Execute Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-3d rounded-xl p-6"
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground/70 mb-2">Request URL</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-[#0A0A0A] border border-[#FFD700]/30 text-sm font-mono text-[#FFD700] overflow-x-auto">
                  {origin + buildUrl()}
                </code>
                <button
                  onClick={copyUrl}
                  className="px-3 py-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
                >
                  {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={executeRequest}
              disabled={loading}
              className="w-full px-6 py-4 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  Execute Request
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Right Column - Response */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-3d rounded-xl p-6 sticky top-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#FFD700]">Response</h2>
              {response && (
                <button
                  onClick={copyResponse}
                  className="px-3 py-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors flex items-center gap-2"
                >
                  {copiedResponse ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            {!response && !error && !loading && (
              <div className="text-center py-16">
                <Code className="w-16 h-16 text-[#FFD700]/30 mx-auto mb-4" />
                <p className="text-foreground/50">
                  Execute a request to see the response
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-16">
                <Loader2 className="w-16 h-16 text-[#FFD700] animate-spin mx-auto mb-4" />
                <p className="text-foreground/70">Making request...</p>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <h3 className="font-bold text-red-400 mb-2">Error</h3>
                <p className="text-sm text-foreground/70">{error}</p>
              </div>
            )}

            {response && (
              <div className="bg-[#0A0A0A] border border-[#FFD700]/30 rounded-lg p-4 max-h-[600px] overflow-auto">
                <pre className="text-sm text-[#4CAF50] font-mono whitespace-pre-wrap">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Code Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-3d rounded-xl p-8 mt-8"
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-4">Code Examples</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* JavaScript Example */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFD700] mb-3">JavaScript / TypeScript</h3>
            <div className="bg-[#0A0A0A] border border-[#FFD700]/30 rounded-lg p-4">
              <pre className="text-sm text-foreground font-mono overflow-x-auto">
{`const response = await fetch(
  '${origin}${buildUrl()}',
  {
    headers: {
      'Content-Type': 'application/json'
    }
  }
);
const data = await response.json();
console.log(data);`}
              </pre>
            </div>
          </div>

          {/* Python Example */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFD700] mb-3">Python</h3>
            <div className="bg-[#0A0A0A] border border-[#FFD700]/30 rounded-lg p-4">
              <pre className="text-sm text-foreground font-mono overflow-x-auto">
{`import requests

response = requests.get(
    '${origin}${buildUrl()}'
)
data = response.json()
print(data)`}
              </pre>
            </div>
          </div>

          {/* cURL Example */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFD700] mb-3">cURL</h3>
            <div className="bg-[#0A0A0A] border border-[#FFD700]/30 rounded-lg p-4">
              <pre className="text-sm text-foreground font-mono overflow-x-auto">
{`curl -X GET \\
  '${origin}${buildUrl()}' \\
  -H 'Content-Type: application/json'`}
              </pre>
            </div>
          </div>

          {/* Go Example */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFD700] mb-3">Go</h3>
            <div className="bg-[#0A0A0A] border border-[#FFD700]/30 rounded-lg p-4">
              <pre className="text-sm text-foreground font-mono overflow-x-auto">
{`resp, err := http.Get(
    "${origin}${buildUrl()}"
)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()`}
              </pre>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

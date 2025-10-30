/**
 * x402 Protocol Types and Interfaces
 * Multi-chain payment support: Base, Solana, Polygon
 */

export type SupportedChain = 'base' | 'solana' | 'polygon' | 'base-sepolia';

export interface X402PaymentRequest {
  requestId: string;
  endpoint: string;
  amount: number; // in USD (will be converted to token amount)
  chain: SupportedChain;
  tokenAddress?: string; // ERC-20 contract address (for EVM chains)
  recipientAddress: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface X402Response {
  error: string;
  amount: number; // in USD
  amountToken: string; // in native token (ETH, SOL, MATIC)
  currency: 'USD';
  chain: SupportedChain;
  recipient_address: string;
  token_address?: string; // for ERC-20 payments
  request_id: string;
  instructions: string;
  expires_at: string;
  scheme: 'exact'; // x402 payment scheme
}

export interface PaymentStatus {
  requestId: string;
  status: 'PENDING' | 'DETECTED' | 'CONFIRMING' | 'CONFIRMED' | 'EXPIRED' | 'INVALID';
  txHash?: string;
  chain?: SupportedChain;
  confirmations?: number;
  paidAt?: Date;
  responseData?: any;
}

export interface EndpointPricing {
  path: string;
  price: number; // in USD
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export const ENDPOINT_PRICING: EndpointPricing[] = [
  // Block Endpoints
  { path: '/api/block/:hash', price: 0.02, method: 'GET', description: 'Get block data by hash or height' },
  { path: '/api/block/latest', price: 0.01, method: 'GET', description: 'Get latest block information' },
  { path: '/api/blocks', price: 0.05, method: 'GET', description: 'Get paginated block list' },

  // Transaction Endpoints
  { path: '/api/tx/:txid', price: 0.01, method: 'GET', description: 'Get transaction details' },
  { path: '/api/tx/:txid/raw', price: 0.01, method: 'GET', description: 'Get raw transaction hex' },
  { path: '/api/tx/broadcast', price: 0.10, method: 'POST', description: 'Broadcast transaction to network' },

  // Address Endpoints
  { path: '/api/address/:address', price: 0.05, method: 'GET', description: 'Get address balance and info' },
  { path: '/api/address/:address/transactions', price: 0.05, method: 'GET', description: 'Get transaction history (per 100 txs)' },
  { path: '/api/address/:address/utxos', price: 0.03, method: 'GET', description: 'Get UTXO list for address' },
  { path: '/api/address/:address/inscriptions', price: 0.10, method: 'GET', description: 'Get all inscriptions owned by address' },

  // Inscription Endpoints
  { path: '/api/inscription/:id', price: 0.10, method: 'GET', description: 'Get inscription details' },
  { path: '/api/inscription/:id/content', price: 0.05, method: 'GET', description: 'Get inscription content' },
  { path: '/api/inscriptions/latest', price: 0.20, method: 'GET', description: 'Get latest inscriptions' },
  { path: '/api/collection/:slug', price: 0.50, method: 'GET', description: 'Get collection data' },
  { path: '/api/collection/:slug/items', price: 0.30, method: 'GET', description: 'Get collection items' },
  { path: '/api/inscription/search', price: 0.20, method: 'GET', description: 'Search inscriptions' },

  // BRC-20 Token Endpoints
  { path: '/api/brc20/:ticker', price: 0.20, method: 'GET', description: 'Get BRC-20 token information' },
  { path: '/api/brc20/:ticker/holders', price: 0.50, method: 'GET', description: 'Get token holder list' },
  { path: '/api/address/:address/brc20', price: 0.15, method: 'GET', description: 'Get BRC-20 balances for address' },

  // Analytics Endpoints
  { path: '/api/stats/network', price: 0.10, method: 'GET', description: 'Get network statistics' },
  { path: '/api/stats/inscriptions', price: 0.20, method: 'GET', description: 'Get inscription metrics' },
  { path: '/api/mempool', price: 0.05, method: 'GET', description: 'Get mempool status' },
  { path: '/api/fees/recommended', price: 0.01, method: 'GET', description: 'Get fee recommendations' },

  // Batch Endpoints
  { path: '/api/batch/transactions', price: 0.005, method: 'POST', description: 'Batch transaction lookup (per tx)' },
  { path: '/api/batch/addresses', price: 0.03, method: 'POST', description: 'Batch address lookup (per address)' },
];

export interface X402Headers {
  'X-Payment-Amount': string;
  'X-Payment-Currency': string;
  'X-Payment-Chain': string;
  'X-Payment-Recipient': string;
  'X-Payment-Token'?: string;
  'X-Request-ID': string;
  'X-Payment-Timeout': string;
  'X-Payment-Scheme': string;
}

export interface PaymentVerification {
  isValid: boolean;
  txHash?: string;
  chain?: SupportedChain;
  confirmations?: number;
  error?: string;
}

export interface ChainConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  icon: string;
}

export const CHAIN_CONFIGS: Record<SupportedChain, ChainConfig> = {
  'base': {
    name: 'Base',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    icon: '🔵',
  },
  'base-sepolia': {
    name: 'Base Sepolia',
    chainId: 84532,
    rpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia.basescan.org',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    icon: '🔵',
  },
  'solana': {
    name: 'Solana',
    chainId: 0, // Solana doesn't use chainId
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://explorer.solana.com',
    nativeCurrency: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9,
    },
    icon: '🟣',
  },
  'polygon': {
    name: 'Polygon',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    icon: '🟪',
  },
};

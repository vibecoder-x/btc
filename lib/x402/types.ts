/**
 * x402 Protocol Types and Interfaces
 * Implementation of pay-per-use API with Bitcoin inscription authentication
 */

export interface X402PaymentRequest {
  requestId: string;
  endpoint: string;
  amount: number; // in satoshis
  paymentAddress: string;
  inscriptionData: InscriptionData;
  expiresAt: Date;
  createdAt: Date;
}

export interface InscriptionData {
  service: string;
  request_id: string;
  timestamp: number;
}

export interface X402Response {
  error: string;
  amount: number;
  currency: 'SAT' | 'BTC';
  payment_address: string;
  request_id: string;
  inscription_data: InscriptionData;
  instructions: string;
  expires_at: string;
}

export interface PaymentStatus {
  requestId: string;
  status: 'PENDING' | 'DETECTED' | 'CONFIRMING' | 'CONFIRMED' | 'EXPIRED' | 'INVALID';
  inscriptionId?: string;
  paymentTxid?: string;
  confirmations?: number;
  paidAt?: Date;
  responseData?: any;
}

export interface EndpointPricing {
  path: string;
  price: number; // in satoshis
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export const ENDPOINT_PRICING: EndpointPricing[] = [
  // Block Endpoints
  { path: '/api/block/:hash', price: 20, method: 'GET', description: 'Get block data by hash or height' },
  { path: '/api/block/latest', price: 10, method: 'GET', description: 'Get latest block information' },
  { path: '/api/blocks', price: 50, method: 'GET', description: 'Get paginated block list' },

  // Transaction Endpoints
  { path: '/api/tx/:txid', price: 10, method: 'GET', description: 'Get transaction details' },
  { path: '/api/tx/:txid/raw', price: 10, method: 'GET', description: 'Get raw transaction hex' },
  { path: '/api/tx/broadcast', price: 100, method: 'POST', description: 'Broadcast transaction to network' },

  // Address Endpoints
  { path: '/api/address/:address', price: 50, method: 'GET', description: 'Get address balance and info' },
  { path: '/api/address/:address/transactions', price: 50, method: 'GET', description: 'Get transaction history (per 100 txs)' },
  { path: '/api/address/:address/utxos', price: 30, method: 'GET', description: 'Get UTXO list for address' },
  { path: '/api/address/:address/inscriptions', price: 100, method: 'GET', description: 'Get all inscriptions owned by address' },

  // Inscription Endpoints
  { path: '/api/inscription/:id', price: 100, method: 'GET', description: 'Get inscription details' },
  { path: '/api/inscription/:id/content', price: 50, method: 'GET', description: 'Get inscription content' },
  { path: '/api/inscriptions/latest', price: 200, method: 'GET', description: 'Get latest inscriptions' },
  { path: '/api/collection/:slug', price: 500, method: 'GET', description: 'Get collection data' },
  { path: '/api/collection/:slug/items', price: 300, method: 'GET', description: 'Get collection items' },
  { path: '/api/inscription/search', price: 200, method: 'GET', description: 'Search inscriptions' },

  // BRC-20 Token Endpoints
  { path: '/api/brc20/:ticker', price: 200, method: 'GET', description: 'Get BRC-20 token information' },
  { path: '/api/brc20/:ticker/holders', price: 500, method: 'GET', description: 'Get token holder list' },
  { path: '/api/address/:address/brc20', price: 150, method: 'GET', description: 'Get BRC-20 balances for address' },

  // Analytics Endpoints
  { path: '/api/stats/network', price: 100, method: 'GET', description: 'Get network statistics' },
  { path: '/api/stats/inscriptions', price: 200, method: 'GET', description: 'Get inscription metrics' },
  { path: '/api/mempool', price: 50, method: 'GET', description: 'Get mempool status' },
  { path: '/api/fees/recommended', price: 10, method: 'GET', description: 'Get fee recommendations' },

  // Batch Endpoints
  { path: '/api/batch/transactions', price: 5, method: 'POST', description: 'Batch transaction lookup (per tx)' },
  { path: '/api/batch/addresses', price: 30, method: 'POST', description: 'Batch address lookup (per address)' },
];

export interface X402Headers {
  'X-Payment-Amount': string;
  'X-Payment-Currency': string;
  'X-Payment-Address': string;
  'X-Payment-Method': string;
  'X-Request-ID': string;
  'X-Inscription-Format': string;
  'X-Payment-Timeout': string;
}

export interface PaymentVerification {
  isValid: boolean;
  inscriptionId?: string;
  txid?: string;
  confirmations?: number;
  error?: string;
}

export interface WalletConnection {
  address: string;
  publicKey: string;
  walletType: 'xverse' | 'unisat' | 'hiro' | 'leather';
}

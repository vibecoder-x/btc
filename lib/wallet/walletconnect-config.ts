/**
 * WalletConnect Configuration
 * Supports multiple chains: Ethereum, Polygon, Base, Arbitrum, Optimism, Solana, Bitcoin
 */

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { mainnet, polygon, base, arbitrum, optimism, bsc, avalanche } from 'wagmi/chains';

// Get project ID from environment
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}

// Project metadata
const metadata = {
  name: 'BTCindexer',
  description: 'Professional Bitcoin blockchain API with wallet authentication',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://btcindexer.com',
  icons: ['https://btcindexer.com/icon.png']
};

// Define supported EVM chains
export const chains = [
  mainnet,      // Ethereum
  polygon,      // Polygon
  base,         // Base
  arbitrum,     // Arbitrum
  optimism,     // Optimism
  bsc,          // BNB Chain
  avalanche,    // Avalanche
] as const;

// Wagmi configuration for EVM chains
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
});

// Chain names mapping
export const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  137: 'Polygon',
  8453: 'Base',
  42161: 'Arbitrum',
  10: 'Optimism',
  56: 'BNB Chain',
  43114: 'Avalanche',
};

// Chain icons
export const CHAIN_ICONS: Record<number, string> = {
  1: '⟠',      // Ethereum
  137: '🟣',   // Polygon
  8453: '🔵',  // Base
  42161: '🔷', // Arbitrum
  10: '🔴',    // Optimism
  56: '🟡',    // BNB
  43114: '🔺', // Avalanche
};

// Payment token addresses for each chain (USDC, USDT, etc.)
export const PAYMENT_TOKENS: Record<number, { symbol: string; address: string; decimals: number }[]> = {
  1: [ // Ethereum
    { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
    { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  ],
  137: [ // Polygon
    { symbol: 'USDC', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6 },
    { symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 },
  ],
  8453: [ // Base
    { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 },
  ],
  42161: [ // Arbitrum
    { symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
    { symbol: 'USDT', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 },
  ],
  10: [ // Optimism
    { symbol: 'USDC', address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', decimals: 6 },
    { symbol: 'USDT', address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', decimals: 6 },
  ],
  56: [ // BNB Chain
    { symbol: 'USDC', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18 },
    { symbol: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18 },
  ],
  43114: [ // Avalanche
    { symbol: 'USDC', address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', decimals: 6 },
    { symbol: 'USDT', address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', decimals: 6 },
  ],
};

// Solana configuration
export const SOLANA_CONFIG = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
};

// Bitcoin wallet types
export type BitcoinWalletType = 'unisat' | 'xverse' | 'leather' | 'okx';

// Bitcoin wallet info
export const BITCOIN_WALLETS = {
  unisat: {
    name: 'Unisat',
    icon: '🦄',
    downloadUrl: 'https://unisat.io/',
  },
  xverse: {
    name: 'Xverse',
    icon: '❎',
    downloadUrl: 'https://www.xverse.app/',
  },
  leather: {
    name: 'Leather',
    icon: '🧳',
    downloadUrl: 'https://leather.io/',
  },
  okx: {
    name: 'OKX Wallet',
    icon: '🅾️',
    downloadUrl: 'https://www.okx.com/web3',
  },
};

// Payment pricing (in USD)
export const PAYMENT_PRICING = {
  unlimitedAccess: 50, // $50 for unlimited access forever
  perRequest: {
    free: 100, // 100 free requests per day
    paid: 0.01, // $0.01 per request after free tier
  },
};

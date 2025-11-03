/**
 * Multi-Chain Payment Hook
 * Supports Ethereum, Polygon, Base, Arbitrum, Optimism, Solana, Bitcoin
 * Payment method: Sign-to-pay (no direct transfers)
 */

'use client';

import { useState } from 'react';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';

export type ChainType = 'evm' | 'solana' | 'bitcoin';
export type PaymentTier = 'free' | 'unlimited';

interface PaymentRequest {
  tier: PaymentTier;
  amount?: number; // Amount in USD
  requestId: string;
}

interface PaymentResult {
  success: boolean;
  signature?: string;
  error?: string;
  requestId: string;
}

export function useMultiChainPayment() {
  const { address, isConnected, chain } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate payment message to sign
   */
  const generatePaymentMessage = (request: PaymentRequest): string => {
    const timestamp = Date.now();

    if (request.tier === 'unlimited') {
      return `BTCindexer - Unlimited Access Payment

Wallet: ${address}
Amount: $${request.amount || 50} USD
Plan: Unlimited API Access Forever
Request ID: ${request.requestId}
Timestamp: ${timestamp}

By signing this message, you authorize payment for unlimited API access.`;
    } else {
      return `BTCindexer - API Request Authentication

Wallet: ${address}
Request ID: ${request.requestId}
Timestamp: ${timestamp}

This signature authenticates your API request.`;
    }
  };

  /**
   * Process payment by signing a message
   * (No actual crypto transfer required)
   */
  const processPayment = async (request: PaymentRequest): Promise<PaymentResult> => {
    try {
      setIsProcessing(true);
      setError(null);

      if (!isConnected || !address) {
        throw new Error('Wallet not connected');
      }

      // Generate message to sign
      const message = generatePaymentMessage(request);

      // Request signature from user
      const signature = await signMessageAsync({ message });

      // Verify signature on backend
      const response = await fetch('/api/payment/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          signature,
          message,
          requestId: request.requestId,
          tier: request.tier,
          chainId: chain?.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Payment verification failed');
      }

      setIsProcessing(false);
      return {
        success: true,
        signature,
        requestId: request.requestId,
      };

    } catch (err: any) {
      const errorMessage = err.message || 'Payment failed';
      setError(errorMessage);
      setIsProcessing(false);
      return {
        success: false,
        error: errorMessage,
        requestId: request.requestId,
      };
    }
  };

  /**
   * Check if user has unlimited access
   */
  const checkUnlimitedAccess = async (): Promise<boolean> => {
    if (!address) return false;

    try {
      const response = await fetch(`/api/payment/check-unlimited?address=${address}`);
      const data = await response.json();
      return data.hasUnlimitedAccess || false;
    } catch {
      return false;
    }
  };

  /**
   * Get user's remaining free requests
   */
  const getRemainingRequests = async (): Promise<number> => {
    if (!address) return 0;

    try {
      const response = await fetch(`/api/payment/remaining-requests?address=${address}`);
      const data = await response.json();
      return data.remaining || 0;
    } catch {
      return 0;
    }
  };

  /**
   * Disconnect wallet
   */
  const disconnectWallet = () => {
    disconnect();
    setError(null);
  };

  return {
    // Wallet info
    address,
    isConnected,
    chain,
    chainId: chain?.id,
    chainName: chain?.name,

    // Payment functions
    processPayment,
    checkUnlimitedAccess,
    getRemainingRequests,

    // Wallet actions
    disconnectWallet,

    // State
    isProcessing,
    error,
    setError,
  };
}

// Helper function to format address
export function formatAddress(address: string | undefined): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper function to get chain icon
export function getChainIcon(chainId: number | undefined): string {
  const icons: Record<number, string> = {
    1: '⟠',      // Ethereum
    137: '🟣',   // Polygon
    8453: '🔵',  // Base
    42161: '🔷', // Arbitrum
    10: '🔴',    // Optimism
    56: '🟡',    // BNB
    43114: '🔺', // Avalanche
  };
  return chainId ? icons[chainId] || '🔗' : '🔗';
}

/**
 * x402 Payment Service
 * Multi-chain payment support: Base, Solana, Polygon
 */

import crypto from 'crypto';
import {
  X402PaymentRequest,
  X402Response,
  PaymentStatus,
  EndpointPricing,
  ENDPOINT_PRICING,
  PaymentVerification,
  SupportedChain,
  CHAIN_CONFIGS,
} from './types';

export class X402PaymentService {
  private static readonly PAYMENT_TIMEOUT_MINUTES = 10;
  private static readonly DEFAULT_CHAIN: SupportedChain = 'base-sepolia'; // Testnet for development

  // Recipient addresses for each chain (TODO: Replace with your actual addresses)
  private static readonly RECIPIENT_ADDRESSES: Record<SupportedChain, string> = {
    'base': '0x0000000000000000000000000000000000000000', // TODO: Replace
    'base-sepolia': '0x0000000000000000000000000000000000000000', // TODO: Replace
    'solana': '11111111111111111111111111111111', // TODO: Replace with Solana address
    'polygon': '0x0000000000000000000000000000000000000000', // TODO: Replace
  };

  /**
   * Generate a unique request ID
   */
  static generateRequestId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Get recipient address for a chain
   */
  static getRecipientAddress(chain: SupportedChain): string {
    return this.RECIPIENT_ADDRESSES[chain];
  }

  /**
   * Find pricing for an endpoint
   */
  static findEndpointPricing(path: string, method: string): EndpointPricing | null {
    // Normalize path to match pricing patterns
    const normalizedPath = path.replace(/\/[a-zA-Z0-9]+$/, '/:param');

    return ENDPOINT_PRICING.find(
      (pricing) => {
        const pricingPath = pricing.path.replace(/:\w+/g, '[^/]+');
        const regex = new RegExp(`^${pricingPath}$`);
        return regex.test(path) && pricing.method === method;
      }
    ) || null;
  }

  /**
   * Convert USD amount to token amount (approximate)
   * In production, fetch real-time prices from price oracles
   */
  static async convertUSDToToken(usdAmount: number, chain: SupportedChain): Promise<string> {
    // TODO: Implement real price oracle integration
    // For now, using approximate prices
    const approximatePrices: Record<SupportedChain, number> = {
      'base': 3000, // ETH price
      'base-sepolia': 3000,
      'solana': 180, // SOL price
      'polygon': 0.90, // MATIC price
    };

    const tokenPrice = approximatePrices[chain];
    const tokenAmount = usdAmount / tokenPrice;

    const decimals = CHAIN_CONFIGS[chain].nativeCurrency.decimals;
    return tokenAmount.toFixed(decimals);
  }

  /**
   * Create a payment request for an endpoint
   */
  static async createPaymentRequest(
    endpoint: string,
    method: string = 'GET',
    preferredChain?: SupportedChain
  ): Promise<X402PaymentRequest> {
    const requestId = this.generateRequestId();
    const pricing = this.findEndpointPricing(endpoint, method);

    if (!pricing) {
      throw new Error(`No pricing found for endpoint: ${method} ${endpoint}`);
    }

    const chain = preferredChain || this.DEFAULT_CHAIN;
    const recipientAddress = this.getRecipientAddress(chain);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.PAYMENT_TIMEOUT_MINUTES * 60 * 1000);

    const paymentRequest: X402PaymentRequest = {
      requestId,
      endpoint,
      amount: pricing.price, // USD
      chain,
      recipientAddress,
      expiresAt,
      createdAt: now,
    };

    // Store payment request in database
    await this.storePaymentRequest(paymentRequest);

    return paymentRequest;
  }

  /**
   * Generate x402 HTTP response
   */
  static async generateX402Response(paymentRequest: X402PaymentRequest): Promise<X402Response> {
    const tokenAmount = await this.convertUSDToToken(paymentRequest.amount, paymentRequest.chain);
    const chainConfig = CHAIN_CONFIGS[paymentRequest.chain];

    return {
      error: 'Payment Required',
      amount: paymentRequest.amount,
      amountToken: tokenAmount,
      currency: 'USD',
      chain: paymentRequest.chain,
      recipient_address: paymentRequest.recipientAddress,
      request_id: paymentRequest.requestId,
      instructions: `Send ${tokenAmount} ${chainConfig.nativeCurrency.symbol} to the recipient address on ${chainConfig.name}`,
      expires_at: paymentRequest.expiresAt.toISOString(),
      scheme: 'exact',
    };
  }

  /**
   * Verify payment by checking blockchain
   */
  static async verifyPayment(requestId: string, txHash?: string): Promise<PaymentVerification> {
    try {
      const paymentRequest = await this.getPaymentRequest(requestId);

      if (!paymentRequest) {
        return { isValid: false, error: 'Payment request not found' };
      }

      // Check if payment has expired
      if (new Date() > paymentRequest.expiresAt) {
        await this.updatePaymentStatus(requestId, 'EXPIRED');
        return { isValid: false, error: 'Payment request expired' };
      }

      if (!txHash) {
        return { isValid: false, error: 'Transaction hash required' };
      }

      // TODO: Implement actual blockchain verification
      // For each chain:
      // - Base/Polygon: Use ethers.js to verify EVM transaction
      // - Solana: Use @solana/web3.js to verify Solana transaction

      // Placeholder: In production, verify the transaction on-chain
      console.log(`Verifying payment on ${paymentRequest.chain}: ${txHash}`);

      // For now, return pending status
      return { isValid: false, error: 'Payment not yet detected' };

    } catch (error) {
      console.error('Error verifying payment:', error);
      return { isValid: false, error: 'Verification error' };
    }
  }

  /**
   * Verify EVM transaction (Base, Polygon)
   */
  static async verifyEVMTransaction(
    txHash: string,
    chain: SupportedChain,
    expectedAmount: string,
    recipientAddress: string
  ): Promise<PaymentVerification> {
    // TODO: Implement using ethers.js
    // 1. Connect to RPC
    // 2. Get transaction by hash
    // 3. Verify recipient and amount
    // 4. Check confirmations

    return { isValid: false, error: 'EVM verification not yet implemented' };
  }

  /**
   * Verify Solana transaction
   */
  static async verifySolanaTransaction(
    txHash: string,
    expectedAmount: string,
    recipientAddress: string
  ): Promise<PaymentVerification> {
    // TODO: Implement using @solana/web3.js
    // 1. Connect to Solana RPC
    // 2. Get transaction by signature
    // 3. Verify recipient and amount
    // 4. Check confirmation status

    return { isValid: false, error: 'Solana verification not yet implemented' };
  }

  /**
   * Store payment request (in-memory for now, should use database)
   */
  private static paymentRequests = new Map<string, X402PaymentRequest>();

  private static async storePaymentRequest(request: X402PaymentRequest): Promise<void> {
    // TODO: Store in database instead of memory
    this.paymentRequests.set(request.requestId, request);

    // Auto-expire after timeout
    setTimeout(() => {
      this.paymentRequests.delete(request.requestId);
    }, this.PAYMENT_TIMEOUT_MINUTES * 60 * 1000);
  }

  /**
   * Get payment request by ID
   */
  private static async getPaymentRequest(requestId: string): Promise<X402PaymentRequest | null> {
    // TODO: Get from database instead of memory
    return this.paymentRequests.get(requestId) || null;
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    requestId: string,
    status: PaymentStatus['status'],
    data?: Partial<PaymentStatus>
  ): Promise<void> {
    // TODO: Update in database
    console.log(`Payment ${requestId} status updated to ${status}`, data);
  }

  /**
   * Get payment status
   */
  static async getPaymentStatus(requestId: string): Promise<PaymentStatus | null> {
    const request = await this.getPaymentRequest(requestId);

    if (!request) {
      return null;
    }

    // Check if expired
    if (new Date() > request.expiresAt) {
      return {
        requestId,
        status: 'EXPIRED',
        chain: request.chain,
      };
    }

    // TODO: Check actual payment status from database
    return {
      requestId,
      status: 'PENDING',
      chain: request.chain,
    };
  }

  /**
   * Store response data after payment confirmation
   */
  static async storeResponseData(requestId: string, data: any): Promise<void> {
    // TODO: Store in database with expiration
    console.log(`Storing response data for request ${requestId}`);
  }

  /**
   * Get stored response data
   */
  static async getResponseData(requestId: string): Promise<any | null> {
    // TODO: Get from database
    return null;
  }

  /**
   * Calculate pricing for batch operations
   */
  static calculateBatchPricing(endpoint: string, itemCount: number): number {
    const pricing = ENDPOINT_PRICING.find((p) => p.path === endpoint);
    if (!pricing) return 0;
    return pricing.price * itemCount;
  }

  /**
   * Clean up expired payment requests
   */
  static async cleanupExpiredRequests(): Promise<void> {
    // TODO: Implement database cleanup for expired requests
    console.log('Cleaning up expired payment requests');
  }

  /**
   * Get supported chains
   */
  static getSupportedChains(): SupportedChain[] {
    return Object.keys(CHAIN_CONFIGS) as SupportedChain[];
  }

  /**
   * Get chain configuration
   */
  static getChainConfig(chain: SupportedChain) {
    return CHAIN_CONFIGS[chain];
  }
}

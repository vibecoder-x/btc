/**
 * x402 Payment Service
 * Handles payment generation, verification, and tracking
 */

import crypto from 'crypto';
import {
  X402PaymentRequest,
  X402Response,
  PaymentStatus,
  InscriptionData,
  EndpointPricing,
  ENDPOINT_PRICING,
  PaymentVerification,
} from './types';

export class X402PaymentService {
  private static readonly PAYMENT_TIMEOUT_MINUTES = 10;
  private static readonly SERVICE_NAME = 'btcindexer';

  /**
   * Generate a unique request ID
   */
  static generateRequestId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Generate a payment address (in production, this would use HD wallet derivation)
   */
  static async generatePaymentAddress(requestId: string): Promise<string> {
    // TODO: In production, implement proper HD wallet address derivation
    // For now, return a placeholder address
    // This should be replaced with actual Bitcoin address generation
    return `bc1q${crypto.createHash('sha256').update(requestId).digest('hex').substring(0, 39)}`;
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
   * Create a payment request for an endpoint
   */
  static async createPaymentRequest(
    endpoint: string,
    method: string = 'GET'
  ): Promise<X402PaymentRequest> {
    const requestId = this.generateRequestId();
    const pricing = this.findEndpointPricing(endpoint, method);

    if (!pricing) {
      throw new Error(`No pricing found for endpoint: ${method} ${endpoint}`);
    }

    const paymentAddress = await this.generatePaymentAddress(requestId);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.PAYMENT_TIMEOUT_MINUTES * 60 * 1000);

    const inscriptionData: InscriptionData = {
      service: this.SERVICE_NAME,
      request_id: requestId,
      timestamp: Math.floor(now.getTime() / 1000),
    };

    const paymentRequest: X402PaymentRequest = {
      requestId,
      endpoint,
      amount: pricing.price,
      paymentAddress,
      inscriptionData,
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
  static generateX402Response(paymentRequest: X402PaymentRequest): X402Response {
    return {
      error: 'Payment Required',
      amount: paymentRequest.amount,
      currency: 'SAT',
      payment_address: paymentRequest.paymentAddress,
      request_id: paymentRequest.requestId,
      inscription_data: paymentRequest.inscriptionData,
      instructions: 'Create inscription with provided data and send to payment address',
      expires_at: paymentRequest.expiresAt.toISOString(),
    };
  }

  /**
   * Verify payment by checking blockchain for inscription
   */
  static async verifyPayment(requestId: string): Promise<PaymentVerification> {
    try {
      // TODO: Implement actual blockchain verification
      // This should:
      // 1. Query Bitcoin node for transactions to payment address
      // 2. Extract inscription data from transactions
      // 3. Validate inscription data matches request
      // 4. Check payment amount and confirmations

      const paymentRequest = await this.getPaymentRequest(requestId);

      if (!paymentRequest) {
        return { isValid: false, error: 'Payment request not found' };
      }

      // Check if payment has expired
      if (new Date() > paymentRequest.expiresAt) {
        await this.updatePaymentStatus(requestId, 'EXPIRED');
        return { isValid: false, error: 'Payment request expired' };
      }

      // In production, implement actual blockchain check
      // For now, return pending status
      return { isValid: false, error: 'Payment not yet detected' };

    } catch (error) {
      console.error('Error verifying payment:', error);
      return { isValid: false, error: 'Verification error' };
    }
  }

  /**
   * Validate inscription data
   */
  static validateInscriptionData(
    inscriptionData: any,
    expectedRequestId: string
  ): boolean {
    if (!inscriptionData) return false;

    if (inscriptionData.service !== this.SERVICE_NAME) return false;
    if (inscriptionData.request_id !== expectedRequestId) return false;

    // Check timestamp is within acceptable window (10 minutes)
    const inscriptionTime = inscriptionData.timestamp * 1000;
    const now = Date.now();
    const timeDiff = Math.abs(now - inscriptionTime);
    const maxTimeDiff = this.PAYMENT_TIMEOUT_MINUTES * 60 * 1000;

    if (timeDiff > maxTimeDiff) return false;

    return true;
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
      };
    }

    // TODO: Check actual payment status from database
    return {
      requestId,
      status: 'PENDING',
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
}

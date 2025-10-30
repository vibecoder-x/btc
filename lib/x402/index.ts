/**
 * x402 Protocol - Main Export
 * Pay-per-use API with Bitcoin inscription authentication
 */

export * from './types';
export * from './payment-service';
export * from './middleware';
export * from './use-x402-payment';

// Re-export commonly used items
export { X402PaymentService } from './payment-service';
export { withX402Payment, createProtectedRoute } from './middleware';
export { useX402Payment, x402Fetch } from './use-x402-payment';

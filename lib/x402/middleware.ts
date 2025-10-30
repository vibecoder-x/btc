/**
 * x402 Middleware for Next.js API Routes
 * Automatically enforces payment for protected endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { X402PaymentService } from './payment-service';
import { X402Headers } from './types';

export interface X402Options {
  /** Skip payment requirement (for testing or public endpoints) */
  skipPayment?: boolean;
  /** Custom pricing override */
  customPrice?: number;
  /** Rate limit per IP */
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
}

/**
 * x402 Middleware wrapper for API routes
 */
export function withX402Payment(
  handler: (
    request: NextRequest,
    context?: any
  ) => Promise<NextResponse> | NextResponse,
  options: X402Options = {}
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      // Check if payment should be skipped
      if (options.skipPayment) {
        return await handler(request, context);
      }

      // Check for payment header (request_id from previous 402 response)
      const paymentRequestId = request.headers.get('X-Payment-Request-ID');

      if (paymentRequestId) {
        // Verify payment
        const paymentStatus = await X402PaymentService.getPaymentStatus(paymentRequestId);

        if (!paymentStatus) {
          return NextResponse.json(
            { error: 'Invalid payment request ID' },
            { status: 400 }
          );
        }

        if (paymentStatus.status === 'CONFIRMED') {
          // Payment confirmed - serve the data
          const cachedResponse = await X402PaymentService.getResponseData(paymentRequestId);

          if (cachedResponse) {
            return NextResponse.json(cachedResponse, { status: 200 });
          }

          // Generate fresh response
          const response = await handler(request, context);

          // Cache the response
          if (response.ok) {
            const data = await response.json();
            await X402PaymentService.storeResponseData(paymentRequestId, data);
            return NextResponse.json(data, { status: 200 });
          }

          return response;
        }

        if (paymentStatus.status === 'EXPIRED') {
          return NextResponse.json(
            { error: 'Payment request expired. Please create a new request.' },
            { status: 402 }
          );
        }

        // Payment still pending
        return NextResponse.json(
          {
            error: 'Payment not yet confirmed',
            status: paymentStatus.status,
            confirmations: paymentStatus.confirmations || 0,
          },
          { status: 202 } // Accepted but not yet processed
        );
      }

      // No payment provided - return 402 Payment Required
      const paymentRequest = await X402PaymentService.createPaymentRequest(
        request.nextUrl.pathname,
        request.method
      );

      const x402Response = await X402PaymentService.generateX402Response(paymentRequest);

      const headers: Record<string, string> = {
        'X-Payment-Amount': paymentRequest.amount.toString(),
        'X-Payment-Currency': 'USD',
        'X-Payment-Chain': paymentRequest.chain,
        'X-Payment-Recipient': paymentRequest.recipientAddress,
        'X-Request-ID': paymentRequest.requestId,
        'X-Payment-Timeout': '600',
        'X-Payment-Scheme': 'exact',
        'Content-Type': 'application/json',
      };

      return NextResponse.json(x402Response, {
        status: 402,
        headers,
      });

    } catch (error) {
      console.error('x402 middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Rate limiting store (in-memory, should use Redis in production)
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limiting middleware
 */
export function withRateLimit(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  options: { requests: number; windowMs: number }
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    const now = Date.now();
    const limitData = rateLimitStore.get(ip);

    if (limitData) {
      if (now < limitData.resetAt) {
        if (limitData.count >= options.requests) {
          return NextResponse.json(
            {
              error: 'Rate limit exceeded',
              retryAfter: Math.ceil((limitData.resetAt - now) / 1000),
            },
            { status: 429 }
          );
        }
        limitData.count++;
      } else {
        // Reset window
        rateLimitStore.set(ip, { count: 1, resetAt: now + options.windowMs });
      }
    } else {
      rateLimitStore.set(ip, { count: 1, resetAt: now + options.windowMs });
    }

    return await handler(request, context);
  };
}

/**
 * Combine multiple middlewares
 */
export function composeMiddleware(
  ...middlewares: Array<
    (handler: any, options?: any) => (request: NextRequest, context?: any) => Promise<NextResponse>
  >
) {
  return (handler: any) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}

/**
 * Helper to create protected API route with x402 and rate limiting
 */
export function createProtectedRoute(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse,
  options: X402Options & {
    rateLimit?: { requests: number; windowMs: number };
  } = {}
) {
  let protectedHandler = withX402Payment(handler, options);

  if (options.rateLimit) {
    protectedHandler = withRateLimit(protectedHandler, options.rateLimit);
  }

  return protectedHandler;
}

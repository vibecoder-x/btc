/**
 * Payment Status API Route
 * POST /api/payment/status - Check payment status (Free - no x402 protection)
 */

import { NextRequest, NextResponse } from 'next/server';
import { X402PaymentService } from '@/lib/x402/payment-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, txHash } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // If transaction hash is provided, verify the payment
    if (txHash) {
      const verification = await X402PaymentService.verifyPayment(requestId, txHash);

      if (verification.isValid) {
        // Payment confirmed - get response data
        const responseData = await X402PaymentService.getResponseData(requestId);
        return NextResponse.json({
          status: 'CONFIRMED',
          requestId,
          txHash: verification.txHash,
          chain: verification.chain,
          confirmations: verification.confirmations,
          responseData,
        });
      } else {
        // Payment not confirmed yet or invalid
        const status = verification.error?.includes('Waiting') || verification.error?.includes('confirmation')
          ? 'CONFIRMING'
          : verification.error?.includes('not found')
          ? 'PENDING'
          : 'INVALID';

        return NextResponse.json({
          status,
          requestId,
          txHash: verification.txHash,
          chain: verification.chain,
          confirmations: verification.confirmations,
          error: verification.error,
        });
      }
    }

    // No tx hash - just return current status
    const paymentStatus = await X402PaymentService.getPaymentStatus(requestId);

    if (!paymentStatus) {
      return NextResponse.json(
        { error: 'Payment request not found' },
        { status: 404 }
      );
    }

    // If confirmed, include the response data
    if (paymentStatus.status === 'CONFIRMED') {
      const responseData = await X402PaymentService.getResponseData(requestId);
      return NextResponse.json({
        ...paymentStatus,
        responseData,
      });
    }

    return NextResponse.json(paymentStatus);

  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}

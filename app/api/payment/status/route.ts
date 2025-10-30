/**
 * Payment Status API Route
 * POST /api/payment/status - Check payment status (Free - no x402 protection)
 */

import { NextRequest, NextResponse } from 'next/server';
import { X402PaymentService } from '@/lib/x402/payment-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Get payment status
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

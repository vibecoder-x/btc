/**
 * React Hook for x402 Payment Integration
 * Makes it easy to call paid API endpoints from client-side
 */

'use client';

import { useState, useCallback } from 'react';
import { X402Response } from './types';

interface UseX402PaymentOptions {
  onPaymentRequired?: (paymentData: X402Response) => void;
  onPaymentComplete?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useX402Payment(options: UseX402PaymentOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<X402Response | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const makeRequest = useCallback(
    async (url: string, init?: RequestInit): Promise<any> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, init);

        // Check for 402 Payment Required
        if (response.status === 402) {
          const paymentData = (await response.json()) as X402Response;
          setPaymentData(paymentData);
          setIsPaymentModalOpen(true);
          options.onPaymentRequired?.(paymentData);
          return null;
        }

        // Check for payment pending (202 Accepted)
        if (response.status === 202) {
          const data = await response.json();
          // Payment is being processed
          return data;
        }

        // Check for other errors
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Request failed');
        }

        // Success - return data
        const data = await response.json();
        options.onPaymentComplete?.(data);
        return data;

      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const closePaymentModal = useCallback(() => {
    setIsPaymentModalOpen(false);
    setPaymentData(null);
  }, []);

  const retryWithPayment = useCallback(
    async (requestId: string): Promise<any> => {
      setIsLoading(true);
      try {
        // Check payment status
        const statusResponse = await fetch('/api/payment/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId }),
        });

        const status = await statusResponse.json();

        if (status.status === 'CONFIRMED') {
          closePaymentModal();
          return status.responseData;
        }

        return status;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [closePaymentModal]
  );

  return {
    makeRequest,
    isLoading,
    paymentData,
    isPaymentModalOpen,
    closePaymentModal,
    retryWithPayment,
    error,
  };
}

/**
 * Helper function to make x402-protected API calls
 */
export async function x402Fetch(url: string, init?: RequestInit): Promise<any> {
  const response = await fetch(url, init);

  if (response.status === 402) {
    const paymentData = (await response.json()) as X402Response;
    return { requiresPayment: true, paymentData };
  }

  if (response.status === 202) {
    const data = await response.json();
    return { pending: true, ...data };
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Request failed');
  }

  return await response.json();
}

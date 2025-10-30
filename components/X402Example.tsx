'use client';

/**
 * Example component demonstrating x402 payment integration
 * Shows how to make API calls with automatic payment handling
 */

import { useState } from 'react';
import { useX402Payment } from '@/lib/x402/use-x402-payment';
import { X402PaymentModal } from './X402PaymentModal';
import { Search, Loader2 } from 'lucide-react';

export function X402Example() {
  const [txid, setTxid] = useState('');
  const [result, setResult] = useState<any>(null);

  const { makeRequest, isLoading, paymentData, isPaymentModalOpen, closePaymentModal } =
    useX402Payment({
      onPaymentRequired: (data) => {
        console.log('Payment required:', data);
      },
      onPaymentComplete: (data) => {
        console.log('Payment complete:', data);
        setResult(data);
      },
      onError: (error) => {
        console.error('Error:', error);
      },
    });

  const handleSearch = async () => {
    if (!txid.trim()) return;

    try {
      const data = await makeRequest(`/api/tx/${txid}`);
      if (data) {
        setResult(data);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="glassmorphism rounded-xl p-6">
      <h3 className="text-xl font-bold text-neon-blue mb-4">
        Try x402 Payment (Transaction Lookup)
      </h3>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={txid}
            onChange={(e) => setTxid(e.target.value)}
            placeholder="Enter transaction ID..."
            className="flex-1 px-4 py-3 rounded-lg bg-space-black/50 border border-neon-blue/30 text-foreground focus:outline-none focus:border-neon-blue"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !txid.trim()}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-orange hover:glow-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Search (10 sats)
          </button>
        </div>

        {result && (
          <div className="p-4 rounded-lg bg-space-black/50 border border-neon-green/30">
            <p className="text-sm text-neon-green mb-2">Transaction Found:</p>
            <pre className="text-xs font-mono text-foreground/70 overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {paymentData && (
        <X402PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          paymentData={paymentData}
          onPaymentComplete={(data) => {
            setResult(data);
            closePaymentModal();
          }}
        />
      )}
    </div>
  );
}

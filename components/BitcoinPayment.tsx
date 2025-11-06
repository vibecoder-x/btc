'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Loader2, AlertCircle, Bitcoin, ExternalLink } from 'lucide-react';

interface BitcoinPaymentProps {
  amount: number; // Amount in USD
  onPaymentConfirmed?: () => void;
}

export default function BitcoinPayment({ amount, onPaymentConfirmed }: BitcoinPaymentProps) {
  const [btcAmount, setBtcAmount] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);
  const [paymentAddress, setPaymentAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirming' | 'confirmed'>('pending');
  const [error, setError] = useState<string | null>(null);

  // Generate payment address and fetch BTC price
  useEffect(() => {
    const initializePayment = async () => {
      try {
        // Fetch current BTC price
        const priceRes = await fetch('/api/bitcoin-price');
        const priceData = await priceRes.json();
        const currentBtcPrice = priceData.price || 0;
        setBtcPrice(currentBtcPrice);

        // Calculate BTC amount
        if (currentBtcPrice > 0) {
          const btcValue = amount / currentBtcPrice;
          setBtcAmount(btcValue);
        }

        // Generate payment address (you'll need to implement this endpoint)
        const addressRes = await fetch('/api/payment/generate-btc-address', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, btcAmount: amount / currentBtcPrice }),
        });

        if (addressRes.ok) {
          const addressData = await addressRes.json();
          setPaymentAddress(addressData.address);

          // Start monitoring for payment
          if (addressData.address) {
            startPaymentMonitoring(addressData.address);
          }
        } else {
          setError('Failed to generate payment address');
        }
      } catch (err) {
        console.error('Error initializing payment:', err);
        setError('Failed to initialize payment');
      }
    };

    initializePayment();
  }, [amount]);

  // Monitor payment address for incoming transactions
  const startPaymentMonitoring = async (address: string) => {
    setIsMonitoring(true);

    const checkPayment = async () => {
      try {
        const res = await fetch(`/api/payment/check-btc-payment?address=${address}&expectedAmount=${btcAmount}`);
        const data = await res.json();

        if (data.received) {
          if (data.confirmed) {
            setPaymentStatus('confirmed');
            setIsMonitoring(false);
            if (onPaymentConfirmed) {
              onPaymentConfirmed();
            }
          } else {
            setPaymentStatus('confirming');
          }
        }
      } catch (err) {
        console.error('Error checking payment:', err);
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkPayment, 30000);

    // Initial check
    checkPayment();

    // Cleanup
    return () => clearInterval(interval);
  };

  const handleCopy = () => {
    if (paymentAddress) {
      navigator.clipboard.writeText(paymentAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-500/20 border border-red-500/30">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold text-lg">Error</h3>
            <p className="text-sm text-foreground/70">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentAddress) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
        <span className="ml-3 text-foreground/70">Generating payment address...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {paymentStatus === 'confirming' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-[#FFD700]/20 border border-[#FFD700]/30"
        >
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-[#FFD700] animate-spin" />
            <div>
              <h3 className="font-bold text-[#FFD700]">Payment Detected!</h3>
              <p className="text-sm text-foreground/70">Waiting for blockchain confirmation...</p>
            </div>
          </div>
        </motion.div>
      )}

      {paymentStatus === 'confirmed' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-[#4CAF50]/20 border border-[#4CAF50]/30"
        >
          <div className="flex items-center gap-3 text-[#4CAF50]">
            <Check className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">Payment Confirmed!</h3>
              <p className="text-sm text-foreground/70">Your upgrade is being processed...</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Amount */}
      <div className="text-center p-6 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bitcoin className="w-8 h-8 text-[#FFD700]" />
          <h3 className="text-3xl font-bold text-[#FFD700]">
            {btcAmount.toFixed(8)} BTC
          </h3>
        </div>
        <p className="text-sm text-foreground/60">
          ≈ ${amount} USD @ ${btcPrice.toLocaleString()}/BTC
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="p-4 bg-white rounded-xl">
          <QRCodeSVG
            value={`bitcoin:${paymentAddress}?amount=${btcAmount}`}
            size={250}
            level="H"
            includeMargin={true}
            fgColor="#000000"
          />
        </div>
      </div>

      {/* Payment Address */}
      <div>
        <p className="text-xs text-foreground/50 mb-2 text-center">Send Bitcoin to this address:</p>
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#FFD700]/20">
          <code className="text-[#FFD700] font-mono text-sm break-all block text-center">
            {paymentAddress}
          </code>
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-gold-orange hover:glow-gold transition-all duration-300 font-semibold"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5 text-white" />
            <span className="text-white">Address Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-5 h-5 text-white" />
            <span className="text-white">Copy Address</span>
          </>
        )}
      </button>

      {/* View on Blockchain */}
      <a
        href={`https://mempool.space/address/${paymentAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-[#FFD700] hover:text-[#FF6B35] transition-colors text-sm"
      >
        <ExternalLink className="w-4 h-4" />
        View on Blockchain Explorer
      </a>

      {/* Instructions */}
      <div className="p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20">
        <h4 className="font-semibold text-foreground mb-3 text-sm">Payment Instructions:</h4>
        <ol className="space-y-2 text-xs text-foreground/70">
          <li className="flex items-start gap-2">
            <span className="text-[#FFD700] font-bold">1.</span>
            <span>Scan the QR code with your Bitcoin wallet or copy the address</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FFD700] font-bold">2.</span>
            <span>Send exactly {btcAmount.toFixed(8)} BTC to the address</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FFD700] font-bold">3.</span>
            <span>Wait for blockchain confirmation (usually 10-60 minutes)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FFD700] font-bold">4.</span>
            <span>Your account will be upgraded automatically once confirmed</span>
          </li>
        </ol>
      </div>

      {/* Monitoring Status */}
      {isMonitoring && paymentStatus === 'pending' && (
        <div className="flex items-center justify-center gap-2 text-sm text-foreground/50">
          <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
          <span>Monitoring for payment...</span>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, Check, Loader2, AlertCircle, Copy, Crown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WalletService } from '@/lib/wallet/wallet-service';

type Chain = 'base' | 'polygon' | 'ethereum' | 'bitcoin' | 'solana';

const CHAIN_INFO = {
  base: {
    name: 'Base',
    icon: '🔵',
    address: '0x840820c866fA17eAa7A44f46A3F1849C7860B245',
    amount: '0.015 ETH',
    explorer: 'https://basescan.org/tx/',
  },
  polygon: {
    name: 'Polygon',
    icon: '💜',
    address: '0x840820c866fA17eAa7A44f46A3F1849C7860B245',
    amount: '50 MATIC',
    explorer: 'https://polygonscan.com/tx/',
  },
  ethereum: {
    name: 'Ethereum',
    icon: '💎',
    address: '0x840820c866fA17eAa7A44f46A3F1849C7860B245',
    amount: '0.015 ETH',
    explorer: 'https://etherscan.io/tx/',
  },
  bitcoin: {
    name: 'Bitcoin',
    icon: '₿',
    address: 'bc1qszqgzwx04mlmxuhe3aymhkvpv9ge0q2p37gny5',
    amount: '0.0005 BTC',
    explorer: 'https://mempool.space/tx/',
  },
  solana: {
    name: 'Solana',
    icon: '⚡',
    address: 'FdhXPvUqCjKVmatszBszzYKUcCBmf8zwqsgPcPKFm9Mw',
    amount: '0.25 SOL',
    explorer: 'https://solscan.io/tx/',
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedChain, setSelectedChain] = useState<Chain>('base');
  const [walletAccount, setWalletAccount] = useState<any>(null);
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

  useEffect(() => {
    // Check for connected wallet
    const savedAccount = WalletService.getSavedAccount();
    setWalletAccount(savedAccount);
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CHAIN_INFO[selectedChain].address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayWithWallet = async () => {
    if (!walletAccount) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsPaying(true);
      setError(null);

      const chainInfo = CHAIN_INFO[selectedChain];
      let transactionHash = '';

      // Handle payment based on chain
      if (selectedChain === 'solana') {
        // Solana payment via Phantom
        if (!window.solana?.isPhantom) {
          setError('Phantom wallet not found. Please install Phantom.');
          return;
        }

        const transaction = await window.solana.request({
          method: 'transfer',
          params: {
            to: chainInfo.address,
            amount: parseFloat(chainInfo.amount) * 1e9, // Convert SOL to lamports
          },
        });

        transactionHash = transaction.signature;

      } else if (selectedChain === 'bitcoin') {
        // Bitcoin requires manual entry
        setShowManualEntry(true);
        setIsPaying(false);
        return;

      } else {
        // EVM chains (Base, Polygon, Ethereum) via MetaMask
        if (!window.ethereum) {
          setError('MetaMask not found. Please install MetaMask.');
          return;
        }

        // Parse amount in ETH
        const amountInEth = chainInfo.amount.split(' ')[0];
        const amountInWei = '0x' + (parseFloat(amountInEth) * 1e18).toString(16);

        const txParams = {
          from: walletAccount.address,
          to: chainInfo.address,
          value: amountInWei,
          gas: '0x5208', // 21000 gas for simple transfer
        };

        transactionHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [txParams],
        });
      }

      // Auto-verify the payment
      if (transactionHash) {
        setTxHash(transactionHash);
        await verifyTransaction(transactionHash);
      }

    } catch (err: any) {
      console.error('Payment error:', err);
      if (err.code === 4001) {
        setError('Payment cancelled by user');
      } else {
        setError(err.message || 'Payment failed');
      }
    } finally {
      setIsPaying(false);
    }
  };

  const verifyTransaction = async (hash: string) => {
    try {
      setIsVerifying(true);
      setError(null);

      // Call API to verify payment
      const response = await fetch('/api/payment/verify-unlimited', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: walletAccount.address,
          txHash: hash,
          chain: selectedChain,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Payment verification failed. The transaction may still be pending.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify payment');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!txHash || !walletAccount) {
      setError('Please connect your wallet and enter transaction hash');
      return;
    }

    await verifyTransaction(txHash);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/pricing"
          className="inline-flex items-center text-[#FFD700] hover:text-[#FF6B35] transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pricing
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-gold-orange mb-4">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
              Upgrade to Unlimited
            </h1>
            <p className="text-xl text-foreground/70">
              Pay once, enjoy lifetime unlimited API access
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-xl bg-[#4CAF50]/20 border border-[#4CAF50]/30"
            >
              <div className="flex items-center gap-3 text-[#4CAF50]">
                <Check className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg">Payment Confirmed!</h3>
                  <p className="text-sm text-foreground/70">Redirecting to your dashboard...</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-xl bg-red-500/20 border border-red-500/30"
            >
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg">Error</h3>
                  <p className="text-sm text-foreground/70">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Payment Details */}
            <div>
              <div className="card-3d rounded-2xl p-8 mb-6">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-6">Select Payment Method</h2>

                <div className="space-y-3">
                  {Object.entries(CHAIN_INFO).map(([chain, info]) => (
                    <button
                      key={chain}
                      onClick={() => setSelectedChain(chain as Chain)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedChain === chain
                          ? 'border-[#FFD700] bg-[#FFD700]/10'
                          : 'border-[#FFD700]/20 hover:border-[#FFD700]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{info.icon}</span>
                          <div className="text-left">
                            <p className="font-bold text-foreground">{info.name}</p>
                            <p className="text-sm text-foreground/70">{info.amount} ≈ $50</p>
                          </div>
                        </div>
                        {selectedChain === chain && (
                          <Check className="w-5 h-5 text-[#FFD700]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* What You Get */}
              <div className="card-3d rounded-2xl p-8">
                <h3 className="text-xl font-bold text-[#FFD700] mb-4">What You Get</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
                    <span className="text-foreground/80">Unlimited API requests forever</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
                    <span className="text-foreground/80">No rate limits</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
                    <span className="text-foreground/80">Personal dashboard</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
                    <span className="text-foreground/80">Priority support</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#4CAF50] mt-0.5" />
                    <span className="text-foreground/80">Lifetime updates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment */}
            <div>
              <div className="card-3d rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-2">
                  {showManualEntry ? 'Manual Payment' : 'Complete Your Payment'}
                </h2>
                <p className="text-sm text-foreground/70 mb-6">
                  {showManualEntry
                    ? 'Send payment and enter your transaction hash'
                    : 'Click the button below to pay with your wallet'}
                </p>

                {!walletAccount && (
                  <div className="mb-6 p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                      <Wallet className="w-5 h-5" />
                      <span className="font-semibold">Wallet Not Connected</span>
                    </div>
                    <p className="text-sm text-foreground/70 mb-3">
                      Connect your wallet first to continue
                    </p>
                    <Link
                      href="/login"
                      className="inline-block px-4 py-2 rounded-lg gradient-gold-orange text-white font-semibold text-sm"
                    >
                      Connect Wallet
                    </Link>
                  </div>
                )}

                {walletAccount && (
                  <div className="mb-6 p-4 rounded-xl bg-[#4CAF50]/20 border border-[#4CAF50]/30">
                    <div className="flex items-center gap-2 text-[#4CAF50] mb-2">
                      <Check className="w-5 h-5" />
                      <span className="font-semibold">Wallet Connected</span>
                    </div>
                    <p className="text-xs font-mono text-foreground/70 break-all">
                      {walletAccount.address}
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Primary Payment Button */}
                  {!showManualEntry && !success && (
                    <div>
                      <button
                        onClick={handlePayWithWallet}
                        disabled={!walletAccount || isPaying || isVerifying}
                        className="w-full px-6 py-4 rounded-xl gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {isPaying ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Processing Payment...
                          </>
                        ) : isVerifying ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Verifying Transaction...
                          </>
                        ) : (
                          <>
                            <Wallet className="w-6 h-6" />
                            Pay {CHAIN_INFO[selectedChain].amount} with {CHAIN_INFO[selectedChain].name}
                          </>
                        )}
                      </button>
                      <p className="text-xs text-center text-foreground/50 mt-3">
                        Your wallet will open to confirm the payment
                      </p>
                    </div>
                  )}

                  {/* Manual Entry Option */}
                  {!showManualEntry && !success && (
                    <div className="text-center">
                      <button
                        onClick={() => setShowManualEntry(true)}
                        className="text-sm text-[#FFD700] hover:text-[#FF6B35] transition-colors underline"
                      >
                        Or enter transaction hash manually
                      </button>
                    </div>
                  )}

                  {/* Manual Entry Form */}
                  {showManualEntry && !success && (
                    <>
                      {/* Step 1 */}
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 text-[#FFD700] flex items-center justify-center font-bold">
                            1
                          </div>
                          <h3 className="font-bold text-foreground">Send {CHAIN_INFO[selectedChain].amount}</h3>
                        </div>
                        <div className="ml-11">
                          <p className="text-sm text-foreground/70 mb-2">To this address:</p>
                          <div className="p-3 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30 font-mono text-sm break-all flex items-center justify-between gap-2">
                            <span className="text-foreground">{CHAIN_INFO[selectedChain].address}</span>
                            <button
                              onClick={handleCopyAddress}
                              className="p-2 hover:bg-[#FFD700]/20 rounded transition-colors"
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-[#4CAF50]" />
                              ) : (
                                <Copy className="w-4 h-4 text-[#FFD700]" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 text-[#FFD700] flex items-center justify-center font-bold">
                            2
                          </div>
                          <h3 className="font-bold text-foreground">Enter Transaction Hash</h3>
                        </div>
                        <div className="ml-11">
                          <input
                            type="text"
                            placeholder="Paste your transaction hash here..."
                            value={txHash}
                            onChange={(e) => setTxHash(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-[#0A0A0A] border border-[#FFD700]/30 focus:border-[#FFD700] outline-none text-foreground font-mono text-sm"
                          />
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 text-[#FFD700] flex items-center justify-center font-bold">
                            3
                          </div>
                          <h3 className="font-bold text-foreground">Verify Payment</h3>
                        </div>
                        <div className="ml-11">
                          <button
                            onClick={handleVerifyPayment}
                            disabled={!txHash || !walletAccount || isVerifying || success}
                            className="w-full px-6 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {isVerifying ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <Check className="w-5 h-5" />
                                Verify Payment
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Success State */}
                  {success && (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 rounded-full bg-[#4CAF50]/20 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-10 h-10 text-[#4CAF50]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#4CAF50] mb-2">Payment Confirmed!</h3>
                      <p className="text-foreground/70">Upgrading your account...</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-[#FFD700]/20">
                  <p className="text-xs text-foreground/50 text-center">
                    Payment confirmation usually takes 1-5 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

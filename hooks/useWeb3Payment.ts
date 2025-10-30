import { useState } from 'react';
import { X402Response } from '@/lib/x402/types';

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

export function useWeb3Payment() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Connect to MetaMask/Web3 wallet
   */
  const connectWallet = async (): Promise<string | null> => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!window.ethereum) {
        setError('MetaMask not installed. Please install MetaMask.');
        return null;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      setIsConnecting(false);
      return accounts[0];
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      setIsConnecting(false);
      return null;
    }
  };

  /**
   * Send EVM payment (Base, Polygon)
   */
  const sendEVMPayment = async (paymentData: X402Response): Promise<string | null> => {
    try {
      setIsSending(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const fromAddress = accounts[0];

      // Convert token amount to wei (for ETH/MATIC)
      const amountInWei = '0x' + Math.floor(parseFloat(paymentData.amountToken) * 1e18).toString(16);

      // Send transaction
      const transactionHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: fromAddress,
          to: paymentData.recipient_address,
          value: amountInWei,
          gas: '0x5208', // 21000 in hex
        }],
      });

      setTxHash(transactionHash);
      setIsSending(false);
      return transactionHash;

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
      setIsSending(false);
      return null;
    }
  };

  /**
   * Send Solana payment
   */
  const sendSolanaPayment = async (paymentData: X402Response): Promise<string | null> => {
    try {
      setIsSending(true);
      setError(null);

      if (!window.solana) {
        throw new Error('Phantom wallet not installed');
      }

      // Connect to Phantom
      const resp = await window.solana.connect();
      const fromPubkey = resp.publicKey;

      // Convert SOL amount to lamports
      const lamports = Math.floor(parseFloat(paymentData.amountToken) * 1e9);

      // Create transaction
      const { Connection, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } = await import('@solana/web3.js');

      const connection = new Connection('https://api.mainnet-beta.solana.com');

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromPubkey,
          toPubkey: new PublicKey(paymentData.recipient_address),
          lamports: lamports,
        })
      );

      transaction.feePayer = fromPubkey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      // Sign and send
      const signed = await window.solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());

      setTxHash(signature);
      setIsSending(false);
      return signature;

    } catch (err: any) {
      console.error('Solana payment error:', err);
      setError(err.message || 'Solana payment failed');
      setIsSending(false);
      return null;
    }
  };

  /**
   * Send payment based on chain
   */
  const sendPayment = async (paymentData: X402Response): Promise<string | null> => {
    if (paymentData.chain === 'solana') {
      return sendSolanaPayment(paymentData);
    } else {
      return sendEVMPayment(paymentData);
    }
  };

  /**
   * Verify payment status
   */
  const verifyPayment = async (requestId: string, txHash: string): Promise<any> => {
    try {
      const response = await fetch('/api/payment/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, txHash }),
      });

      return await response.json();
    } catch (err: any) {
      console.error('Verification error:', err);
      throw err;
    }
  };

  return {
    connectWallet,
    sendPayment,
    verifyPayment,
    isConnecting,
    isSending,
    txHash,
    error,
    setError,
  };
}

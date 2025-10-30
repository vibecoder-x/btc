/**
 * Blockchain Transaction Verifier
 * Verifies payments on Base, Solana, and Polygon
 */

import { ethers } from 'ethers';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SupportedChain, PaymentVerification } from './types';

export class BlockchainVerifier {
  private static providers: Record<string, ethers.JsonRpcProvider> = {};
  private static solanaConnection: Connection | null = null;

  /**
   * Get or create EVM provider
   */
  private static getProvider(chain: SupportedChain): ethers.JsonRpcProvider {
    if (this.providers[chain]) {
      return this.providers[chain];
    }

    let rpcUrl: string;
    switch (chain) {
      case 'base':
        rpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
        break;
      case 'base-sepolia':
        rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';
        break;
      case 'polygon':
        rpcUrl = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
        break;
      default:
        throw new Error(`Unsupported EVM chain: ${chain}`);
    }

    this.providers[chain] = new ethers.JsonRpcProvider(rpcUrl);
    return this.providers[chain];
  }

  /**
   * Get or create Solana connection
   */
  private static getSolanaConnection(): Connection {
    if (this.solanaConnection) {
      return this.solanaConnection;
    }

    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    this.solanaConnection = new Connection(rpcUrl, 'confirmed');
    return this.solanaConnection;
  }

  /**
   * Verify EVM transaction (Base, Polygon)
   */
  static async verifyEVMTransaction(
    txHash: string,
    chain: SupportedChain,
    expectedAmount: string,
    recipientAddress: string
  ): Promise<PaymentVerification> {
    try {
      const provider = this.getProvider(chain);

      // Get transaction receipt
      const receipt = await provider.getTransactionReceipt(txHash);

      if (!receipt) {
        return { isValid: false, error: 'Transaction not found' };
      }

      // Get transaction details
      const tx = await provider.getTransaction(txHash);

      if (!tx) {
        return { isValid: false, error: 'Transaction details not found' };
      }

      // Verify recipient
      const recipient = tx.to?.toLowerCase();
      if (recipient !== recipientAddress.toLowerCase()) {
        return {
          isValid: false,
          error: `Invalid recipient. Expected ${recipientAddress}, got ${tx.to}`,
        };
      }

      // Verify amount
      const sentAmount = ethers.formatEther(tx.value);
      const expectedAmountNum = parseFloat(expectedAmount);
      const sentAmountNum = parseFloat(sentAmount);

      // Allow 1% tolerance for rounding differences
      const tolerance = expectedAmountNum * 0.01;
      if (Math.abs(sentAmountNum - expectedAmountNum) > tolerance) {
        return {
          isValid: false,
          error: `Invalid amount. Expected ${expectedAmount} ETH, got ${sentAmount} ETH`,
        };
      }

      // Check confirmations
      const currentBlock = await provider.getBlockNumber();
      const confirmations = receipt.blockNumber ? currentBlock - receipt.blockNumber : 0;

      // Require at least 1 confirmation
      if (confirmations < 1) {
        return {
          isValid: false,
          txHash,
          chain,
          confirmations,
          error: 'Waiting for confirmations',
        };
      }

      // Payment verified!
      return {
        isValid: true,
        txHash,
        chain,
        confirmations,
      };

    } catch (error) {
      console.error('EVM verification error:', error);
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  }

  /**
   * Verify Solana transaction
   */
  static async verifySolanaTransaction(
    signature: string,
    expectedAmount: string,
    recipientAddress: string
  ): Promise<PaymentVerification> {
    try {
      const connection = this.getSolanaConnection();

      // Get transaction
      const tx = await connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      });

      if (!tx) {
        return { isValid: false, error: 'Transaction not found' };
      }

      // Check if transaction succeeded
      if (tx.meta?.err) {
        return { isValid: false, error: 'Transaction failed on-chain' };
      }

      // Get account keys
      const accountKeys = tx.transaction.message.getAccountKeys();

      // Find the recipient in post balances
      const recipientPubkey = new PublicKey(recipientAddress);
      const recipientIndex = accountKeys.staticAccountKeys.findIndex(
        (key) => key.equals(recipientPubkey)
      );

      if (recipientIndex === -1) {
        return { isValid: false, error: 'Recipient not found in transaction' };
      }

      // Calculate amount transferred
      const preBalance = tx.meta?.preBalances[recipientIndex] || 0;
      const postBalance = tx.meta?.postBalances[recipientIndex] || 0;
      const transferredLamports = postBalance - preBalance;
      const transferredSOL = transferredLamports / LAMPORTS_PER_SOL;

      // Verify amount
      const expectedAmountNum = parseFloat(expectedAmount);

      // Allow 1% tolerance
      const tolerance = expectedAmountNum * 0.01;
      if (Math.abs(transferredSOL - expectedAmountNum) > tolerance) {
        return {
          isValid: false,
          error: `Invalid amount. Expected ${expectedAmount} SOL, got ${transferredSOL.toFixed(9)} SOL`,
        };
      }

      // Check confirmation status
      const status = await connection.getSignatureStatus(signature);
      const confirmations = status.value?.confirmations || 0;

      // Solana finality: wait for at least 1 confirmation
      if (confirmations < 1 && status.value?.confirmationStatus !== 'finalized') {
        return {
          isValid: false,
          txHash: signature,
          chain: 'solana',
          confirmations,
          error: 'Waiting for confirmation',
        };
      }

      // Payment verified!
      return {
        isValid: true,
        txHash: signature,
        chain: 'solana',
        confirmations,
      };

    } catch (error) {
      console.error('Solana verification error:', error);
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  }

  /**
   * Verify transaction on any supported chain
   */
  static async verifyTransaction(
    txHash: string,
    chain: SupportedChain,
    expectedAmount: string,
    recipientAddress: string
  ): Promise<PaymentVerification> {
    if (chain === 'solana') {
      return this.verifySolanaTransaction(txHash, expectedAmount, recipientAddress);
    } else {
      return this.verifyEVMTransaction(txHash, chain, expectedAmount, recipientAddress);
    }
  }

  /**
   * Get transaction explorer URL
   */
  static getExplorerUrl(txHash: string, chain: SupportedChain): string {
    const explorers: Record<SupportedChain, string> = {
      'base': 'https://basescan.org',
      'base-sepolia': 'https://sepolia.basescan.org',
      'solana': 'https://explorer.solana.com',
      'polygon': 'https://polygonscan.com',
    };

    return `${explorers[chain]}/tx/${txHash}`;
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase only if keys are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, txHash, chain } = await request.json();

    if (!walletAddress || !txHash || !chain) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Verify transaction on blockchain
    const isValid = await verifyTransaction(txHash, chain);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or unconfirmed transaction' },
        { status: 400 }
      );
    }

    // Save to database
    const { data, error } = await supabase
      .from('unlimited_users')
      .upsert({
        wallet_address: walletAddress.toLowerCase(),
        tx_hash: txHash,
        chain: chain,
        activated_at: new Date().toISOString(),
        plan: 'unlimited',
      }, {
        onConflict: 'wallet_address'
      });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save payment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified! You now have unlimited access.',
    });

  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}

async function verifyTransaction(txHash: string, chain: string): Promise<boolean> {
  try {
    // For now, return true for testing
    // In production, you would call the blockchain explorer APIs:
    // - Etherscan API for Ethereum
    // - Basescan API for Base
    // - Polygonscan API for Polygon
    // - Blockchain.com API for Bitcoin
    // - Solscan API for Solana

    // Example for Ethereum/Base/Polygon using ethers:
    if (chain === 'ethereum' || chain === 'base' || chain === 'polygon') {
      const { ethers } = await import('ethers');

      let rpcUrl = '';
      if (chain === 'ethereum') rpcUrl = process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com';
      if (chain === 'base') rpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
      if (chain === 'polygon') rpcUrl = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';

      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const tx = await provider.getTransaction(txHash);

      if (!tx) return false;

      // Check if transaction is confirmed
      const receipt = await provider.getTransactionReceipt(txHash);
      if (!receipt || receipt.status !== 1) return false;

      // Check if it's sent to our address and amount is correct
      const expectedAddress = '0x840820c866fA17eAa7A44f46A3F1849C7860B245';
      const minAmount = ethers.parseEther('0.014'); // ~$50 worth

      if (tx.to?.toLowerCase() !== expectedAddress.toLowerCase()) return false;
      if (tx.value < minAmount) return false;

      return true;
    }

    // For Solana
    if (chain === 'solana') {
      const { Connection } = await import('@solana/web3.js');
      const connection = new Connection('https://api.mainnet-beta.solana.com');

      const tx = await connection.getTransaction(txHash, {
        maxSupportedTransactionVersion: 0
      });

      if (!tx || !tx.meta || tx.meta.err) return false;

      // Additional validation for Solana transactions
      // Check recipient and amount here

      return true;
    }

    // For Bitcoin
    if (chain === 'bitcoin') {
      // Use blockchain.com or mempool.space API
      const response = await fetch(`https://blockchain.info/rawtx/${txHash}`);
      if (!response.ok) return false;

      const tx = await response.json();

      // Check confirmations
      if (!tx.block_height) return false;

      // Check if sent to our address
      const expectedAddress = 'bc1qszqgzwx04mlmxuhe3aymhkvpv9ge0q2p37gny5';
      const hasCorrectOutput = tx.out.some((output: any) =>
        output.addr === expectedAddress && output.value >= 50000 // 0.0005 BTC in satoshis
      );

      return hasCorrectOutput;
    }

    return false;

  } catch (error) {
    console.error('Transaction verification error:', error);
    return false;
  }
}

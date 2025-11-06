'use client';

import { useState, useEffect } from 'react';

interface BitcoinWallet {
  name: string;
  address: string;
  publicKey: string;
  network: 'mainnet' | 'testnet';
}

export function useBitcoinWallet() {
  const [wallet, setWallet] = useState<BitcoinWallet | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if already connected on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('btcWallet');
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        setWallet(walletData);
        setIsConnected(true);
      } catch (err) {
        console.error('Error loading saved wallet:', err);
      }
    }
  }, []);

  // Connect to Xverse wallet
  const connectXverse = async () => {
    try {
      setIsConnecting(true);

      // Check if Xverse is installed
      if (typeof window !== 'undefined' && (window as any).XverseProviders) {
        const xverse = (window as any).XverseProviders;

        const response = await xverse.BitcoinProvider.request('getAccounts', {
          purposes: ['payment'],
        });

        if (response && response.result && response.result.length > 0) {
          const account = response.result[0];
          const walletData: BitcoinWallet = {
            name: 'Xverse',
            address: account.address,
            publicKey: account.publicKey,
            network: account.network || 'mainnet',
          };

          setWallet(walletData);
          setIsConnected(true);
          localStorage.setItem('btcWallet', JSON.stringify(walletData));
          return walletData;
        }
      } else {
        throw new Error('Xverse wallet not installed');
      }
    } catch (err: any) {
      console.error('Error connecting to Xverse:', err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect to Leather (Hiro) wallet
  const connectLeather = async () => {
    try {
      setIsConnecting(true);

      // Check if Leather is installed
      if (typeof window !== 'undefined' && (window as any).LeatherProvider) {
        const leather = (window as any).LeatherProvider;

        const response = await leather.request('getAddresses');

        if (response && response.result && response.result.addresses) {
          const btcAddress = response.result.addresses.find((a: any) => a.symbol === 'BTC');

          if (btcAddress) {
            const walletData: BitcoinWallet = {
              name: 'Leather',
              address: btcAddress.address,
              publicKey: btcAddress.publicKey || '',
              network: 'mainnet',
            };

            setWallet(walletData);
            setIsConnected(true);
            localStorage.setItem('btcWallet', JSON.stringify(walletData));
            return walletData;
          }
        }
      } else {
        throw new Error('Leather wallet not installed');
      }
    } catch (err: any) {
      console.error('Error connecting to Leather:', err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect to Unisat wallet
  const connectUnisat = async () => {
    try {
      setIsConnecting(true);

      // Check if Unisat is installed
      if (typeof window !== 'undefined' && (window as any).unisat) {
        const unisat = (window as any).unisat;

        const accounts = await unisat.requestAccounts();

        if (accounts && accounts.length > 0) {
          const publicKey = await unisat.getPublicKey();
          const network = await unisat.getNetwork();

          const walletData: BitcoinWallet = {
            name: 'Unisat',
            address: accounts[0],
            publicKey: publicKey,
            network: network === 'livenet' ? 'mainnet' : 'testnet',
          };

          setWallet(walletData);
          setIsConnected(true);
          localStorage.setItem('btcWallet', JSON.stringify(walletData));
          return walletData;
        }
      } else {
        throw new Error('Unisat wallet not installed');
      }
    } catch (err: any) {
      console.error('Error connecting to Unisat:', err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setWallet(null);
    setIsConnected(false);
    localStorage.removeItem('btcWallet');
  };

  // Check which wallets are available
  const getAvailableWallets = () => {
    const available: string[] = [];

    if (typeof window !== 'undefined') {
      if ((window as any).XverseProviders) available.push('Xverse');
      if ((window as any).LeatherProvider) available.push('Leather');
      if ((window as any).unisat) available.push('Unisat');
    }

    return available;
  };

  return {
    wallet,
    isConnected,
    isConnecting,
    connectXverse,
    connectLeather,
    connectUnisat,
    disconnect,
    getAvailableWallets,
  };
}

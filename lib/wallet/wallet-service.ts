/**
 * Wallet Authentication Service
 * Handles Web3 wallet connections (MetaMask, Phantom)
 * Supports EVM chains (Base, Polygon) and Solana
 */

export type WalletType = 'metamask' | 'phantom';

export interface WalletAccount {
  address: string;
  publicKey?: string;
  walletType: WalletType;
  chainType: 'evm' | 'solana';
}

export interface WalletInfo {
  name: string;
  icon: string;
  downloadUrl: string;
  installed: boolean;
  chainType: 'evm' | 'solana';
}

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

export class WalletService {
  /**
   * Check if a wallet is installed
   */
  static isWalletInstalled(walletType: WalletType): boolean {
    if (typeof window === 'undefined') return false;

    switch (walletType) {
      case 'metamask':
        return typeof window.ethereum !== 'undefined';
      case 'phantom':
        return typeof window.solana !== 'undefined' && window.solana.isPhantom;
      default:
        return false;
    }
  }

  /**
   * Get list of available wallets
   */
  static getAvailableWallets(): Record<WalletType, WalletInfo> {
    return {
      metamask: {
        name: 'MetaMask',
        icon: '🦊',
        downloadUrl: 'https://metamask.io/download/',
        installed: this.isWalletInstalled('metamask'),
        chainType: 'evm',
      },
      phantom: {
        name: 'Phantom',
        icon: '👻',
        downloadUrl: 'https://phantom.app/',
        installed: this.isWalletInstalled('phantom'),
        chainType: 'solana',
      },
    };
  }

  /**
   * Connect to a wallet
   */
  static async connect(walletType: WalletType): Promise<WalletAccount> {
    if (!this.isWalletInstalled(walletType)) {
      throw new Error(`${walletType} wallet is not installed`);
    }

    switch (walletType) {
      case 'metamask':
        return await this.connectMetaMask();
      case 'phantom':
        return await this.connectPhantom();
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }
  }

  /**
   * Connect to MetaMask wallet (EVM chains)
   */
  private static async connectMetaMask(): Promise<WalletAccount> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      return {
        address: accounts[0],
        walletType: 'metamask',
        chainType: 'evm',
      };
    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      throw new Error(error.message || 'Failed to connect to MetaMask wallet');
    }
  }

  /**
   * Connect to Phantom wallet (Solana)
   */
  private static async connectPhantom(): Promise<WalletAccount> {
    try {
      if (!window.solana || !window.solana.isPhantom) {
        throw new Error('Phantom wallet not installed');
      }

      const resp = await window.solana.connect();
      const publicKey = resp.publicKey.toString();

      return {
        address: publicKey,
        publicKey: publicKey,
        walletType: 'phantom',
        chainType: 'solana',
      };
    } catch (error: any) {
      console.error('Phantom connection error:', error);
      throw new Error(error.message || 'Failed to connect to Phantom wallet');
    }
  }

  /**
   * Disconnect wallet
   */
  static disconnect(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wallet_account');
      localStorage.removeItem('wallet_type');
    }
  }

  /**
   * Save wallet account to local storage
   */
  static saveAccount(account: WalletAccount): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wallet_account', JSON.stringify(account));
      localStorage.setItem('wallet_type', account.walletType);
    }
  }

  /**
   * Get saved wallet account from local storage
   */
  static getSavedAccount(): WalletAccount | null {
    if (typeof window === 'undefined') return null;

    const accountStr = localStorage.getItem('wallet_account');
    if (!accountStr) return null;

    try {
      return JSON.parse(accountStr);
    } catch {
      return null;
    }
  }

  /**
   * Format address for display (truncate middle)
   */
  static formatAddress(address: string): string {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  }

  /**
   * Sign a message with the connected wallet
   */
  static async signMessage(message: string, walletType: WalletType): Promise<string> {
    if (!this.isWalletInstalled(walletType)) {
      throw new Error(`${walletType} wallet is not installed`);
    }

    switch (walletType) {
      case 'metamask':
        if (!window.ethereum) throw new Error('MetaMask not available');
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        return await window.ethereum.request({
          method: 'personal_sign',
          params: [message, accounts[0]],
        });
      case 'phantom':
        if (!window.solana) throw new Error('Phantom not available');
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8');
        return signedMessage.signature.toString();
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }
  }

  /**
   * Get the current connected wallet (if any)
   */
  static async getCurrentWallet(): Promise<WalletAccount | null> {
    // Check MetaMask
    if (this.isWalletInstalled('metamask')) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          return {
            address: accounts[0],
            walletType: 'metamask',
            chainType: 'evm',
          };
        }
      } catch (error) {
        console.error('Error checking MetaMask:', error);
      }
    }

    // Check Phantom
    if (this.isWalletInstalled('phantom')) {
      try {
        if (window.solana.isConnected) {
          const publicKey = window.solana.publicKey.toString();
          return {
            address: publicKey,
            publicKey: publicKey,
            walletType: 'phantom',
            chainType: 'solana',
          };
        }
      } catch (error) {
        console.error('Error checking Phantom:', error);
      }
    }

    return null;
  }
}

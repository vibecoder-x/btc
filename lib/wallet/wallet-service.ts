/**
 * Wallet Authentication Service
 * Handles Bitcoin wallet connections (Xverse, Unisat, Hiro, Leather)
 */

export type WalletType = 'xverse' | 'unisat' | 'hiro' | 'leather';

export interface WalletAccount {
  address: string;
  publicKey: string;
  walletType: WalletType;
}

export interface WalletInfo {
  name: string;
  icon: string;
  downloadUrl: string;
  installed: boolean;
}

declare global {
  interface Window {
    unisat?: any;
    XverseProviders?: any;
    HiroWalletProvider?: any;
    LeatherProvider?: any;
  }
}

export class WalletService {
  /**
   * Check if a wallet is installed
   */
  static isWalletInstalled(walletType: WalletType): boolean {
    switch (walletType) {
      case 'unisat':
        return typeof window !== 'undefined' && typeof window.unisat !== 'undefined';
      case 'xverse':
        return typeof window !== 'undefined' && typeof window.XverseProviders !== 'undefined';
      case 'hiro':
        return typeof window !== 'undefined' && typeof window.HiroWalletProvider !== 'undefined';
      case 'leather':
        return typeof window !== 'undefined' && typeof window.LeatherProvider !== 'undefined';
      default:
        return false;
    }
  }

  /**
   * Get list of available wallets
   */
  static getAvailableWallets(): Record<WalletType, WalletInfo> {
    return {
      xverse: {
        name: 'Xverse',
        icon: '🟣',
        downloadUrl: 'https://www.xverse.app/download',
        installed: this.isWalletInstalled('xverse'),
      },
      unisat: {
        name: 'Unisat',
        icon: '🟠',
        downloadUrl: 'https://unisat.io/download',
        installed: this.isWalletInstalled('unisat'),
      },
      hiro: {
        name: 'Hiro',
        icon: '🔵',
        downloadUrl: 'https://wallet.hiro.so/',
        installed: this.isWalletInstalled('hiro'),
      },
      leather: {
        name: 'Leather',
        icon: '🟤',
        downloadUrl: 'https://leather.io/install-extension',
        installed: this.isWalletInstalled('leather'),
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
      case 'unisat':
        return await this.connectUnisat();
      case 'xverse':
        return await this.connectXverse();
      case 'hiro':
        return await this.connectHiro();
      case 'leather':
        return await this.connectLeather();
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }
  }

  /**
   * Connect to Unisat wallet
   */
  private static async connectUnisat(): Promise<WalletAccount> {
    try {
      const accounts = await window.unisat.requestAccounts();
      const publicKey = await window.unisat.getPublicKey();

      return {
        address: accounts[0],
        publicKey,
        walletType: 'unisat',
      };
    } catch (error) {
      console.error('Unisat connection error:', error);
      throw new Error('Failed to connect to Unisat wallet');
    }
  }

  /**
   * Connect to Xverse wallet
   */
  private static async connectXverse(): Promise<WalletAccount> {
    try {
      const getAddressOptions = {
        payload: {
          purposes: ['ordinals', 'payment'],
          message: 'Connect to btcindexer.com',
          network: {
            type: 'Mainnet',
          },
        },
        onFinish: (response: any) => response,
        onCancel: () => {
          throw new Error('User cancelled connection');
        },
      };

      return new Promise((resolve, reject) => {
        window.XverseProviders.BitcoinProvider.request('getAccounts', getAddressOptions)
          .then((response: any) => {
            const ordinalsAddress = response.addresses.find((addr: any) => addr.purpose === 'ordinals');
            resolve({
              address: ordinalsAddress.address,
              publicKey: ordinalsAddress.publicKey,
              walletType: 'xverse',
            });
          })
          .catch(reject);
      });
    } catch (error) {
      console.error('Xverse connection error:', error);
      throw new Error('Failed to connect to Xverse wallet');
    }
  }

  /**
   * Connect to Hiro wallet
   */
  private static async connectHiro(): Promise<WalletAccount> {
    try {
      const response = await window.HiroWalletProvider.request('getAddresses');

      return {
        address: response.addresses[0].address,
        publicKey: response.addresses[0].publicKey,
        walletType: 'hiro',
      };
    } catch (error) {
      console.error('Hiro connection error:', error);
      throw new Error('Failed to connect to Hiro wallet');
    }
  }

  /**
   * Connect to Leather wallet
   */
  private static async connectLeather(): Promise<WalletAccount> {
    try {
      const response = await window.LeatherProvider.request('getAddresses');

      return {
        address: response.addresses[0].address,
        publicKey: response.addresses[0].publicKey,
        walletType: 'leather',
      };
    } catch (error) {
      console.error('Leather connection error:', error);
      throw new Error('Failed to connect to Leather wallet');
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
      case 'unisat':
        return await window.unisat.signMessage(message);
      case 'xverse':
        // Xverse signing implementation
        throw new Error('Xverse message signing not yet implemented');
      case 'hiro':
        return await window.HiroWalletProvider.request('signMessage', { message });
      case 'leather':
        return await window.LeatherProvider.request('signMessage', { message });
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }
  }
}

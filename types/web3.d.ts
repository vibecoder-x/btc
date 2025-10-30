// Web3 Wallet Type Declarations

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on?: (event: string, callback: (...args: any[]) => void) => void;
    removeListener?: (event: string, callback: (...args: any[]) => void) => void;
  };
  solana?: {
    isPhantom?: boolean;
    isConnected?: boolean;
    publicKey?: { toString: () => string };
    connect: () => Promise<{ publicKey: { toString: () => string } }>;
    disconnect: () => Promise<void>;
    signTransaction: (transaction: any) => Promise<any>;
    signMessage: (message: Uint8Array, encoding: string) => Promise<{ signature: { toString: () => string } }>;
    request: (args: { method: string; params?: any }) => Promise<any>;
    on?: (event: string, callback: (...args: any[]) => void) => void;
    removeListener?: (event: string, callback: (...args: any[]) => void) => void;
  };
}

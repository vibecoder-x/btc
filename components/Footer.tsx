'use client';

import { useState } from 'react';
import { Heart, Copy, Check } from 'lucide-react';

export default function Footer() {
  const [showDonate, setShowDonate] = useState(false);
  const [copied, setCopied] = useState(false);
  const donateAddress = 'bc1qq0e9ru8gh5amgm7fslf08clr62tkqyw5ptff0f';

  const handleCopy = () => {
    navigator.clipboard.writeText(donateAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="mt-auto border-t border-neon-blue/20 glassmorphism">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-foreground/70 text-sm">
            Powered by{' '}
            <span className="text-neon-blue font-semibold">btcindexer.com</span>{' '}
            | Open Blockchain Data
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-foreground/70 hover:text-neon-blue transition-colors duration-300"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-foreground/70 hover:text-neon-blue transition-colors duration-300"
            >
              Terms
            </a>
            <a
              href="/api"
              className="text-foreground/70 hover:text-neon-blue transition-colors duration-300"
            >
              API Docs
            </a>

            {/* Donate Button */}
            <button
              onClick={() => setShowDonate(!showDonate)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-orange hover:glow-blue transition-all duration-300"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm font-semibold">Donate</span>
            </button>
          </div>
        </div>

        {/* Donate Address Popup */}
        {showDonate && (
          <div className="mt-4 glassmorphism rounded-xl p-4 border border-neon-blue/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-foreground/70 mb-2">Support us with Bitcoin:</p>
                <code className="text-neon-blue font-mono text-sm break-all">
                  {donateAddress}
                </code>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg glassmorphism hover:bg-neon-blue/10 transition-all duration-300"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-neon-green" />
                    <span className="text-sm text-neon-green">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-neon-blue" />
                    <span className="text-sm">Copy Address</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

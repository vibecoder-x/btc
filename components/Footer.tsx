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
    <footer className="mt-auto border-t border-[#FFD700]/20 card-3d">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[#E0E0E0] text-sm">
            Powered by{' '}
            <span className="text-gradient-gold font-semibold">btcindexer.com</span>{' '}
            | Open Blockchain Data
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://x.com/btcindexer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-[#FFD700] transition-colors duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>@btcindexer</span>
            </a>

            {/* Donate Button */}
            <button
              onClick={() => setShowDonate(!showDonate)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 text-[#0A0A0A] font-semibold"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm font-semibold">Donate</span>
            </button>
          </div>
        </div>

        {/* Donate Address Popup */}
        {showDonate && (
          <div className="mt-4 card-3d rounded-xl p-4 border border-[#FFD700]/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-foreground/70 mb-2">Support us with Bitcoin:</p>
                <code className="text-[#FFD700] font-mono text-sm break-all">
                  {donateAddress}
                </code>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg card-3d hover:bg-[#FFD700]/10 transition-all duration-300"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-sm text-[#FFD700]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#FFD700]" />
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

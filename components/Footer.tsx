'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Copy, Check, Twitter, Github, MessageCircle, Send } from 'lucide-react';

export default function Footer() {
  const [showDonate, setShowDonate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [btcPrice, setBtcPrice] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(0);
  const donateAddress = 'bc1qq0e9ru8gh5amgm7fslf08clr62tkqyw5ptff0f';

  // Fetch BTC price and block height
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [priceRes, blockRes] = await Promise.all([
          fetch('/api/bitcoin-price'),
          fetch('/api/block/latest'),
        ]);

        if (priceRes.ok) {
          const priceData = await priceRes.json();
          setBtcPrice(priceData.price || 0);
        }

        if (blockRes.ok) {
          const blockData = await blockRes.json();
          setCurrentBlock(blockData.height || 0);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(donateAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const footerLinks = {
    product: [
      { name: 'Home', href: '/' },
      { name: 'API Documentation', href: '/docs' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Mining Stats', href: '/mining' },
      { name: 'Status Page', href: '/status' },
      { name: 'Halving Countdown', href: '/halving' },
    ],
    resources: [
      { name: 'Getting Started', href: '/docs' },
      { name: 'Code Examples', href: '/docs' },
      { name: 'FAQ', href: '/about' },
      { name: 'Support', href: '/about' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/about' },
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
  };

  return (
    <footer className="mt-auto border-t border-[#FFD700]/20 bg-gradient-to-b from-transparent to-[#FFD700]/5">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Product Column */}
          <div>
            <h3 className="text-[#FFD700] font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 hover:text-[#FFD700] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-[#FFD700] font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 hover:text-[#FFD700] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-[#FFD700] font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 hover:text-[#FFD700] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-[#FFD700] font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 hover:text-[#FFD700] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Column */}
          <div>
            <h3 className="text-[#FFD700] font-bold text-lg mb-4">Community</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://x.com/btcindexer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-[#FFD700] transition-colors text-sm flex items-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter/X
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/vibecoder-x/btc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-[#FFD700] transition-colors text-sm flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/70 hover:text-[#FFD700] transition-colors text-sm flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/70 hover:text-[#FFD700] transition-colors text-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Donate Section */}
        {showDonate && (
          <div className="mb-8 card-3d rounded-xl p-6 border border-[#FFD700]/30">
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

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#FFD700]/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-foreground/60 text-sm text-center md:text-left">
              © {new Date().getFullYear()} BTC Indexer. All rights reserved.
              <span className="mx-2">•</span>
              Powered by{' '}
              <span className="text-gradient-gold font-semibold">btcindexer.com</span>
            </div>

            {/* Live Stats */}
            <div className="flex items-center gap-6 text-sm">
              {/* Bitcoin Price */}
              {btcPrice > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-foreground/60">BTC:</span>
                  <span className="text-[#FFD700] font-semibold">
                    ${btcPrice.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Current Block */}
              {currentBlock > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-foreground/60">Block:</span>
                  <Link
                    href={`/blocks/${currentBlock}`}
                    className="text-[#FFD700] font-semibold hover:text-[#FF6B35] transition-colors"
                  >
                    {currentBlock.toLocaleString()}
                  </Link>
                </div>
              )}

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse"></div>
                <span className="text-foreground/60 text-xs">All systems operational</span>
              </div>
            </div>

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
      </div>
    </footer>
  );
}

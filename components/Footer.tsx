'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Copy, Check, Twitter, Github, MessageCircle, Send, QrCode, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

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
          fetch('/api/blocks'), // Use /api/blocks which provides tipHeight
        ]);

        if (priceRes.ok) {
          const priceData = await priceRes.json();
          setBtcPrice(priceData.price || 0);
        }

        if (blockRes.ok) {
          const blockData = await blockRes.json();
          setCurrentBlock(blockData.tipHeight || 0); // Use tipHeight instead of height
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
      { name: 'Rich List', href: '/rich-list' },
      { name: 'Status Page', href: '/status' },
      { name: 'Halving Countdown', href: '/halving' },
    ],
    resources: [
      { name: 'Getting Started', href: '/docs' },
      { name: 'Bitcoin History', href: '/history' },
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
                <div className="text-foreground/50 text-sm flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30">
                    Coming Soon
                  </span>
                </div>
              </li>
              <li>
                <div className="text-foreground/50 text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Discord</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30">
                    Coming Soon
                  </span>
                </div>
              </li>
              <li>
                <div className="text-foreground/50 text-sm flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30">
                    Coming Soon
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Donation Modal */}
        <AnimatePresence>
          {showDonate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
                onClick={() => setShowDonate(false)}
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-[#0F0F0F] border-2 border-[#FFD700]/30 rounded-2xl p-8 z-10 shadow-2xl"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowDonate(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
                >
                  <X className="w-5 h-5 text-foreground/70" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FF6B35] mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gradient-gold mb-2">
                    Support BTCindexer
                  </h2>
                  <p className="text-sm text-foreground/70">
                    Help us maintain and improve our services
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white rounded-xl">
                    <QRCodeSVG
                      value={donateAddress}
                      size={200}
                      level="H"
                      includeMargin={true}
                      fgColor="#000000"
                    />
                  </div>
                </div>

                {/* Bitcoin Address */}
                <div className="mb-6">
                  <p className="text-xs text-foreground/50 mb-2 text-center">Bitcoin Address:</p>
                  <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#FFD700]/20">
                    <code className="text-[#FFD700] font-mono text-xs break-all block text-center">
                      {donateAddress}
                    </code>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-gold-orange hover:glow-gold transition-all duration-300 text-white font-semibold"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Address Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>

                {/* Info */}
                <div className="mt-6 p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20">
                  <p className="text-xs text-foreground/70 text-center">
                    Every donation helps us provide free API access to the community. Thank you for your support!
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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

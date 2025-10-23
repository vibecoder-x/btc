'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Blocks', href: '/blocks' },
    { name: 'Mempool', href: '/#mempool' },
    { name: 'Stats', href: '/stats' },
    { name: 'API', href: '/api' },
  ];

  return (
    <header className="sticky top-0 z-50 glassmorphism border-b border-neon-blue/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-orange flex items-center justify-center glow-blue">
              <span className="text-2xl font-bold text-space-black">₿</span>
            </div>
            <span className="text-xl font-bold text-neon-blue">
              btcindexer<span className="text-neon-orange">.com</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-neon-blue transition-colors duration-300 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glassmorphism hover:glow-blue transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-neon-orange" />
              ) : (
                <Moon className="w-5 h-5 text-neon-blue" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg glassmorphism"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-neon-blue" />
            ) : (
              <Menu className="w-6 h-6 text-neon-blue" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-4"
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-foreground hover:text-neon-blue transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 py-2 text-foreground hover:text-neon-blue transition-colors duration-300"
              >
                {isDark ? (
                  <>
                    <Sun className="w-5 h-5" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, ArrowRight, Hash, Wallet, Cube, Copy } from 'lucide-react';

interface SearchResult {
  type: 'block' | 'tx' | 'address';
  value: string;
  display: string;
  preview?: string;
}

interface RecentSearch {
  type: string;
  value: string;
  display: string;
  timestamp: number;
}

export default function GlobalSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('btc-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load recent searches:', e);
      }
    }
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        setError(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Detect query type and validate
  const detectType = (input: string): SearchResult | null => {
    const trimmed = input.trim();

    // Block height (1-7 digits)
    if (/^\d{1,7}$/.test(trimmed)) {
      return {
        type: 'block',
        value: trimmed,
        display: `Block #${trimmed}`,
        preview: 'Search by block height',
      };
    }

    // Block hash or TX ID (64 hex chars)
    if (/^[a-fA-F0-9]{64}$/.test(trimmed)) {
      return {
        type: 'tx',
        value: trimmed,
        display: `${trimmed.slice(0, 8)}...${trimmed.slice(-8)}`,
        preview: 'Transaction or block hash',
      };
    }

    // Bitcoin address (various formats)
    if (
      /^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,87})$/.test(trimmed)
    ) {
      return {
        type: 'address',
        value: trimmed,
        display: `${trimmed.slice(0, 8)}...${trimmed.slice(-8)}`,
        preview: 'Bitcoin address',
      };
    }

    return null;
  };

  // Handle search input change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      setSelectedIndex(0);
      return;
    }

    const result = detectType(query);

    if (result) {
      setResults([result]);
      setError(null);
    } else {
      setResults([]);
      setError('Invalid format. Enter a block height, transaction ID, or Bitcoin address.');
    }

    setSelectedIndex(0);
  }, [query]);

  // Navigate to result
  const navigateTo = (result: SearchResult) => {
    // Save to recent searches
    const newSearch: RecentSearch = {
      type: result.type,
      value: result.value,
      display: result.display,
      timestamp: Date.now(),
    };

    const updated = [newSearch, ...recentSearches.filter(s => s.value !== result.value)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('btc-recent-searches', JSON.stringify(updated));

    // Navigate
    if (result.type === 'block') {
      router.push(`/blocks/${result.value}`);
    } else if (result.type === 'tx') {
      router.push(`/tx/${result.value}`);
    } else if (result.type === 'address') {
      router.push(`/address/${result.value}`);
    }

    // Close modal
    setIsOpen(false);
    setQuery('');
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      navigateTo(results[selectedIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    }
  };

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setQuery(text.trim());
      inputRef.current?.focus();
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  // Clear recent searches
  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('btc-recent-searches');
  };

  const getIcon = (type: string) => {
    if (type === 'block') return <Cube className="w-5 h-5" />;
    if (type === 'tx') return <Hash className="w-5 h-5" />;
    if (type === 'address') return <Wallet className="w-5 h-5" />;
    return <Search className="w-5 h-5" />;
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors duration-300 group"
      >
        <Search className="w-4 h-4 text-foreground/60 group-hover:text-[#FFD700] transition-colors" />
        <span className="text-sm text-foreground/60 group-hover:text-foreground transition-colors">
          Search...
        </span>
        <kbd className="hidden md:inline-block px-2 py-0.5 text-xs font-mono bg-foreground/10 text-foreground/60 rounded border border-foreground/20">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-32 px-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl card-3d rounded-2xl overflow-hidden"
            >
              {/* Search Input */}
              <div className="relative p-4 border-b border-[#FFD700]/20">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-[#FFD700]" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search blocks, transactions, or addresses..."
                    className="flex-1 bg-transparent text-foreground placeholder:text-foreground/50 outline-none text-lg"
                    autoFocus
                  />
                  <button
                    onClick={handlePaste}
                    className="p-2 rounded-lg hover:bg-[#FFD700]/10 text-[#FFD700] transition-colors"
                    title="Paste"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                      setError(null);
                    }}
                    className="p-2 rounded-lg hover:bg-foreground/10 text-foreground/70 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm text-red-400 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto p-2">
                {/* Search Results */}
                {results.length > 0 && (
                  <div className="space-y-1">
                    {results.map((result, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => navigateTo(result)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                          index === selectedIndex
                            ? 'bg-[#FFD700]/20 border-2 border-[#FFD700]'
                            : 'hover:bg-foreground/5 border-2 border-transparent'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          index === selectedIndex ? 'bg-[#FFD700]' : 'bg-[#FFD700]/20'
                        }`}>
                          <div className={index === selectedIndex ? 'text-black' : 'text-[#FFD700]'}>
                            {getIcon(result.type)}
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-foreground">{result.display}</p>
                          {result.preview && (
                            <p className="text-sm text-foreground/60">{result.preview}</p>
                          )}
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#FFD700]" />
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Recent Searches */}
                {!query && recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-4 py-2">
                      <h3 className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecent}
                        className="text-xs text-[#FFD700] hover:text-[#FF6B35] transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => navigateTo({
                            type: search.type as any,
                            value: search.value,
                            display: search.display,
                          })}
                          className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-foreground/5 border-2 border-transparent hover:border-[#FFD700]/20 transition-all"
                        >
                          <div className="p-2 rounded-lg bg-foreground/5">
                            <div className="text-foreground/60">
                              {getIcon(search.type)}
                            </div>
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm text-foreground/80">{search.display}</p>
                            <p className="text-xs text-foreground/50 capitalize">{search.type}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!query && recentSearches.length === 0 && (
                  <div className="py-12 text-center">
                    <Search className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                    <p className="text-foreground/60 mb-2">Search the blockchain</p>
                    <p className="text-sm text-foreground/40">
                      Enter a block height, transaction ID, or Bitcoin address
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-[#FFD700]/20 bg-foreground/5">
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-foreground/10 rounded">↑</kbd>
                      <kbd className="px-1.5 py-0.5 bg-foreground/10 rounded">↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-foreground/10 rounded">Enter</kbd>
                      Select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-foreground/10 rounded">Esc</kbd>
                      Close
                    </span>
                  </div>
                  <span>Powered by btcindexer.com</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

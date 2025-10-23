'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  const detectType = (input: string) => {
    if (/^[0-9]{1,7}$/.test(input)) {
      return 'block';
    } else if (/^[a-fA-F0-9]{64}$/.test(input)) {
      return 'tx';
    } else if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,87}$/.test(input)) {
      return 'address';
    }
    return 'unknown';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const type = detectType(query);
    switch (type) {
      case 'block':
        router.push(`/blocks/${query}`);
        break;
      case 'tx':
        router.push(`/tx/${query}`);
        break;
      case 'address':
        router.push(`/address/${query}`);
        break;
      default:
        alert('Invalid input. Please enter a block height, transaction ID, or address.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Simple suggestion logic
    if (value.length > 0) {
      const type = detectType(value);
      setSuggestions([`Search ${type}: ${value}`]);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search by block height, txid, or address..."
          className="w-full px-6 py-4 rounded-xl glassmorphism text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all duration-300"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-lg bg-gradient-to-br from-neon-blue to-neon-orange hover:glow-blue transition-all duration-300"
        >
          <Search className="w-5 h-5 text-space-black" />
        </button>
      </form>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute mt-2 w-full glassmorphism rounded-xl p-2 space-y-2"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-neon-blue/10 rounded-lg cursor-pointer transition-colors duration-200"
            >
              {suggestion}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

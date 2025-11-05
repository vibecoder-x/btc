'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Crown, Copy, Check, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  Building2, Clock, TrendingUp, Wallet, ChevronLeft, ChevronRight
} from 'lucide-react';

interface RichAddress {
  rank: number;
  address: string;
  balance: number; // in BTC
  balanceUsd: number;
  percentageOfSupply: number;
  lastActivity: string; // ISO date string
  tag?: string;
  type?: 'exchange' | 'whale' | 'miner' | 'institution' | 'unknown';
  isDormant: boolean;
}

type SortField = 'rank' | 'balance' | 'percentageOfSupply' | 'lastActivity';
type SortDirection = 'asc' | 'desc';
type FilterType = 'all' | 'exchange' | 'dormant' | 'recent';

export default function RichListPage() {
  const [addresses, setAddresses] = useState<RichAddress[]>([]);
  const [currentBtcPrice, setCurrentBtcPrice] = useState(95000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Generate mock data for top 100 addresses
  useEffect(() => {
    const mockAddresses: RichAddress[] = [];
    const now = new Date();

    const knownAddresses = [
      {
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        tag: 'Satoshi Nakamoto (Genesis)',
        type: 'whale' as const,
        lastActivityDate: new Date('2009-01-12') // Genesis block + first transaction
      },
      {
        address: 'bc1qgdjqv0av3q56jvd82tkdjpy7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97',
        tag: 'Binance Cold Wallet',
        type: 'exchange' as const,
        lastActivityDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        address: '3M219KR5vEneNb47ewrPfWyb5jQ2DjxRP6',
        tag: 'Bitfinex Cold Storage',
        type: 'exchange' as const,
        lastActivityDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        address: 'bc1qa5wkgaew2dkv56kfvj49j0av5nml45x9ek9hz6',
        tag: 'Coinbase Custody',
        type: 'exchange' as const,
        lastActivityDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        address: '1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF',
        tag: 'Grayscale Bitcoin Trust',
        type: 'institution' as const,
        lastActivityDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 1 month ago
      },
      {
        address: '3Cbq7aT1tY8kMxWLbitaG7yT6bPbKChq64',
        tag: 'Kraken Exchange',
        type: 'exchange' as const,
        lastActivityDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        address: 'bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h',
        tag: 'Huobi Cold Wallet',
        type: 'exchange' as const,
        lastActivityDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
      },
      {
        address: '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s',
        tag: 'Mt. Gox Trustee',
        type: 'exchange' as const,
        lastActivityDate: new Date('2014-02-24') // Mt. Gox collapse date
      },
      {
        address: '3LYJfcfHPXYJreMsASk2jkn69LWEYKzexb',
        tag: 'Unknown Whale #1',
        type: 'whale' as const,
        lastActivityDate: new Date('2017-12-15') // 2017 bull run peak
      },
      {
        address: 'bc1qjh0akslml39edfje9f9xpgr72djgx4xv7v3u3h',
        tag: 'Mining Pool (F2Pool)',
        type: 'miner' as const,
        lastActivityDate: new Date(now.getTime() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
    ];

    for (let i = 0; i < 100; i++) {
      const known = knownAddresses[i % knownAddresses.length];
      const baseBalance = 200000 - (i * 1500) + Math.random() * 1000;
      const balance = Math.max(1000, baseBalance);

      // Use realistic activity dates based on type
      let lastActivity: Date;
      if (i < 10) {
        // Use known activity dates for top 10
        lastActivity = known.lastActivityDate;
      } else {
        // Generate realistic dates based on type for others
        switch (known.type) {
          case 'exchange':
            // Exchanges are active - within last 14 days
            const exchangeDays = Math.floor(Math.random() * 14);
            lastActivity = new Date(now.getTime() - exchangeDays * 24 * 60 * 60 * 1000);
            break;
          case 'miner':
            // Miners are very active - within last 24 hours
            const minerHours = Math.floor(Math.random() * 24);
            lastActivity = new Date(now.getTime() - minerHours * 60 * 60 * 1000);
            break;
          case 'institution':
            // Institutions move slowly - within last 3 months
            const institutionDays = Math.floor(Math.random() * 90);
            lastActivity = new Date(now.getTime() - institutionDays * 24 * 60 * 60 * 1000);
            break;
          case 'whale':
            // Whales can be dormant or active
            const isWhaleActive = Math.random() > 0.5;
            if (isWhaleActive) {
              // Active whale - within last 6 months
              const whaleDays = Math.floor(Math.random() * 180);
              lastActivity = new Date(now.getTime() - whaleDays * 24 * 60 * 60 * 1000);
            } else {
              // Dormant whale - 2-10 years ago
              const whaleYears = 2 + Math.floor(Math.random() * 8);
              lastActivity = new Date(now.getTime() - whaleYears * 365 * 24 * 60 * 60 * 1000);
            }
            break;
          default:
            // Unknown - random within 2 years
            const unknownDays = Math.floor(Math.random() * 730);
            lastActivity = new Date(now.getTime() - unknownDays * 24 * 60 * 60 * 1000);
        }
      }

      const daysAgo = Math.floor((now.getTime() - lastActivity.getTime()) / (24 * 60 * 60 * 1000));

      // Generate full address (not truncated) for proper copying
      let fullAddress: string;
      if (i < 10) {
        fullAddress = known.address;
      } else {
        // Generate a realistic-looking full address by modifying the base address
        const addressPrefix = known.address.slice(0, 10);
        const addressSuffix = known.address.slice(-10);
        const middlePart = i.toString().padStart(4, '0') + 'x'.repeat(20); // Pad middle
        fullAddress = `${addressPrefix}${middlePart}${addressSuffix}`;
      }

      mockAddresses.push({
        rank: i + 1,
        address: fullAddress,
        balance,
        balanceUsd: balance * currentBtcPrice,
        percentageOfSupply: (balance / 21000000) * 100,
        lastActivity: lastActivity.toISOString(),
        tag: i < 15 ? (i < 10 ? known.tag : `${known.tag} ${i}`) : undefined,
        type: known.type,
        isDormant: daysAgo > 365,
      });
    }

    setAddresses(mockAddresses);
  }, [currentBtcPrice]);

  // Fetch current BTC price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('/api/bitcoin-price');
        if (response.ok) {
          const data = await response.json();
          setCurrentBtcPrice(data.price || 95000);
        }
      } catch (error) {
        console.error('Error fetching BTC price:', error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  // Filter addresses
  const filteredAddresses = useMemo(() => {
    let filtered = addresses;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(addr =>
        addr.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        addr.tag?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    switch (filterType) {
      case 'exchange':
        filtered = filtered.filter(addr => addr.type === 'exchange');
        break;
      case 'dormant':
        filtered = filtered.filter(addr => addr.isDormant);
        break;
      case 'recent':
        filtered = filtered.filter(addr => !addr.isDormant);
        break;
    }

    return filtered;
  }, [addresses, searchQuery, filterType]);

  // Sort addresses
  const sortedAddresses = useMemo(() => {
    const sorted = [...filteredAddresses];

    sorted.sort((a, b) => {
      let aValue: number | string = a[sortField];
      let bValue: number | string = b[sortField];

      if (sortField === 'lastActivity') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [filteredAddresses, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedAddresses.length / itemsPerPage);
  const paginatedAddresses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedAddresses.slice(start, start + itemsPerPage);
  }, [sortedAddresses, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const formatBalance = (balance: number) => {
    return balance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatUsd = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 20) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'exchange': return <Building2 className="w-4 h-4" />;
      case 'whale': return <Crown className="w-4 h-4" />;
      case 'miner': return <TrendingUp className="w-4 h-4" />;
      case 'institution': return <Wallet className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'exchange': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'whale': return 'text-[#FFD700] bg-[#FFD700]/10 border-[#FFD700]/30';
      case 'miner': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'institution': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default: return 'text-foreground/50 bg-foreground/5 border-foreground/20';
    }
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-[#FFD700] transition-colors"
    >
      {label}
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ArrowUp className="w-4 h-4" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        )
      ) : (
        <ArrowUpDown className="w-4 h-4 opacity-50" />
      )}
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-foreground/70 mb-6">
        <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Bitcoin Rich List</span>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-20 h-20 rounded-2xl gradient-gold-orange flex items-center justify-center glow-gold">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gradient-gold">Bitcoin Rich List</h1>
        </div>
        <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
          Top 100 Bitcoin addresses by balance - Track the whales, exchanges, and major holders
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="card-3d p-4 text-center">
          <p className="text-sm text-foreground/60 mb-1">Total Addresses</p>
          <p className="text-2xl font-bold text-[#FFD700]">{filteredAddresses.length}</p>
        </div>
        <div className="card-3d p-4 text-center">
          <p className="text-sm text-foreground/60 mb-1">Exchange Wallets</p>
          <p className="text-2xl font-bold text-blue-400">
            {addresses.filter(a => a.type === 'exchange').length}
          </p>
        </div>
        <div className="card-3d p-4 text-center">
          <p className="text-sm text-foreground/60 mb-1">Dormant (&gt;1yr)</p>
          <p className="text-2xl font-bold text-orange-400">
            {addresses.filter(a => a.isDormant).length}
          </p>
        </div>
        <div className="card-3d p-4 text-center">
          <p className="text-sm text-foreground/60 mb-1">BTC Price</p>
          <p className="text-2xl font-bold text-[#4CAF50]">
            ${currentBtcPrice.toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-3d p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Search by address or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-foreground/5 border border-[#FFD700]/30 rounded-lg focus:outline-none focus:border-[#FFD700] transition-colors text-foreground"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(['all', 'exchange', 'dormant', 'recent'] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterType === type
                    ? 'bg-[#FFD700] text-[#0A0A0A]'
                    : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10'
                }`}
              >
                {type === 'all' && <Filter className="w-4 h-4 inline mr-1" />}
                {type === 'exchange' && <Building2 className="w-4 h-4 inline mr-1" />}
                {type === 'dormant' && <Clock className="w-4 h-4 inline mr-1" />}
                {type === 'recent' && <TrendingUp className="w-4 h-4 inline mr-1" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Rich List Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-3d overflow-hidden mb-8"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-foreground/5 border-b border-[#FFD700]/20">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-bold text-foreground">
                  <SortButton field="rank" label="Rank" />
                </th>
                <th className="px-4 py-4 text-left text-sm font-bold text-foreground">
                  Address
                </th>
                <th className="px-4 py-4 text-right text-sm font-bold text-foreground">
                  <SortButton field="balance" label="Balance (BTC)" />
                </th>
                <th className="px-4 py-4 text-right text-sm font-bold text-foreground">
                  Balance (USD)
                </th>
                <th className="px-4 py-4 text-right text-sm font-bold text-foreground">
                  <SortButton field="percentageOfSupply" label="% of Supply" />
                </th>
                <th className="px-4 py-4 text-left text-sm font-bold text-foreground">
                  <SortButton field="lastActivity" label="Last Activity" />
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedAddresses.map((addr, index) => (
                <motion.tr
                  key={addr.address}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-[#FFD700]/10 hover:bg-foreground/5 transition-colors"
                >
                  {/* Rank */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {addr.rank <= 3 && (
                        <Crown className={`w-5 h-5 ${
                          addr.rank === 1 ? 'text-[#FFD700]' :
                          addr.rank === 2 ? 'text-gray-400' :
                          'text-[#CD7F32]'
                        }`} />
                      )}
                      <span className="font-bold text-foreground">#{addr.rank}</span>
                    </div>
                  </td>

                  {/* Address */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <code className="text-sm text-foreground font-mono">
                          {truncateAddress(addr.address)}
                        </code>
                        <button
                          onClick={() => handleCopy(addr.address)}
                          className="p-1 hover:bg-foreground/10 rounded transition-colors"
                          title="Copy address"
                        >
                          {copiedAddress === addr.address ? (
                            <Check className="w-4 h-4 text-[#4CAF50]" />
                          ) : (
                            <Copy className="w-4 h-4 text-foreground/50" />
                          )}
                        </button>
                      </div>
                      {addr.tag && (
                        <div className="flex items-center gap-1">
                          <span className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${getTypeColor(addr.type)}`}>
                            {getTypeIcon(addr.type)}
                            {addr.tag}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Balance BTC */}
                  <td className="px-4 py-4 text-right">
                    <span className="font-bold text-[#FFD700]">
                      ₿ {formatBalance(addr.balance)}
                    </span>
                  </td>

                  {/* Balance USD */}
                  <td className="px-4 py-4 text-right">
                    <span className="font-semibold text-foreground">
                      {formatUsd(addr.balanceUsd)}
                    </span>
                  </td>

                  {/* % of Supply */}
                  <td className="px-4 py-4 text-right">
                    <span className="text-foreground/70">
                      {addr.percentageOfSupply.toFixed(4)}%
                    </span>
                  </td>

                  {/* Last Activity */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {addr.isDormant && (
                        <Clock className="w-4 h-4 text-orange-400" />
                      )}
                      <span className={addr.isDormant ? 'text-orange-400' : 'text-foreground/70'}>
                        {formatDate(addr.lastActivity)}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#FFD700]/20">
            <div className="text-sm text-foreground/60">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedAddresses.length)} of {sortedAddresses.length} addresses
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-foreground px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-3d p-6"
      >
        <h3 className="text-lg font-bold text-[#FFD700] mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-foreground/70">Exchange Wallet</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#FFD700]" />
            <span className="text-sm text-foreground/70">Whale</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-foreground/70">Mining Pool</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-foreground/70">Institution</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-foreground/70">Dormant (&gt;1 year)</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

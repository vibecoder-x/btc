'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, Download, Calendar, TrendingUp, Landmark, Shield,
  Globe, Zap, ChevronDown, ChevronUp, Award, Users, Code
} from 'lucide-react';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  category: 'creation' | 'adoption' | 'price' | 'regulatory' | 'technical';
  impact: 'critical' | 'high' | 'medium';
}

export default function HistoryPage() {
  const [expandedEra, setExpandedEra] = useState<string>('creation');

  const timelineEvents: TimelineEvent[] = [
    // Creation & Early Years (2008-2009)
    {
      date: 'October 31, 2008',
      title: 'Bitcoin Whitepaper Published',
      description: 'Satoshi Nakamoto published "Bitcoin: A Peer-to-Peer Electronic Cash System" to the cryptography mailing list, introducing the concept of a decentralized digital currency.',
      category: 'creation',
      impact: 'critical'
    },
    {
      date: 'January 3, 2009',
      title: 'Genesis Block Mined',
      description: 'The first Bitcoin block was mined, embedding the Times headline "Chancellor on brink of second bailout for banks" as an implicit critique of central bank interventions.',
      category: 'creation',
      impact: 'critical'
    },
    {
      date: 'January 12, 2009',
      title: 'First Bitcoin Transaction',
      description: 'Satoshi Nakamoto sent 10 BTC to Hal Finney in the first peer-to-peer Bitcoin transaction, marking the beginning of the network\'s use.',
      category: 'creation',
      impact: 'critical'
    },

    // Early Adoption (2010-2012)
    {
      date: 'May 22, 2010',
      title: 'Bitcoin Pizza Day',
      description: 'First commercial transaction: 10,000 BTC purchased two pizzas worth ~$41. This date is now celebrated annually as Bitcoin Pizza Day.',
      category: 'adoption',
      impact: 'critical'
    },
    {
      date: 'July 2010',
      title: 'Mt. Gox Launches',
      description: 'Mt. Gox, originally a Magic: The Gathering trading card exchange, was repurposed as a Bitcoin trading platform, eventually handling over 70% of global Bitcoin trades.',
      category: 'adoption',
      impact: 'high'
    },
    {
      date: 'November 28, 2012',
      title: 'First Halving Event',
      description: 'Block reward reduced from 50 to 25 BTC, the first of Bitcoin\'s programmed supply halvings designed to control inflation.',
      category: 'technical',
      impact: 'critical'
    },

    // Volatility & Awareness (2013-2016)
    {
      date: 'March 2013',
      title: 'Cyprus Banking Crisis',
      description: 'Cyprus banking crisis triggered a 400% Bitcoin price surge as investors sought alternatives to traditional banking systems.',
      category: 'price',
      impact: 'high'
    },
    {
      date: 'December 2013',
      title: 'First Major Peak',
      description: 'Bitcoin price reached $1,156, marking its first major bull run and attracting mainstream media attention.',
      category: 'price',
      impact: 'critical'
    },
    {
      date: 'February 2014',
      title: 'Mt. Gox Collapse',
      description: 'Mt. Gox lost approximately 850,000 BTC (~$473 million). While devastating for users, the Bitcoin protocol remained unaffected, proving its resilience.',
      category: 'adoption',
      impact: 'critical'
    },
    {
      date: 'July 9, 2016',
      title: 'Second Halving',
      description: 'Block reward reduced from 25 to 12.5 BTC, continuing Bitcoin\'s deflationary monetary policy.',
      category: 'technical',
      impact: 'critical'
    },

    // Institutionalization (2017-2020)
    {
      date: 'August 1, 2017',
      title: 'Bitcoin Cash Hard Fork',
      description: 'Block size maximalists created Bitcoin Cash with 8MB blocks, splitting from the original Bitcoin chain.',
      category: 'technical',
      impact: 'high'
    },
    {
      date: 'August 24, 2017',
      title: 'SegWit Activation',
      description: 'Segregated Witness activated via User-Activated Soft Fork, fixing transaction malleability and enabling the Lightning Network.',
      category: 'technical',
      impact: 'critical'
    },
    {
      date: 'December 17, 2017',
      title: 'All-Time High (2017)',
      description: 'Bitcoin reached $19,834, capping an incredible year-long rally that brought cryptocurrency into mainstream consciousness.',
      category: 'price',
      impact: 'critical'
    },
    {
      date: 'May 11, 2020',
      title: 'Third Halving',
      description: 'Block reward reduced from 12.5 to 6.25 BTC, occurring amid the COVID-19 pandemic.',
      category: 'technical',
      impact: 'critical'
    },
    {
      date: 'August 2020',
      title: 'MicroStrategy Bitcoin Purchase',
      description: 'MicroStrategy purchased 21,454 BTC for $250 million, marking early corporate institutional adoption and treasury strategy.',
      category: 'adoption',
      impact: 'high'
    },

    // Global Adoption (2021-2025)
    {
      date: 'February 2021',
      title: 'Tesla Bitcoin Investment',
      description: 'Tesla allocated $1.5 billion to Bitcoin as a treasury reserve, signaling mainstream corporate acceptance.',
      category: 'adoption',
      impact: 'critical'
    },
    {
      date: 'June 9, 2021',
      title: 'El Salvador Legal Tender',
      description: 'El Salvador enacted Bitcoin Law, becoming the first sovereign nation to designate Bitcoin as legal tender.',
      category: 'regulatory',
      impact: 'critical'
    },
    {
      date: 'November 2021',
      title: 'All-Time High (2021)',
      description: 'Bitcoin price peaked at $68,789 during the bull market following the third halving and institutional adoption surge.',
      category: 'price',
      impact: 'critical'
    },
    {
      date: 'January 10, 2024',
      title: 'Spot Bitcoin ETF Approval',
      description: 'SEC approved spot Bitcoin ETFs from 11 issuers including BlackRock, providing institutional access and regulatory validation.',
      category: 'regulatory',
      impact: 'critical'
    },
    {
      date: 'April 19, 2024',
      title: 'Fourth Halving',
      description: 'Block reward reduced from 6.25 to 3.125 BTC per block, the most recent halving event.',
      category: 'technical',
      impact: 'critical'
    },
    {
      date: 'December 5, 2024',
      title: 'Breaking $100,000',
      description: 'Bitcoin broke $100,000 for the first time, a historic psychological milestone.',
      category: 'price',
      impact: 'critical'
    },
    {
      date: 'October 6, 2025',
      title: 'New All-Time High',
      description: 'Bitcoin reached $126,270, its highest price to date, with ETF inflows exceeding $61.98 billion.',
      category: 'price',
      impact: 'critical'
    }
  ];

  const eras = [
    {
      id: 'creation',
      name: 'Creation & Genesis',
      years: '2008-2009',
      description: 'The birth of Bitcoin and the first blockchain',
      icon: Code,
      color: '#FFD700'
    },
    {
      id: 'adoption',
      name: 'Early Adoption',
      years: '2010-2012',
      description: 'First transactions and exchanges emerge',
      icon: Users,
      color: '#FF6B35'
    },
    {
      id: 'awareness',
      name: 'Volatility & Awareness',
      years: '2013-2016',
      description: 'Bull runs, crashes, and mainstream attention',
      icon: TrendingUp,
      color: '#4CAF50'
    },
    {
      id: 'institutional',
      name: 'Institutionalization',
      years: '2017-2020',
      description: 'Technical upgrades and corporate interest',
      icon: Landmark,
      color: '#2196F3'
    },
    {
      id: 'global',
      name: 'Global Adoption',
      years: '2021-2025',
      description: 'Nations, ETFs, and mass acceptance',
      icon: Globe,
      color: '#9C27B0'
    }
  ];

  const categoryIcons = {
    creation: Code,
    adoption: Users,
    price: TrendingUp,
    regulatory: Landmark,
    technical: Zap
  };

  const categoryColors = {
    creation: 'border-blue-500 bg-blue-500/10',
    adoption: 'border-green-500 bg-green-500/10',
    price: 'border-[#FFD700] bg-[#FFD700]/10',
    regulatory: 'border-purple-500 bg-purple-500/10',
    technical: 'border-orange-500 bg-orange-500/10'
  };

  const getEventsByEra = (eraId: string) => {
    const eraYearRanges: { [key: string]: [number, number] } = {
      creation: [2008, 2009],
      adoption: [2010, 2012],
      awareness: [2013, 2016],
      institutional: [2017, 2020],
      global: [2021, 2025]
    };

    const [startYear, endYear] = eraYearRanges[eraId];
    return timelineEvents.filter(event => {
      const year = new Date(event.date).getFullYear();
      return year >= startYear && year <= endYear;
    });
  };

  const handleDownloadWhitepaper = () => {
    const link = document.createElement('a');
    link.href = '/bitcoin.pdf';
    link.download = 'bitcoin-whitepaper.pdf';
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-foreground/70 mb-6">
        <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Bitcoin History</span>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-20 h-20 rounded-2xl gradient-gold-orange flex items-center justify-center glow-gold">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gradient-gold">Bitcoin History</h1>
        </div>
        <p className="text-foreground/70 text-lg max-w-3xl mx-auto mb-8">
          From a cryptography mailing list to a global financial revolution - explore the complete
          timeline of Bitcoin's remarkable 16-year journey
        </p>

        {/* Download Whitepaper Button */}
        <motion.button
          onClick={handleDownloadWhitepaper}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl gradient-gold-orange hover:glow-gold transition-all duration-300 font-bold text-white text-lg"
        >
          <Download className="w-6 h-6" />
          Download Bitcoin Whitepaper (PDF)
        </motion.button>
        <p className="text-xs text-foreground/50 mt-3">
          Original whitepaper by Satoshi Nakamoto - October 31, 2008
        </p>
      </motion.div>

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
      >
        <div className="card-3d p-6 text-center">
          <Calendar className="w-8 h-8 text-[#FFD700] mx-auto mb-3" />
          <p className="text-3xl font-bold text-[#FFD700] mb-2">16+</p>
          <p className="text-sm text-foreground/70">Years of Operation</p>
        </div>
        <div className="card-3d p-6 text-center">
          <Shield className="w-8 h-8 text-[#4CAF50] mx-auto mb-3" />
          <p className="text-3xl font-bold text-[#4CAF50] mb-2">99.98%</p>
          <p className="text-sm text-foreground/70">Network Uptime</p>
        </div>
        <div className="card-3d p-6 text-center">
          <Award className="w-8 h-8 text-[#FF6B35] mx-auto mb-3" />
          <p className="text-3xl font-bold text-[#FF6B35] mb-2">4</p>
          <p className="text-sm text-foreground/70">Halving Events</p>
        </div>
        <div className="card-3d p-6 text-center">
          <TrendingUp className="w-8 h-8 text-[#2196F3] mx-auto mb-3" />
          <p className="text-3xl font-bold text-[#2196F3] mb-2">$126K</p>
          <p className="text-sm text-foreground/70">All-Time High</p>
        </div>
      </motion.div>

      {/* Era Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-gradient-gold mb-8 text-center">
          Timeline by Era
        </h2>

        <div className="space-y-6">
          {eras.map((era, index) => {
            const Icon = era.icon;
            const events = getEventsByEra(era.id);
            const isExpanded = expandedEra === era.id;

            return (
              <motion.div
                key={era.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card-3d overflow-hidden"
              >
                {/* Era Header */}
                <button
                  onClick={() => setExpandedEra(isExpanded ? '' : era.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-foreground/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${era.color}20`, border: `2px solid ${era.color}` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: era.color }} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-foreground mb-1">
                        {era.name}
                      </h3>
                      <p className="text-sm text-foreground/70">{era.years} • {era.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#FFD700]">
                      {events.length} events
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-[#FFD700]" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-[#FFD700]" />
                    )}
                  </div>
                </button>

                {/* Era Events */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-[#FFD700]/20 bg-foreground/5"
                  >
                    <div className="p-6 space-y-4">
                      {events.map((event, eventIndex) => {
                        const CategoryIcon = categoryIcons[event.category];
                        return (
                          <motion.div
                            key={eventIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * eventIndex }}
                            className={`p-4 rounded-xl border-l-4 ${categoryColors[event.category]}`}
                          >
                            <div className="flex items-start gap-4">
                              <CategoryIcon className="w-5 h-5 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <p className="text-sm font-semibold text-foreground/60">
                                    {event.date}
                                  </p>
                                  {event.impact === 'critical' && (
                                    <span className="px-2 py-1 text-xs font-bold bg-[#FFD700]/20 text-[#FFD700] rounded">
                                      CRITICAL
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-lg font-bold text-foreground mb-2">
                                  {event.title}
                                </h4>
                                <p className="text-foreground/70 text-sm leading-relaxed">
                                  {event.description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Key Figures Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card-3d p-8 mb-12"
      >
        <h2 className="text-3xl font-bold text-gradient-gold mb-6 flex items-center gap-3">
          <Users className="w-8 h-8" />
          Important Figures & Contributors
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 glassmorphism rounded-xl">
            <h3 className="text-xl font-bold text-[#FFD700] mb-3">Satoshi Nakamoto</h3>
            <p className="text-foreground/70">
              Pseudonymous creator of Bitcoin. Published the whitepaper in 2008, mined the genesis block in 2009,
              and vanished from public view in December 2010. True identity remains unknown.
            </p>
          </div>
          <div className="p-6 glassmorphism rounded-xl">
            <h3 className="text-xl font-bold text-[#FFD700] mb-3">Hal Finney</h3>
            <p className="text-foreground/70">
              Early cypherpunk and cryptographer. Received the first Bitcoin transaction from Satoshi Nakamoto
              and was a key early contributor to Bitcoin's development.
            </p>
          </div>
          <div className="p-6 glassmorphism rounded-xl">
            <h3 className="text-xl font-bold text-[#FFD700] mb-3">Gavin Andresen</h3>
            <p className="text-foreground/70">
              Lead Bitcoin Core maintainer from 2010-2014. Took over development from Satoshi and oversaw
              the transition to community-driven governance.
            </p>
          </div>
          <div className="p-6 glassmorphism rounded-xl">
            <h3 className="text-xl font-bold text-[#FFD700] mb-3">Nayib Bukele</h3>
            <p className="text-foreground/70">
              President of El Salvador who made history by enacting the Bitcoin Law in 2021, making El Salvador
              the first sovereign nation to adopt Bitcoin as legal tender.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Resilience Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card-3d p-8"
      >
        <h2 className="text-3xl font-bold text-gradient-gold mb-6">Resilience & Security</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 glassmorphism rounded-xl">
            <Shield className="w-12 h-12 text-[#4CAF50] mx-auto mb-4" />
            <p className="text-2xl font-bold text-[#4CAF50] mb-2">99.98%</p>
            <p className="text-sm text-foreground/70">Annual network uptime since SegWit (2017)</p>
          </div>
          <div className="text-center p-6 glassmorphism rounded-xl">
            <Code className="w-12 h-12 text-[#2196F3] mx-auto mb-4" />
            <p className="text-2xl font-bold text-[#2196F3] mb-2">2</p>
            <p className="text-sm text-foreground/70">Protocol-level bugs (both patched without damage)</p>
          </div>
          <div className="text-center p-6 glassmorphism rounded-xl">
            <Zap className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
            <p className="text-2xl font-bold text-[#FFD700] mb-2">50%+</p>
            <p className="text-sm text-foreground/70">Mining powered by renewable energy</p>
          </div>
        </div>
        <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-400">
            <strong>✓ Proven Resilience:</strong> Bitcoin's 16-year operational history demonstrates
            protocol resilience through consensus-enforced upgrades, voluntary participation, and economic
            incentives aligning miner and user interests toward decentralized security.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

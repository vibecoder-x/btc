'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MempoolData {
  feeRange: string;
  count: number;
  color: string;
}

interface MempoolStats {
  count: number;
  vsize: number;
  totalFee: number;
  avgFee: number;
  nextBlock: string;
  mempoolSize: string;
}

export default function MempoolPanel() {
  const [mounted, setMounted] = useState(false);
  const [mempoolData, setMempoolData] = useState<MempoolData[]>([
    { feeRange: '1-5', count: 0, color: '#4CAF50' },
    { feeRange: '5-10', count: 0, color: '#8BC34A' },
    { feeRange: '10-20', count: 0, color: '#FFD700' },
    { feeRange: '20-50', count: 0, color: '#FF9800' },
    { feeRange: '50-100', count: 0, color: '#FF6B35' },
    { feeRange: '100+', count: 0, color: '#F44336' },
  ]);
  const [stats, setStats] = useState<MempoolStats>({
    count: 0,
    vsize: 0,
    totalFee: 0,
    avgFee: 0,
    nextBlock: '~10 min',
    mempoolSize: '0 MB'
  });

  useEffect(() => {
    setMounted(true);

    const fetchMempoolData = async () => {
      try {
        const response = await fetch('/api/mempool');
        if (response.ok) {
          const data = await response.json();

          // Process fee histogram into our format
          if (data.fee_histogram && data.fee_histogram.length > 0) {
            // Group transactions by fee ranges
            const ranges = [
              { range: '1-5', min: 1, max: 5 },
              { range: '5-10', min: 5, max: 10 },
              { range: '10-20', min: 10, max: 20 },
              { range: '20-50', min: 20, max: 50 },
              { range: '50-100', min: 50, max: 100 },
              { range: '100+', min: 100, max: Infinity }
            ];

            const colors = ['#4CAF50', '#8BC34A', '#FFD700', '#FF9800', '#FF6B35', '#F44336'];

            const grouped = ranges.map((r, idx) => ({
              feeRange: r.range,
              count: data.fee_histogram
                .filter(([fee]: [number, number]) => fee >= r.min && fee < r.max)
                .reduce((sum: number, [_, vsize]: [number, number]) => sum + Math.floor(vsize / 250), 0),
              color: colors[idx]
            }));

            setMempoolData(grouped);
          }

          // Update stats
          setStats({
            count: data.count || 0,
            vsize: data.vsize || 0,
            totalFee: data.total_fee || 0,
            avgFee: data.recommended_fees?.medium || 0,
            nextBlock: '~10 min',
            mempoolSize: `${((data.mempool_size || 0) / 1024 / 1024).toFixed(2)} MB`
          });
        }
      } catch (error) {
        console.error('Error fetching mempool data:', error);
      }
    };

    // Initial fetch
    fetchMempoolData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchMempoolData, 30000);

    return () => clearInterval(interval);
  }, []);

  const totalTx = stats.count;

  // Format number consistently for server and client
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <motion.div
      id="mempool"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-3d p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gradient-gold mb-2">Mempool</h2>
          <p className="text-[#E0E0E0]">
            Unconfirmed Transactions: <span className="text-[#FFD700] font-semibold">{mounted ? formatNumber(totalTx) : totalTx}</span>
          </p>
          <p className="text-xs text-foreground/50 mt-1">
            Updates every 30 seconds • Real-time data
          </p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#4CAF50]/10 border border-[#4CAF50]/30">
          <div className="w-3 h-3 rounded-full bg-[#4CAF50] animate-pulse"></div>
          <span className="text-sm text-[#4CAF50] font-semibold">LIVE</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-foreground/70 mb-2">Fee Rate (sat/vB)</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mempoolData}>
          <XAxis dataKey="feeRange" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              background: 'rgba(10, 10, 15, 0.9)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '8px',
              color: '#ededed',
            }}
            cursor={{ fill: 'rgba(0, 255, 255, 0.1)' }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {mempoolData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="glassmorphism rounded-lg p-4">
          <p className="text-sm text-foreground/70 mb-1">Next Block</p>
          <p className="text-2xl font-bold text-[#FFD700]">{stats.nextBlock}</p>
        </div>
        <div className="glassmorphism rounded-lg p-4">
          <p className="text-sm text-foreground/70 mb-1">Avg Fee</p>
          <p className="text-2xl font-bold text-[#FF6B35]">{stats.avgFee} sat/vB</p>
        </div>
        <div className="glassmorphism rounded-lg p-4 col-span-2 md:col-span-1">
          <p className="text-sm text-foreground/70 mb-1">Mempool Size</p>
          <p className="text-2xl font-bold text-[#4CAF50]">{stats.mempoolSize}</p>
        </div>
      </div>
    </motion.div>
  );
}

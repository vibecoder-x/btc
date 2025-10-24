'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MempoolData {
  feeRange: string;
  count: number;
  color: string;
}

export default function MempoolPanel() {
  const [mounted, setMounted] = useState(false);
  const [mempoolData, setMempoolData] = useState<MempoolData[]>([
    { feeRange: '1-5', count: 1200, color: '#00ff88' },
    { feeRange: '5-10', count: 2500, color: '#00ffff' },
    { feeRange: '10-20', count: 3200, color: '#00aaff' },
    { feeRange: '20-50', count: 1800, color: '#ff8800' },
    { feeRange: '50-100', count: 900, color: '#ff6600' },
    { feeRange: '100+', count: 400, color: '#ff0000' },
  ]);

  useEffect(() => {
    setMounted(true);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMempoolData((prev) =>
        prev.map((item) => ({
          ...item,
          count: Math.max(100, item.count + Math.floor(Math.random() * 200 - 100)),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalTx = mempoolData.reduce((sum, item) => sum + item.count, 0);

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
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30">
          <div className="w-3 h-3 rounded-full bg-[#FFD700] animate-pulse glow-gold"></div>
          <span className="text-sm text-[#E0E0E0]">Live</span>
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
          <p className="text-2xl font-bold text-neon-blue">~10 min</p>
        </div>
        <div className="glassmorphism rounded-lg p-4">
          <p className="text-sm text-foreground/70 mb-1">Avg Fee</p>
          <p className="text-2xl font-bold text-neon-orange">24 sat/vB</p>
        </div>
        <div className="glassmorphism rounded-lg p-4 col-span-2 md:col-span-1">
          <p className="text-sm text-foreground/70 mb-1">Mempool Size</p>
          <p className="text-2xl font-bold text-neon-green">142 MB</p>
        </div>
      </div>
    </motion.div>
  );
}

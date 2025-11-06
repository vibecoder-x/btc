import HeroSection from '@/components/HeroSection';
import SearchBar from '@/components/SearchBar';
import LiveBlocksAnimation from '@/components/LiveBlocksAnimation';
import BitcoinPriceChart from '@/components/BitcoinPriceChart';
import MempoolPanel from '@/components/MempoolPanel';
import BlocksTable from '@/components/BlocksTable';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Search Bar */}
        <section className="mb-12">
          <SearchBar />
        </section>

        {/* Live Blocks Animation */}
        <section>
          <LiveBlocksAnimation />
        </section>

        {/* Bitcoin Price Chart */}
        <section>
          <BitcoinPriceChart />
        </section>

        {/* Mempool Panel */}
        <section>
          <MempoolPanel />
        </section>

        {/* Recent Blocks */}
        <section>
          <BlocksTable />
        </section>
      </main>
    </div>
  );
}

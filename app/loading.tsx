export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-12 md:h-16 bg-[#FFD700]/20 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-6 bg-foreground/10 rounded-lg mb-8 max-w-2xl mx-auto animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 w-40 bg-[#FFD700]/20 rounded-lg animate-pulse"></div>
              <div className="h-12 w-40 bg-foreground/10 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Search Bar Skeleton */}
        <section className="mb-12">
          <div className="glassmorphism rounded-2xl p-6">
            <div className="h-14 bg-foreground/10 rounded-lg animate-pulse"></div>
          </div>
        </section>

        {/* Bitcoin Price Chart Skeleton */}
        <section>
          <div className="glassmorphism rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="mb-4 md:mb-0 flex-1">
                <div className="h-8 w-48 bg-[#FFD700]/20 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-12 w-64 bg-[#FFD700]/20 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-10 w-24 bg-[#FFD700]/10 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glassmorphism p-6 h-32 animate-pulse"></div>
              <div className="glassmorphism p-6 h-32 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Mempool Panel Skeleton */}
        <section>
          <div className="glassmorphism rounded-2xl p-6 md:p-8">
            <div className="h-8 w-48 bg-[#FFD700]/20 rounded-lg mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glassmorphism p-6 h-32 animate-pulse"></div>
              <div className="glassmorphism p-6 h-32 animate-pulse"></div>
              <div className="glassmorphism p-6 h-32 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Blocks Table Skeleton */}
        <section>
          <div className="glassmorphism rounded-2xl p-6 md:p-8">
            <div className="h-8 w-48 bg-[#FFD700]/20 rounded-lg mb-6 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="glassmorphism p-4 h-20 animate-pulse"></div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

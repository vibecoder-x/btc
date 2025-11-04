import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Web3ModalProvider } from "@/context/Web3ModalProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "btcindexer.com - Bitcoin Blockchain Explorer",
  description: "Professional Bitcoin blockchain explorer with real-time blocks, transactions, and mempool analysis",
  keywords: ["bitcoin", "blockchain", "explorer", "mempool", "transactions", "blocks", "btc", "crypto"],
  authors: [{ name: "BTCIndexer" }],
  openGraph: {
    title: "btcindexer.com - Bitcoin Blockchain Explorer",
    description: "Professional Bitcoin blockchain explorer with real-time blocks, transactions, and mempool analysis",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "btcindexer.com - Bitcoin Blockchain Explorer",
    description: "Professional Bitcoin blockchain explorer with real-time data",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased flex flex-col min-h-screen`}
      >
        <Web3ModalProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Web3ModalProvider>
      </body>
    </html>
  );
}

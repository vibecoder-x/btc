'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-foreground/70 mb-6">
        <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Terms of Service</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-xl gradient-gold-orange flex items-center justify-center glow-gold">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gradient-gold">Terms of Service</h1>
          </div>
          <p className="text-foreground/70 text-lg">
            Last Updated: January 4, 2025
          </p>
        </div>

        {/* Content */}
        <div className="card-3d p-8 md:p-12 max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">1. Acceptance of Terms</h2>
            <p className="text-foreground/80 leading-relaxed">
              By accessing or using btcindexer.com ("Service", "Website", "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service. We reserve the right to update these Terms at any time, and your continued use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">2. Description of Service</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              BTCIndexer provides a Bitcoin blockchain explorer and API service that allows users to:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>View Bitcoin blockchain data (blocks, transactions, addresses)</li>
              <li>Access real-time mempool information</li>
              <li>Monitor network statistics and mining data</li>
              <li>Integrate blockchain data via our API</li>
              <li>Track Bitcoin halving events and supply metrics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">3. User Accounts and Wallet Authentication</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              To access certain features, you may connect a cryptocurrency wallet:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>You are responsible for maintaining the security of your wallet and private keys</li>
              <li>We do NOT store your private keys or seed phrases</li>
              <li>You are responsible for all activities that occur through your wallet connection</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>We are not responsible for any loss resulting from unauthorized access to your wallet</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">4. API Usage and Rate Limits</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              <strong className="text-[#FFD700]">Free Tier:</strong> 100 API requests per day per wallet address
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              <strong className="text-[#FFD700]">Unlimited Tier:</strong> No rate limits for users who have purchased unlimited access ($50 one-time payment)
            </p>
            <p className="text-foreground/80 leading-relaxed">
              You agree not to abuse the API by attempting to circumvent rate limits, making excessive requests, or using automated systems to scrape data beyond the permitted limits. Violation may result in immediate termination of access without refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">5. Payment Terms</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              <strong>Pricing:</strong> $50 one-time payment for lifetime unlimited API access
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              <strong>Payment Methods:</strong> Cryptocurrency only (ETH, SOL, BTC)
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              <strong>No Refunds:</strong> Due to the nature of cryptocurrency transactions and our lifetime access model, all purchases are final and non-refundable. Please test our free tier before upgrading.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              <strong>Price Changes:</strong> We reserve the right to modify pricing for new users. Existing unlimited plan holders are grandfathered at their purchase price.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">6. Acceptable Use Policy</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>Use the Service for any illegal purposes or in violation of any laws</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Transmit viruses, malware, or any malicious code</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Resell, redistribute, or sublicense API access without permission</li>
              <li>Use the Service to spam, phish, or engage in fraudulent activities</li>
              <li>Reverse engineer, decompile, or attempt to extract source code</li>
              <li>Use automated systems (bots, scrapers) to access the Service beyond permitted limits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">7. Data Accuracy and Disclaimers</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              While we strive for accuracy, we make NO WARRANTIES regarding:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>Accuracy, completeness, or timeliness of blockchain data</li>
              <li>Availability or uninterrupted access to the Service</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement of third-party rights</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">8. Limitation of Liability</h2>
            <p className="text-foreground/80 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, BTCINDEXER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4 mt-4">
              <li>Loss of profits, data, or business opportunities</li>
              <li>Financial losses due to trading decisions based on our data</li>
              <li>Damages resulting from unauthorized access to your wallet</li>
              <li>Service interruptions or downtime</li>
              <li>Errors, bugs, or inaccuracies in blockchain data</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              Our total liability shall not exceed the amount you paid us in the twelve (12) months preceding the claim (maximum $50).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">9. Intellectual Property</h2>
            <p className="text-foreground/80 leading-relaxed">
              All content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, images, audio clips, and software, are the exclusive property of BTCIndexer and are protected by international copyright, trademark, and other intellectual property laws. The Bitcoin blockchain data itself is public domain.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">10. Termination</h2>
            <p className="text-foreground/80 leading-relaxed">
              We reserve the right to suspend or terminate your access to the Service at any time, with or without notice, for any reason, including but not limited to violation of these Terms. Upon termination, your right to use the Service will immediately cease. Paid unlimited access may be revoked without refund in cases of Terms violations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">11. Governing Law and Dispute Resolution</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which BTCIndexer operates, without regard to conflict of law principles.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration, except where prohibited by law. You waive any right to participate in class action lawsuits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">12. Changes to Terms</h2>
            <p className="text-foreground/80 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Website. Your continued use of the Service after changes constitutes acceptance of the modified Terms. We recommend reviewing these Terms periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">13. Severability</h2>
            <p className="text-foreground/80 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">14. Contact Information</h2>
            <p className="text-foreground/80 leading-relaxed">
              For questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-[#FFD700]/10 rounded-lg border border-[#FFD700]/30">
              <p className="text-foreground"><strong>Email:</strong> support@btcindexer.com</p>
              <p className="text-foreground"><strong>Twitter:</strong> @btcindexer</p>
              <p className="text-foreground"><strong>GitHub:</strong> github.com/btcindexer</p>
            </div>
          </section>

          <section className="border-t border-[#FFD700]/20 pt-8">
            <p className="text-foreground/60 text-sm text-center">
              By using BTCIndexer, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-[#FFD700] hover:text-[#FF6B35] transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

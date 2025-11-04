'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-foreground/70 mb-6">
        <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Disclaimer</span>
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
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gradient-gold">Disclaimer</h1>
          </div>
          <p className="text-foreground/70 text-lg">
            Last Updated: January 4, 2025
          </p>
        </div>

        {/* Content */}
        <div className="card-3d p-8 md:p-12 max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Important Notice</h2>
            <p className="text-foreground/80 leading-relaxed">
              This Disclaimer applies to the use of btcindexer.com and all associated services, API, and tools ("Service"). By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by this Disclaimer.
            </p>
            <div className="mt-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-lg">
              <p className="text-red-400 font-semibold text-center">
                ⚠️ PLEASE READ THIS DISCLAIMER CAREFULLY BEFORE USING OUR SERVICE ⚠️
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">1. Not Financial Advice</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              <strong className="text-red-400">BTCIndexer DOES NOT provide financial, investment, tax, or legal advice.</strong>
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              All information, data, charts, statistics, and analysis provided on our Service are for <strong className="text-[#FFD700]">informational and educational purposes only</strong>. Nothing on this website should be construed as:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>An offer to buy or sell Bitcoin or any cryptocurrency</li>
              <li>Investment advice or recommendations</li>
              <li>Financial planning or wealth management services</li>
              <li>Tax advice or guidance</li>
              <li>Legal advice or interpretation</li>
              <li>A solicitation for investment</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              <strong>You should consult with qualified financial, tax, and legal professionals before making any investment decisions.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">2. Cryptocurrency Investment Risks</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Cryptocurrency investments, including Bitcoin, carry <strong className="text-red-400">substantial risks</strong>:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li><strong>High Volatility:</strong> Bitcoin prices can fluctuate dramatically within short periods</li>
              <li><strong>Loss of Capital:</strong> You may lose all or part of your investment</li>
              <li><strong>Regulatory Risk:</strong> Government regulations may change and impact cryptocurrency value</li>
              <li><strong>Technology Risk:</strong> Blockchain technology is complex and may have vulnerabilities</li>
              <li><strong>Market Risk:</strong> Cryptocurrency markets are relatively new and can be illiquid</li>
              <li><strong>Security Risk:</strong> Hacks, scams, and theft are prevalent in the crypto space</li>
              <li><strong>Irreversibility:</strong> Bitcoin transactions cannot be reversed</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              <strong className="text-red-400">Never invest more than you can afford to lose.</strong> Cryptocurrencies are highly speculative and unsuitable for many investors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">3. No Warranties - Data Accuracy</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              While we strive for accuracy, we make <strong className="text-red-400">NO WARRANTIES OR REPRESENTATIONS</strong> regarding:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li><strong>Accuracy:</strong> Blockchain data may contain errors, omissions, or be outdated</li>
              <li><strong>Completeness:</strong> Data may be incomplete or missing certain information</li>
              <li><strong>Timeliness:</strong> Real-time data may have delays or synchronization issues</li>
              <li><strong>Reliability:</strong> Third-party data sources may be unreliable</li>
              <li><strong>Availability:</strong> Service may experience downtime or interruptions</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">4. Third-Party Data Sources</h2>
            <p className="text-foreground/80 leading-relaxed">
              Our Service relies on third-party blockchain data providers, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4 mt-2">
              <li>Blockstream</li>
              <li>Mempool.space</li>
              <li>Bitcoin Core nodes</li>
              <li>CoinMarketCap</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              We are <strong className="text-red-400">NOT responsible</strong> for the accuracy, reliability, or availability of data from these third-party sources. Any errors or issues with third-party data are beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">5. No Liability for Losses</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              <strong className="text-red-400">BTCIndexer SHALL NOT BE LIABLE</strong> for any losses, damages, or consequences resulting from:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>Reliance on information provided on our Service</li>
              <li>Investment or trading decisions based on our data</li>
              <li>Errors, omissions, or inaccuracies in blockchain data</li>
              <li>Service downtime, interruptions, or unavailability</li>
              <li>Security breaches, hacks, or unauthorized access</li>
              <li>Loss of funds due to wallet connection or transactions</li>
              <li>Changes in Bitcoin price or market conditions</li>
              <li>Regulatory actions or legal issues</li>
              <li>Use or misuse of our API</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              YOU ASSUME ALL RISKS ASSOCIATED WITH USING OUR SERVICE AND CRYPTOCURRENCY INVESTMENTS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">6. No Guarantee of Profits</h2>
            <p className="text-foreground/80 leading-relaxed">
              We make <strong className="text-red-400">NO GUARANTEES OR PROMISES</strong> regarding:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4 mt-2">
              <li>Future Bitcoin prices or returns</li>
              <li>Profitability of investments</li>
              <li>Performance of mining operations</li>
              <li>Outcome of halving events</li>
              <li>Market trends or predictions</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              Historical performance is <strong>NOT indicative of future results.</strong> Past price increases do not guarantee future gains.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">7. API Usage Disclaimer</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Our API is provided for integration purposes only. We make no warranties regarding:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li><strong>Uptime:</strong> We do not guarantee 100% uptime or availability</li>
              <li><strong>Response Times:</strong> API response times may vary</li>
              <li><strong>Rate Limits:</strong> Rate limits may change without notice</li>
              <li><strong>Backwards Compatibility:</strong> API endpoints may change or be deprecated</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              <strong>Production Use:</strong> If you use our API in production applications, you do so at your own risk. Implement proper error handling, fallbacks, and monitoring.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">8. Wallet Connection Disclaimer</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              When connecting your cryptocurrency wallet:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>You are solely responsible for the security of your private keys and seed phrases</li>
              <li>We NEVER request or store your private keys</li>
              <li>We are NOT responsible for loss of funds due to phishing, scams, or wallet hacks</li>
              <li>Always verify you are on the correct website (btcindexer.com)</li>
              <li>Use hardware wallets for enhanced security</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              <strong className="text-red-400">Never share your private keys or seed phrases with anyone.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">9. No Endorsement</h2>
            <p className="text-foreground/80 leading-relaxed">
              References to specific mining pools, wallets, exchanges, or other third-party services do not constitute an endorsement or recommendation. We are not affiliated with these entities unless explicitly stated. Always conduct your own research (DYOR) before using any third-party service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">10. Regulatory Compliance</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Cryptocurrency regulations vary by jurisdiction. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>Understanding and complying with laws in your jurisdiction</li>
              <li>Paying applicable taxes on cryptocurrency transactions</li>
              <li>Obtaining necessary licenses or registrations</li>
              <li>Adhering to anti-money laundering (AML) and know-your-customer (KYC) regulations</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              We do NOT provide legal or tax advice. Consult with qualified professionals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">11. Age Restriction</h2>
            <p className="text-foreground/80 leading-relaxed">
              Our Service is intended for users aged 18 and older. If you are under 18, you may not use this Service. Cryptocurrency investments are not suitable for minors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">12. External Links</h2>
            <p className="text-foreground/80 leading-relaxed">
              Our Service may contain links to external websites. We are not responsible for the content, accuracy, privacy practices, or availability of third-party sites. Clicking external links is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">13. Changes to Disclaimer</h2>
            <p className="text-foreground/80 leading-relaxed">
              We reserve the right to update this Disclaimer at any time without notice. Changes will be effective immediately upon posting. Your continued use of the Service constitutes acceptance of the updated Disclaimer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">14. Jurisdictional Issues</h2>
            <p className="text-foreground/80 leading-relaxed">
              Our Service may not be available or appropriate for use in all jurisdictions. If you access our Service from outside our primary jurisdiction, you do so at your own initiative and are responsible for compliance with local laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">15. Contact Information</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              If you have questions about this Disclaimer, contact us at:
            </p>
            <div className="mt-4 p-4 bg-[#FFD700]/10 rounded-lg border border-[#FFD700]/30">
              <p className="text-foreground"><strong>Email:</strong> legal@btcindexer.com</p>
              <p className="text-foreground"><strong>Support:</strong> support@btcindexer.com</p>
              <p className="text-foreground"><strong>Website:</strong> btcindexer.com</p>
            </div>
          </section>

          <section className="border-t border-[#FFD700]/20 pt-8">
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-6">
              <p className="text-red-400 font-bold text-lg mb-4 text-center">
                ⚠️ FINAL WARNING ⚠️
              </p>
              <p className="text-foreground/80 text-center leading-relaxed">
                BY USING BTCINDEXER, YOU ACKNOWLEDGE THAT:
              </p>
              <ul className="text-foreground/80 space-y-2 mt-4">
                <li>✓ You have read and understood this Disclaimer</li>
                <li>✓ You accept all risks associated with cryptocurrency</li>
                <li>✓ You will not hold BTCIndexer liable for any losses</li>
                <li>✓ You are using the Service at your own risk</li>
                <li>✓ You understand this is not financial advice</li>
              </ul>
            </div>
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

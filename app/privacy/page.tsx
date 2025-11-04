'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-foreground/70 mb-6">
        <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Privacy Policy</span>
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gradient-gold">Privacy Policy</h1>
          </div>
          <p className="text-foreground/70 text-lg">
            Last Updated: January 4, 2025
          </p>
        </div>

        {/* Content */}
        <div className="card-3d p-8 md:p-12 max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">1. Introduction</h2>
            <p className="text-foreground/80 leading-relaxed">
              BTCIndexer ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website btcindexer.com and API services. Please read this policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-[#FF6B35] mb-3 mt-6">2.1. Wallet Information</h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              When you connect your cryptocurrency wallet to our service, we collect:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li><strong>Public Wallet Address:</strong> Your wallet's public address (e.g., Ethereum, Solana, Bitcoin address)</li>
              <li><strong>Wallet Type:</strong> The type of wallet you use (e.g., MetaMask, Phantom, OKX Wallet)</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              <strong className="text-[#4CAF50]">Important:</strong> We <strong className="underline">NEVER</strong> collect, store, or have access to your private keys, seed phrases, or passwords.
            </p>

            <h3 className="text-xl font-semibold text-[#FF6B35] mb-3 mt-6">2.2. API Usage Data</h3>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>API requests made (endpoints accessed, parameters used)</li>
              <li>Request timestamps and frequency</li>
              <li>Response times and status codes</li>
              <li>Number of requests per day/month</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#FF6B35] mb-3 mt-6">2.3. Automatic Data Collection</h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              When you visit our website, we automatically collect:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
              <li>Device information</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#FF6B35] mb-3 mt-6">2.4. Payment Information</h3>
            <p className="text-foreground/80 leading-relaxed">
              For unlimited plan purchases, we record:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>Transaction hash (blockchain transaction ID)</li>
              <li>Payment amount and cryptocurrency used</li>
              <li>Timestamp of payment</li>
              <li>Your wallet address for verification</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              <strong>Note:</strong> All payments are processed on-chain. We do not store credit card information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">3. How We Use Your Information</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li><strong>Service Provision:</strong> To provide and maintain our API and website services</li>
              <li><strong>Authentication:</strong> To identify and authenticate users via wallet addresses</li>
              <li><strong>Rate Limiting:</strong> To enforce API rate limits and prevent abuse</li>
              <li><strong>Payment Verification:</strong> To verify unlimited plan purchases and grant access</li>
              <li><strong>Analytics:</strong> To understand usage patterns and improve our service</li>
              <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
              <li><strong>Communication:</strong> To send important service updates (if you opt-in)</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              We do NOT sell, rent, or trade your personal information. We may share your information only in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold text-[#FF6B35] mb-3 mt-6">4.1. Service Providers</h3>
            <p className="text-foreground/80 leading-relaxed">
              We may share data with third-party service providers who assist us in operating our services:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4 mt-2">
              <li>Hosting providers (server infrastructure)</li>
              <li>Analytics tools (usage statistics)</li>
              <li>Blockchain data providers (Blockstream, Mempool.space)</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#FF6B35] mb-3 mt-6">4.2. Legal Requirements</h3>
            <p className="text-foreground/80 leading-relaxed">
              We may disclose information if required by law, court order, or government request, or to:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4 mt-2">
              <li>Comply with legal processes</li>
              <li>Enforce our Terms of Service</li>
              <li>Protect our rights, property, or safety</li>
              <li>Investigate fraud or security issues</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#FF6B35] mb-3 mt-6">4.3. Business Transfers</h3>
            <p className="text-foreground/80 leading-relaxed">
              If BTCIndexer is involved in a merger, acquisition, or asset sale, your information may be transferred. We will notify you via email or prominent website notice before your information is transferred.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>Remember your preferences</li>
              <li>Authenticate your wallet connection</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Improve user experience</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              You can configure your browser to refuse cookies, but this may limit some features of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">6. Data Security</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li><strong>Encryption:</strong> HTTPS/TLS encryption for all data transmissions</li>
              <li><strong>Database Security:</strong> Encrypted databases with access controls</li>
              <li><strong>No Sensitive Data:</strong> We never store private keys or passwords</li>
              <li><strong>Regular Audits:</strong> Periodic security reviews and updates</li>
              <li><strong>Limited Access:</strong> Restricted employee access to user data</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">7. Data Retention</h2>
            <p className="text-foreground/80 leading-relaxed">
              We retain your information for as long as necessary to:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4 mt-2">
              <li>Provide our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              <strong>API Usage Logs:</strong> Retained for 12 months<br />
              <strong>Payment Records:</strong> Retained indefinitely for unlimited plan verification<br />
              <strong>Wallet Addresses:</strong> Retained while your account is active
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">8. Your Privacy Rights</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>

            <h3 className="text-xl font-semibold text-[#FF6B35] mb-3 mt-6">8.1. General Rights</h3>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your data ("Right to be Forgotten")</li>
              <li><strong>Portability:</strong> Request export of your data</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#FF6B35] mb-3 mt-6">8.2. GDPR Rights (EU Users)</h3>
            <p className="text-foreground/80 leading-relaxed">
              EU users have additional rights under GDPR, including the right to lodge a complaint with a supervisory authority.
            </p>

            <h3 className="text-xl font-semibold text-[#FF6B35] mb-3 mt-6">8.3. CCPA Rights (California Users)</h3>
            <p className="text-foreground/80 leading-relaxed">
              California residents have rights under the California Consumer Privacy Act (CCPA) to know what personal information is collected and to opt-out of data selling (note: we do not sell data).
            </p>

            <p className="text-foreground/80 leading-relaxed mt-6">
              To exercise these rights, contact us at <strong className="text-[#FFD700]">privacy@btcindexer.com</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">9. Children's Privacy</h2>
            <p className="text-foreground/80 leading-relaxed">
              Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will delete the information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">10. International Data Transfers</h2>
            <p className="text-foreground/80 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our Service, you consent to such transfers. We take appropriate safeguards to ensure your data remains protected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">11. Third-Party Links</h2>
            <p className="text-foreground/80 leading-relaxed">
              Our website may contain links to third-party websites (e.g., Blockstream, Mempool.space). We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">12. Changes to Privacy Policy</h2>
            <p className="text-foreground/80 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">13. Contact Information</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="mt-4 p-4 bg-[#FFD700]/10 rounded-lg border border-[#FFD700]/30">
              <p className="text-foreground"><strong>Email:</strong> privacy@btcindexer.com</p>
              <p className="text-foreground"><strong>Support:</strong> support@btcindexer.com</p>
              <p className="text-foreground"><strong>Twitter:</strong> @btcindexer</p>
              <p className="text-foreground"><strong>GitHub:</strong> github.com/btcindexer</p>
            </div>
          </section>

          <section className="border-t border-[#FFD700]/20 pt-8">
            <p className="text-foreground/60 text-sm text-center">
              By using BTCIndexer, you acknowledge that you have read and understood this Privacy Policy.
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

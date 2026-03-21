import React from "react";
import { CreditCard, PieChart, TrendingUp, Shield } from "lucide-react";

export default function FinancialInclusionModel() {
  return (
    <section className="px-6 py-24 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full mb-6">
            <span className="text-blue-400 font-bold text-sm tracking-wide">
              FINANCIAL INCLUSION
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Building Africa's
            <span className="block bg-gradient-to-r from-[#FF6B00] to-[#FFD700] bg-clip-text text-transparent">
              Digital Finance Future
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Every transaction on Grapper is a step toward financial
            inclusion—building credit history, digital literacy, and economic
            participation for Africa's youth.
          </p>
        </div>

        {/* Financial Inclusion Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-lg border border-white/10 rounded-3xl p-10">
            <CreditCard className="text-[#FF6B00] mb-6" size={48} />
            <h3 className="text-3xl font-bold text-white mb-4">
              Digital Payment Adoption
            </h3>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              89% of our users made their first digital payment through Grapper.
              We're onboarding thousands of students to digital finance who were
              previously excluded.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
                <span className="text-gray-300">
                  Mobile money integration (M-Pesa, MTN, Airtel)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
                <span className="text-gray-300">
                  Stripe & Paystack for international payments
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
                <span className="text-gray-300">
                  Secure escrow system for buyer protection
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-lg border border-white/10 rounded-3xl p-10">
            <TrendingUp className="text-[#FFD700] mb-6" size={48} />
            <h3 className="text-3xl font-bold text-white mb-4">
              Income Tracking & Growth
            </h3>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              Students see real-time earnings, transaction history, and
              financial analytics—building literacy and entrepreneurial skills
              through hands-on experience.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>
                <span className="text-gray-300">
                  Transparent earnings dashboard
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>
                <span className="text-gray-300">
                  Performance metrics & growth insights
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>
                <span className="text-gray-300">
                  Tax-ready income statements
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-lg border border-white/10 rounded-3xl p-10">
            <Shield className="text-[#FFD700] mb-6" size={48} />
            <h3 className="text-3xl font-bold text-white mb-4">
              Trust & Verification
            </h3>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              University email verification, peer reviews, and secure payments
              create a trusted ecosystem—critical for building digital economic
              confidence.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
                <span className="text-gray-300">
                  Verified student identities
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
                <span className="text-gray-300">
                  Peer rating system (4.8/5.0 average)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
                <span className="text-gray-300">
                  Dispute resolution mechanism
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-lg border border-white/10 rounded-3xl p-10">
            <PieChart className="text-[#FF6B00] mb-6" size={48} />
            <h3 className="text-3xl font-bold text-white mb-4">
              Financial Literacy
            </h3>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              Beyond payments, we're teaching budgeting, pricing strategies,
              client management, and entrepreneurship—skills that last a
              lifetime.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>
                <span className="text-gray-300">
                  In-app financial education content
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>
                <span className="text-gray-300">
                  Pricing guidance & market insights
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>
                <span className="text-gray-300">
                  Business skills development
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mastercard Alignment */}
        <div className="bg-gradient-to-r from-[#FF6B00]/20 to-[#FFD700]/20 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-10">
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            Why This Aligns With Mastercard's Mission
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-black text-[#FFD700] mb-3">1M+</div>
              <p className="text-gray-300 leading-relaxed">
                Young Africans we'll onboard to digital payments within 3 years
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-[#FF6B00] mb-3">
                $50M+
              </div>
              <p className="text-gray-300 leading-relaxed">
                In digital transactions processed annually by 2027
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-[#FFD700] mb-3">
                100%
              </div>
              <p className="text-gray-300 leading-relaxed">
                Transparent, traceable digital economy—building Africa's credit
                infrastructure
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

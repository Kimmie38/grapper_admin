import React from "react";
import { Globe, Users, TrendingUp, MapPin } from "lucide-react";

export default function MarketContext() {
  return (
    <section className="px-6 py-24 relative bg-[#0B0B0F]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6">
            <span className="text-purple-400 font-bold text-sm tracking-wide">
              MARKET OPPORTUNITY
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Africa's Biggest
            <span className="block bg-gradient-to-r from-[#FF6B00] to-[#FFD700] bg-clip-text text-transparent">
              Untapped Market
            </span>
          </h2>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center">
            <Globe className="text-[#FF6B00] mx-auto mb-4" size={48} />
            <div className="text-5xl font-black text-white mb-2">1.4B</div>
            <div className="text-gray-400">People in Africa</div>
            <div className="text-[#FFD700] text-sm mt-2">60% under age 25</div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center">
            <Users className="text-[#FFD700] mx-auto mb-4" size={48} />
            <div className="text-5xl font-black text-white mb-2">30M+</div>
            <div className="text-gray-400">University Students</div>
            <div className="text-[#FF6B00] text-sm mt-2">
              Growing 6% annually
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center">
            <TrendingUp className="text-[#FF6B00] mx-auto mb-4" size={48} />
            <div className="text-5xl font-black text-white mb-2">$8.5B</div>
            <div className="text-gray-400">EdTech Market Size</div>
            <div className="text-[#FFD700] text-sm mt-2">By 2030</div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center">
            <MapPin className="text-[#FFD700] mx-auto mb-4" size={48} />
            <div className="text-5xl font-black text-white mb-2">54</div>
            <div className="text-gray-400">Countries to Expand</div>
            <div className="text-[#FF6B00] text-sm mt-2">
              Pan-African potential
            </div>
          </div>
        </div>

        {/* Current Traction */}
        <div className="bg-gradient-to-br from-[#FF6B00]/10 to-[#FFD700]/10 border border-[#FFD700]/20 rounded-3xl p-10 mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Our Current Footprint
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-[#FFD700] mb-3">
                Nigeria 🇳🇬
              </div>
              <p className="text-gray-300 mb-2">3,200+ active users</p>
              <p className="text-gray-500 text-sm">
                Lagos, Abuja, Ibadan, Port Harcourt
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-[#FF6B00] mb-3">
                Ghana 🇬🇭
              </div>
              <p className="text-gray-300 mb-2">1,100+ active users</p>
              <p className="text-gray-500 text-sm">Accra, Kumasi, Cape Coast</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-[#FFD700] mb-3">
                Kenya 🇰🇪
              </div>
              <p className="text-gray-300 mb-2">900+ active users</p>
              <p className="text-gray-500 text-sm">Nairobi, Mombasa, Kisumu</p>
            </div>
          </div>
        </div>

        {/* Why Now */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Why This Moment Matters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center flex-shrink-0 text-black font-black">
                1
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Mobile Penetration at 50%+
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Africa's smartphone adoption has hit critical mass, making
                  digital marketplaces accessible to students everywhere
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center flex-shrink-0 text-white font-black">
                2
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  COVID Accelerated Digital Adoption
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Students now expect online services, remote work, and digital
                  payments as standard
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center flex-shrink-0 text-black font-black">
                3
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Youth Unemployment Crisis
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  67% youth unemployment creates massive demand for
                  income-generating opportunities
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center flex-shrink-0 text-white font-black">
                4
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Rising Education Costs
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Students are desperate for affordable academic support and
                  income to stay enrolled
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { DollarSign, Users, Megaphone, Code } from "lucide-react";

export default function GrantUtilization() {
  const utilization = [
    {
      category: "Product Development",
      amount: "$40,000",
      percentage: "40%",
      icon: Code,
      items: [
        "Mobile money integration (M-Pesa, MTN, Airtel)",
        "Enhanced security & fraud prevention",
        "In-app financial literacy content",
        "Multi-language support (English, French, Swahili)",
      ],
      color: "#FF6B00",
    },
    {
      category: "Market Expansion",
      amount: "$30,000",
      percentage: "30%",
      icon: Megaphone,
      items: [
        "University partnerships (5 new countries)",
        "Campus ambassador program (50 universities)",
        "Student marketing & onboarding campaigns",
        "Local payment provider integrations",
      ],
      color: "#FFD700",
    },
    {
      category: "User Acquisition",
      amount: "$20,000",
      percentage: "20%",
      icon: Users,
      items: [
        "Digital marketing & social media ads",
        "Student referral incentive program",
        "Campus activation events",
        "Influencer partnerships & content",
      ],
      color: "#FF6B00",
    },
    {
      category: "Operations & Team",
      amount: "$10,000",
      percentage: "10%",
      icon: DollarSign,
      items: [
        "Customer support team expansion",
        "Legal & compliance (multi-country)",
        "Data analytics & impact measurement",
        "Contingency fund",
      ],
      color: "#FFD700",
    },
  ];

  return (
    <section className="px-6 py-24 relative bg-[#0B0B0F]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-full mb-6">
            <span className="text-[#FF6B00] font-bold text-sm tracking-wide">
              GRANT UTILIZATION
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            How We'll Use
            <span className="block bg-gradient-to-r from-[#FF6B00] to-[#FFD700] bg-clip-text text-transparent">
              $100,000 to Scale
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Every dollar is allocated to maximize impact, reach, and
            sustainability.
          </p>
        </div>

        {/* Utilization Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {utilization.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:border-[#FFD700]/50 transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {item.category}
                  </h3>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="text-4xl font-black"
                      style={{ color: item.color }}
                    >
                      {item.amount}
                    </span>
                    <span className="text-gray-500 text-lg">
                      ({item.percentage})
                    </span>
                  </div>
                </div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${item.color}20`,
                    borderColor: `${item.color}40`,
                    borderWidth: 2,
                  }}
                >
                  <item.icon size={28} style={{ color: item.color }} />
                </div>
              </div>
              <ul className="space-y-3">
                {item.items.map((subItem, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-400 leading-relaxed">
                      {subItem}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ROI Projection */}
        <div className="bg-gradient-to-r from-[#FF6B00]/20 to-[#FFD700]/20 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-10">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Expected Return on Investment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-5xl font-black text-[#FFD700] mb-2">
                25,000+
              </div>
              <p className="text-gray-300">Students Onboarded</p>
              <p className="text-gray-500 text-sm mt-1">Within 12 months</p>
            </div>
            <div>
              <div className="text-5xl font-black text-[#FF6B00] mb-2">
                $2M+
              </div>
              <p className="text-gray-300">Student Income Generated</p>
              <p className="text-gray-500 text-sm mt-1">Cumulative impact</p>
            </div>
            <div>
              <div className="text-5xl font-black text-[#FFD700] mb-2">
                $5M+
              </div>
              <p className="text-gray-300">Transaction Volume</p>
              <p className="text-gray-500 text-sm mt-1">
                Digital payments processed
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-[#FF6B00] mb-2">15</div>
              <p className="text-gray-300">Countries Reached</p>
              <p className="text-gray-500 text-sm mt-1">
                Pan-African expansion
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

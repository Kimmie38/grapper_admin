import React from "react";
import { Calendar, TrendingUp, CheckCircle2 } from "lucide-react";

export default function ExpectedOutcomes() {
  const milestones = [
    {
      timeframe: "Months 1-3",
      title: "Foundation & Integration",
      metrics: [
        "Mobile money integration live (M-Pesa, MTN, Airtel)",
        "5 new university partnerships signed",
        "Campus ambassador program launched (50 universities)",
        "+5,000 new student users",
      ],
      color: "#FF6B00",
    },
    {
      timeframe: "Months 4-6",
      title: "Market Expansion",
      metrics: [
        "Launch in 5 additional African countries",
        "Multi-language support deployed",
        "Financial literacy content released",
        "+10,000 total users (15K cumulative)",
      ],
      color: "#FFD700",
    },
    {
      timeframe: "Months 7-9",
      title: "Scale & Optimization",
      metrics: [
        "$1M+ in student income generated (cumulative)",
        "100K+ transactions processed",
        "4.5+ star rating maintained",
        "+15,000 users (30K cumulative)",
      ],
      color: "#FF6B00",
    },
    {
      timeframe: "Months 10-12",
      title: "Impact & Sustainability",
      metrics: [
        "25,000+ active users across 15 countries",
        "$2M+ student income generated (cumulative)",
        "Partnership with 3 major payment providers",
        "Self-sustaining revenue model achieved",
      ],
      color: "#FFD700",
    },
  ];

  return (
    <section className="px-6 py-24 relative bg-gradient-to-b from-[#0B0B0F] to-[#1A1A2E]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
            <span className="text-green-400 font-bold text-sm tracking-wide">
              12-MONTH ROADMAP
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            What Success
            <span className="block bg-gradient-to-r from-[#FF6B00] to-[#FFD700] bg-clip-text text-transparent">
              Looks Like
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Clear, measurable milestones with accountability at every stage.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-8 mb-16">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:border-[#FFD700]/50 transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                    style={{
                      backgroundColor: `${milestone.color}30`,
                      borderColor: milestone.color,
                      borderWidth: 3,
                    }}
                  >
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div
                    className="inline-block px-4 py-1 rounded-full mb-3 text-xs font-bold"
                    style={{
                      backgroundColor: `${milestone.color}20`,
                      color: milestone.color,
                    }}
                  >
                    {milestone.timeframe}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {milestone.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {milestone.metrics.map((metric, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2
                          className="flex-shrink-0 mt-0.5"
                          size={20}
                          style={{ color: milestone.color }}
                        />
                        <span className="text-gray-400 leading-relaxed">
                          {metric}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Summary */}
        <div className="bg-gradient-to-r from-[#FF6B00]/20 to-[#FFD700]/20 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <TrendingUp className="text-[#FFD700]" size={40} />
            <h3 className="text-3xl font-bold text-white">
              12-Month Impact Summary
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-black text-[#FFD700] mb-3">
                25,000+
              </div>
              <p className="text-gray-300 text-lg mb-2">Students Empowered</p>
              <p className="text-gray-500 text-sm">
                Earning income & building skills
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-[#FF6B00] mb-3">
                $2M+
              </div>
              <p className="text-gray-300 text-lg mb-2">Income Generated</p>
              <p className="text-gray-500 text-sm">
                Directly into student pockets
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-[#FFD700] mb-3">15</div>
              <p className="text-gray-300 text-lg mb-2">Countries Reached</p>
              <p className="text-gray-500 text-sm">Pan-African impact</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

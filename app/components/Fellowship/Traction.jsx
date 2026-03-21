import React from "react";
import { CheckCircle, Award, TrendingUp } from "lucide-react";

export default function Traction() {
  const milestones = [
    {
      date: "Q4 2024",
      achievement: "Platform launch in Nigeria",
      users: "500 students",
    },
    {
      date: "Q1 2025",
      achievement: "Expanded to Ghana & Kenya",
      users: "2,000 students",
    },
    {
      date: "Q2 2025",
      achievement: "Payment integration complete",
      users: "3,500 students",
    },
    {
      date: "Q3 2025",
      achievement: "Hit $100K in transactions",
      users: "5,000+ students",
    },
  ];

  const recognition = [
    "Featured in TechCrunch Africa (Dec 2024)",
    "Winner: Campus Innovation Challenge - University of Lagos",
    "Partnership with MEST Africa incubator",
    "Selected for Google for Startups Accelerator",
  ];

  return (
    <section className="px-6 py-24 relative bg-gradient-to-b from-[#0B0B0F] to-[#1A1A2E]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
            <span className="text-green-400 font-bold text-sm tracking-wide">
              TRACTION & VALIDATION
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            We're Not Just
            <span className="block bg-gradient-to-r from-[#FF6B00] to-[#FFD700] bg-clip-text text-transparent">
              An Idea—We're Proven
            </span>
          </h2>
        </div>

        {/* Growth Timeline */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Our Journey So Far
          </h3>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF6B00] to-[#FFD700] transform -translate-x-1/2"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div
                    className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                  >
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-[#FFD700]/50 transition-all inline-block">
                      <div className="text-[#FFD700] font-bold text-sm mb-2">
                        {milestone.date}
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        {milestone.achievement}
                      </h4>
                      <p className="text-gray-400">{milestone.users}</p>
                    </div>
                  </div>

                  <div className="hidden md:block w-6 h-6 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FFD700] border-4 border-[#0B0B0F] z-10"></div>

                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recognition */}
        <div className="bg-gradient-to-br from-[#FF6B00]/10 to-[#FFD700]/10 border border-[#FFD700]/20 rounded-3xl p-10 mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Award className="text-[#FFD700]" size={36} />
            <h3 className="text-3xl font-bold text-white">
              Recognition & Partnerships
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recognition.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle
                  className="text-[#FFD700] flex-shrink-0 mt-1"
                  size={20}
                />
                <span className="text-gray-300 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <TrendingUp className="text-[#FF6B00]" size={36} />
            <h3 className="text-3xl font-bold text-white">Growth Trajectory</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-black text-[#FFD700] mb-2">
                340%
              </div>
              <p className="text-gray-400">User growth in 6 months</p>
            </div>
            <div>
              <div className="text-5xl font-black text-[#FF6B00] mb-2">
                $420
              </div>
              <p className="text-gray-400">Avg monthly earnings per provider</p>
            </div>
            <div>
              <div className="text-5xl font-black text-[#FFD700] mb-2">
                98.7%
              </div>
              <p className="text-gray-400">Service completion rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  GraduationCap,
  Award,
  Briefcase,
} from "lucide-react";

export default function ImpactMetrics() {
  const metrics = [
    {
      icon: Users,
      value: "5,247",
      label: "Active Student Users",
      growth: "+340% in 6 months",
      color: "#FF6B00",
    },
    {
      icon: DollarSign,
      value: "$284,000",
      label: "Student Income Generated",
      growth: "Avg $420/month per provider",
      color: "#FFD700",
    },
    {
      icon: Briefcase,
      value: "12,400+",
      label: "Services Completed",
      growth: "98.7% completion rate",
      color: "#FF6B00",
    },
    {
      icon: GraduationCap,
      value: "73%",
      label: "Students Stay Enrolled",
      growth: "vs 55% national average",
      color: "#FFD700",
    },
    {
      icon: TrendingUp,
      value: "4.8/5.0",
      label: "Platform Rating",
      growth: "From 2,100+ reviews",
      color: "#FF6B00",
    },
    {
      icon: Award,
      value: "89%",
      label: "First-Time Digital Earners",
      growth: "Financial inclusion success",
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
              PROVEN IMPACT
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Real Numbers,
            <span className="block bg-gradient-to-r from-[#FF6B00] to-[#FFD700] bg-clip-text text-transparent">
              Real Impact
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Our platform has already transformed thousands of student lives.
            Here's the proof.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:border-[#FFD700]/50 transition-all group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{
                  backgroundColor: `${metric.color}20`,
                  borderColor: `${metric.color}40`,
                  borderWidth: 2,
                }}
              >
                <metric.icon size={28} style={{ color: metric.color }} />
              </div>
              <div
                className="text-5xl font-black mb-3"
                style={{ color: metric.color }}
              >
                {metric.value}
              </div>
              <div className="text-xl font-bold text-white mb-2">
                {metric.label}
              </div>
              <div className="text-gray-400 text-sm">{metric.growth}</div>
            </div>
          ))}
        </div>

        {/* Student Testimonials */}
        <div className="bg-gradient-to-br from-[#FF6B00]/10 to-[#FFD700]/10 border border-[#FFD700]/20 rounded-3xl p-10">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Student Voices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <p className="text-gray-300 italic mb-4 leading-relaxed">
                "I was about to drop out because I couldn't afford tuition.
                Through Grapper, I now earn enough tutoring math to pay my fees
                AND support my younger siblings. This platform saved my
                education."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FFD700] flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <div className="text-white font-semibold">Amina K.</div>
                  <div className="text-gray-500 text-sm">
                    University of Lagos, Nigeria
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <p className="text-gray-300 italic mb-4 leading-relaxed">
                "I needed help with my thesis but couldn't afford expensive
                editors. Found a student on Grapper who did amazing work for 1/3
                the price. Now I use it for everything—design, coding help, you
                name it."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B00] flex items-center justify-center text-white font-bold">
                  K
                </div>
                <div>
                  <div className="text-white font-semibold">Kwame O.</div>
                  <div className="text-gray-500 text-sm">
                    University of Ghana, Ghana
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Target, Sparkles, Globe2, Heart } from "lucide-react";

export default function MastercardAlignment() {
  const alignments = [
    {
      icon: Heart,
      title: "Financial Inclusion Mission",
      points: [
        "Onboarding students to digital payments & banking",
        "Building credit histories for unbanked youth",
        "Creating pathways to formal financial systems",
      ],
      color: "#FF6B00",
    },
    {
      icon: Globe2,
      title: "Youth Empowerment Goals",
      points: [
        "Transforming students into income earners",
        "Building entrepreneurial capabilities",
        "Creating sustainable employment pathways",
      ],
      color: "#FFD700",
    },
    {
      icon: Target,
      title: "EdTech Innovation Focus",
      points: [
        "Democratizing access to educational services",
        "Peer-to-peer learning at scale",
        "Skills-based economy for students",
      ],
      color: "#FF6B00",
    },
    {
      icon: Sparkles,
      title: "Digital Economy Growth",
      points: [
        "Scaling cashless transactions in Africa",
        "Building trust in digital platforms",
        "Creating measurable economic impact",
      ],
      color: "#FFD700",
    },
  ];

  return (
    <section className="px-6 py-24 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full mb-6">
            <span className="text-blue-400 font-bold text-sm tracking-wide">
              PERFECT ALIGNMENT
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Why Grapper +
            <span className="block bg-gradient-to-r from-[#FF6B00] to-[#FFD700] bg-clip-text text-transparent">
              Mastercard = Transformative Impact
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Our mission perfectly aligns with Mastercard's commitment to
            financial inclusion, youth empowerment, and digital economy growth
            across Africa.
          </p>
        </div>

        {/* Alignment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {alignments.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:border-[#FFD700]/50 transition-all"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  backgroundColor: `${item.color}20`,
                  borderColor: `${item.color}40`,
                  borderWidth: 2,
                }}
              >
                <item.icon size={32} style={{ color: item.color }} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {item.title}
              </h3>
              <ul className="space-y-3">
                {item.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-400 leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Partnership Vision */}
        <div className="bg-gradient-to-r from-[#FF6B00]/20 to-[#FFD700]/20 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-10">
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            Together, We Can...
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="text-4xl font-black text-[#FFD700] mb-3">
                Scale Impact
              </div>
              <p className="text-gray-300 leading-relaxed">
                Mastercard's expertise + Grapper's platform = 1M+ students
                empowered by 2027
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="text-4xl font-black text-[#FF6B00] mb-3">
                Accelerate Growth
              </div>
              <p className="text-gray-300 leading-relaxed">
                Grant funding enables expansion to 15+ African countries within
                24 months
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="text-4xl font-black text-[#FFD700] mb-3">
                Validate Model
              </div>
              <p className="text-gray-300 leading-relaxed">
                Partnership credibility accelerates university partnerships &
                user adoption
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="text-4xl font-black text-[#FF6B00] mb-3">
                Measure Success
              </div>
              <p className="text-gray-300 leading-relaxed">
                Track financial inclusion metrics, youth employment, educational
                outcomes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Zap, Users, Wallet, GraduationCap } from "lucide-react";

export default function OurSolution() {
  const features = [
    {
      icon: Users,
      title: "Peer-to-Peer Skills Economy",
      description:
        "Students offer tutoring, design, tech, writing—earning income while building portfolios",
      benefit: "Transform skills into immediate income",
    },
    {
      icon: Wallet,
      title: "Financial Inclusion Built-In",
      description:
        "Digital payments, transparent earnings, financial literacy through platform usage",
      benefit: "Build credit history & financial capability",
    },
    {
      icon: GraduationCap,
      title: "Affordable Learning Access",
      description:
        "Students access peer services at 70% less cost than traditional providers",
      benefit: "Democratize educational support",
    },
    {
      icon: Zap,
      title: "Real-World Experience",
      description:
        "Build client relationships, manage projects, develop entrepreneurial mindset",
      benefit: "Graduate with proven work experience",
    },
  ];

  return (
    <section className="px-6 py-24 relative bg-gradient-to-b from-transparent to-[#0B0B0F]/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-[#FFD700]/20 border border-[#FFD700]/30 rounded-full mb-6">
            <span className="text-[#FFD700] font-bold text-sm tracking-wide">
              OUR SOLUTION
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            A Platform Where
            <span className="block bg-gradient-to-r from-[#FF6B00] to-[#FFD700] bg-clip-text text-transparent">
              Students Become Earners
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Grapper is the{" "}
            <span className="text-white font-semibold">
              first peer-to-peer marketplace
            </span>{" "}
            designed specifically for African students to monetize their skills,
            access affordable services, and build financial independence.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            How Grapper Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF6B00]/50 flex items-center justify-center mx-auto mb-6 text-3xl font-black text-white shadow-2xl">
                1
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">
                Student Providers
              </h4>
              <p className="text-gray-400 text-lg leading-relaxed">
                List services (tutoring, design, coding, writing) with pricing,
                portfolio, and availability
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFD700]/50 flex items-center justify-center mx-auto mb-6 text-3xl font-black text-white shadow-2xl">
                2
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">
                Student Buyers
              </h4>
              <p className="text-gray-400 text-lg leading-relaxed">
                Browse, book, and pay for affordable peer services through
                secure digital payments
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FFD700] flex items-center justify-center mx-auto mb-6 text-3xl font-black text-white shadow-2xl">
                3
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">
                Everyone Wins
              </h4>
              <p className="text-gray-400 text-lg leading-relaxed">
                Providers earn, buyers save, platform enables financial
                inclusion & skill development
              </p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:border-[#FFD700]/50 transition-all group"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#FFD700] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon size={32} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-lg mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
                    <span className="text-[#FFD700] font-semibold text-sm">
                      {feature.benefit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Impact Statement */}
        <div className="mt-16 bg-gradient-to-r from-[#FF6B00]/20 to-[#FFD700]/20 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-10 text-center">
          <p className="text-2xl text-white leading-relaxed">
            <span className="font-bold text-[#FFD700]">Bottom Line:</span> We're
            turning Africa's largest liability (unemployed youth) into its
            greatest asset
            <span className="font-bold text-[#FF6B00]">
              {" "}
              (skilled entrepreneurs)
            </span>
            —one student at a time.
          </p>
        </div>
      </div>
    </section>
  );
}

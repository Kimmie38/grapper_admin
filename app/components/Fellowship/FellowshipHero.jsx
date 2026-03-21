import React from "react";
import { GraduationCap, TrendingUp, Users, Sparkles } from "lucide-react";

export default function FellowshipHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF6B00] rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFD700] rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Fellowship Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FFD700] rounded-full mb-8 shadow-2xl">
          <Sparkles className="text-white" size={20} />
          <span className="text-white font-bold text-sm tracking-wide">
            MASTERCARD CC-HUB EDTECH FELLOWSHIP 2026
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
          Empowering
          <br />
          <span className="bg-gradient-to-r from-[#FF6B00] via-[#FFD700] to-[#FF6B00] bg-clip-text text-transparent">
            Africa's Youth
          </span>
          <br />
          Through Learning
        </h1>

        {/* Subheadline */}
        <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
          A peer-to-peer skills marketplace transforming students into earners,
          bridging the digital divide, and democratizing educational opportunity
          across Africa
        </p>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:scale-105 transition-transform">
            <GraduationCap className="text-[#FFD700] mb-4 mx-auto" size={48} />
            <div className="text-5xl font-black text-white mb-2">5,000+</div>
            <div className="text-gray-400 text-lg">Students Empowered</div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:scale-105 transition-transform">
            <TrendingUp className="text-[#FF6B00] mb-4 mx-auto" size={48} />
            <div className="text-5xl font-black text-white mb-2">$250K+</div>
            <div className="text-gray-400 text-lg">
              Student Income Generated
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:scale-105 transition-transform">
            <Users className="text-[#FFD700] mb-4 mx-auto" size={48} />
            <div className="text-5xl font-black text-white mb-2">1M+</div>
            <div className="text-gray-400 text-lg">African Youth Potential</div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-[#FF6B00]/20 to-[#FFD700]/20 backdrop-blur-xl border border-[#FF6B00]/30 rounded-3xl p-10 max-w-4xl mx-auto">
          <p className="text-2xl text-white font-light leading-relaxed">
            "We're not just building a platform—we're creating a movement where
            <span className="font-bold text-[#FFD700]">
              {" "}
              every student becomes an entrepreneur
            </span>
            , every skill becomes income, and
            <span className="font-bold text-[#FF6B00]">
              {" "}
              education becomes accessible to all
            </span>
            ."
          </p>
        </div>
      </div>
    </section>
  );
}

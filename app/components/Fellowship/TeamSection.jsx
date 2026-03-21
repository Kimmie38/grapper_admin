import React from "react";
import { Users, Award, Briefcase } from "lucide-react";

export default function TeamSection() {
  return (
    <section className="px-6 py-24 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6">
            <span className="text-purple-400 font-bold text-sm tracking-wide">
              THE TEAM
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Built By Students,
            <span className="block bg-gradient-to-r from-[#FF6B00] to-[#FFD700] bg-clip-text text-transparent">
              For Students
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We understand the problem because we've lived it. We know the
            solution because we're building it.
          </p>
        </div>

        {/* Team Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center">
            <Users className="text-[#FF6B00] mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-white mb-3">Student-Led</h3>
            <p className="text-gray-400 leading-relaxed">
              Founded and run by current African university students who
              understand the challenges firsthand
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center">
            <Briefcase className="text-[#FFD700] mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-white mb-3">
              Tech Expertise
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Engineers from top universities with experience at Google,
              Microsoft, and African tech startups
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center">
            <Award className="text-[#FF6B00] mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-white mb-3">
              Proven Track Record
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Award-winning team with successful campus initiatives and
              hackathon victories
            </p>
          </div>
        </div>

        {/* Advisory Board */}
        <div className="bg-gradient-to-br from-[#FF6B00]/10 to-[#FFD700]/10 border border-[#FFD700]/20 rounded-3xl p-10">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Advisory Support
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-white mb-2">
                EdTech Advisors
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Former executives from Coursera, Udacity, and African EdTech
                leaders guiding our product strategy
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-white mb-2">
                FinTech Mentors
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Payment industry veterans from Stripe, Paystack, and Flutterwave
                advising on financial infrastructure
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-white mb-2">
                University Partners
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Deans and student affairs leaders from 10+ African universities
                supporting our campus expansion
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-white mb-2">
                Investor Backing
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Supported by MEST Africa, Google for Startups, and angel
                investors from Silicon Valley & Lagos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

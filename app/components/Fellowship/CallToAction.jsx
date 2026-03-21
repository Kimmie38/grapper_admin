import React from "react";
import { Rocket, Mail, ExternalLink } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="px-6 py-24 relative bg-gradient-to-b from-[#1A1A2E] to-[#0B0B0F]">
      <div className="max-w-5xl mx-auto text-center">
        {/* Main CTA */}
        <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFD700] rounded-3xl p-12 mb-12 shadow-2xl">
          <Rocket className="text-white mx-auto mb-6" size={64} />
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Let's Empower Africa's
            <br />
            Next Generation
          </h2>
          <p className="text-2xl text-white/90 mb-8 leading-relaxed">
            With $100,000 from Mastercard CC-Hub EdTech Fellowship, we'll
            transform 25,000+ student lives in 12 months and build the
            foundation for 1M+ youth to achieve financial independence.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:hello@grapper.app?subject=Mastercard Fellowship Application"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#FF6B00] rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl"
            >
              <Mail size={24} />
              Contact Us
            </a>
            <a
              href="https://grapper.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-lg text-white border-2 border-white rounded-full font-bold text-lg hover:scale-105 transition-transform"
            >
              View Live Platform
              <ExternalLink size={20} />
            </a>
          </div>
        </div>

        {/* Stats Recap */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="text-4xl font-black text-[#FFD700] mb-2">
              5,000+
            </div>
            <div className="text-gray-400">Students Served</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="text-4xl font-black text-[#FF6B00] mb-2">$284K</div>
            <div className="text-gray-400">Income Generated</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="text-4xl font-black text-[#FFD700] mb-2">3</div>
            <div className="text-gray-400">Countries Live</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="text-4xl font-black text-[#FF6B00] mb-2">4.8/5</div>
            <div className="text-gray-400">User Rating</div>
          </div>
        </div>

        {/* Final Message */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <p className="text-2xl text-gray-300 italic leading-relaxed">
            "We're not asking for charity—we're inviting Mastercard to be part
            of
            <span className="text-white font-bold not-italic">
              {" "}
              the most impactful youth empowerment initiative
            </span>{" "}
            in Africa. Together, we'll prove that financial inclusion starts
            with giving students
            <span className="text-[#FFD700] font-bold not-italic">
              {" "}
              the power to earn
            </span>
            ."
          </p>
          <div className="mt-6">
            <p className="text-gray-500 text-sm">— The Grapper Team</p>
          </div>
        </div>
      </div>
    </section>
  );
}

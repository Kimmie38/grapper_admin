import { Globe, Rocket, Award } from "lucide-react";
import { VisionCard } from "./VisionCard";

export function VisionSection() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <p className="text-2xl text-gray-300 leading-relaxed mb-12">
        Grapper will become the{" "}
        <span className="text-emerald-400 font-bold">default platform</span> for
        every university student globally to discover, hire, and get hired for
        services—creating a
        <span className="text-purple-400 font-bold">
          {" "}
          self-sustaining campus economy
        </span>{" "}
        worth billions.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <VisionCard
          icon={<Globe className="w-12 h-12" />}
          title="2027: Global Platform"
          description="25M users across 1,000+ universities in 50+ countries"
        />
        <VisionCard
          icon={<Rocket className="w-12 h-12" />}
          title="2028: Super App"
          description="Expand to student housing, events, study groups, and career services"
        />
        <VisionCard
          icon={<Award className="w-12 h-12" />}
          title="2030: Exit Potential"
          description="Strategic acquisition target for LinkedIn, Meta, or Airbnb ($500M-$1B)"
        />
      </div>

      <div className="bg-gradient-to-r from-emerald-500/20 to-purple-500/20 border-2 border-emerald-500/50 rounded-3xl p-12">
        <h3 className="text-4xl font-bold mb-6">
          Let's Build the Future Together
        </h3>
        <p className="text-xl text-gray-300 mb-8">
          Join us in empowering the next generation of entrepreneurs
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-12 py-4 rounded-xl text-lg font-bold hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105">
            Schedule a Meeting
          </button>
          <button className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-12 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition-all">
            Download Pitch Deck
          </button>
        </div>
      </div>
    </div>
  );
}

import { FundAllocation } from "./FundAllocation";
import { Milestone } from "./Milestone";

export function TheAskSection() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-500/20 via-purple-500/20 to-pink-500/20 border-2 border-emerald-500/50 rounded-3xl p-12 text-center mb-12">
        <h3 className="text-5xl font-black mb-4 bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
          Raising $2M Seed Round
        </h3>
        <p className="text-xl text-gray-300 mb-8">
          Pre-money valuation: $8M • Equity offered: 20%
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <h4 className="text-2xl font-bold mb-6 text-emerald-400">
            Use of Funds
          </h4>
          <div className="space-y-4">
            <FundAllocation
              percentage="40%"
              label="Engineering & Product"
              amount="$800K"
            />
            <FundAllocation
              percentage="30%"
              label="Marketing & Growth"
              amount="$600K"
            />
            <FundAllocation
              percentage="20%"
              label="Operations & Support"
              amount="$400K"
            />
            <FundAllocation
              percentage="10%"
              label="Legal & Compliance"
              amount="$200K"
            />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <h4 className="text-2xl font-bold mb-6 text-purple-400">
            12-Month Milestones
          </h4>
          <ul className="space-y-4">
            <Milestone text="Launch in 50 universities across Nigeria & Ghana" />
            <Milestone text="Reach 500K registered users" />
            <Milestone text="Process $10M in transactions" />
            <Milestone text="Achieve $1.5M ARR" />
            <Milestone text="Expand to Kenya, South Africa, UK" />
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-8">
        <h4 className="text-xl font-bold mb-4 text-center">
          Investment Highlights
        </h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              42.5x
            </div>
            <div className="text-sm text-gray-400">LTV:CAC Ratio</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">150M+</div>
            <div className="text-sm text-gray-400">Target Market Size</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-400 mb-2">$100M</div>
            <div className="text-sm text-gray-400">ARR by Year 5</div>
          </div>
        </div>
      </div>
    </div>
  );
}

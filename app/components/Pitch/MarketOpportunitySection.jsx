import { MarketMetric } from "./MarketMetric";

export function MarketOpportunitySection() {
  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h3 className="text-3xl font-bold mb-6 text-emerald-400">
          Total Addressable Market
        </h3>
        <div className="space-y-6">
          <MarketMetric
            label="Global University Students"
            value="150M+"
            subtext="Growing 3.5% annually"
          />
          <MarketMetric
            label="Gig Economy Market Size"
            value="$455B"
            subtext="Expected to reach $1.5T by 2030"
          />
          <MarketMetric
            label="Campus Services Market"
            value="$50B+"
            subtext="Currently fragmented & offline"
          />
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
        <h4 className="text-xl font-bold mb-6">Market Penetration Strategy</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Year 1: Nigeria & Ghana</span>
              <span className="text-emerald-400 font-bold">500K users</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-400 h-3 rounded-full"
                style={{ width: "20%" }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">
                Year 2: West Africa Expansion
              </span>
              <span className="text-purple-400 font-bold">2M users</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full"
                style={{ width: "40%" }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Year 3: Africa + UK/US</span>
              <span className="text-teal-400 font-bold">8M users</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-teal-400 to-cyan-400 h-3 rounded-full"
                style={{ width: "60%" }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Year 5: Global Dominance</span>
              <span className="text-yellow-400 font-bold">25M+ users</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

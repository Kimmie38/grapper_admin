import { RevenueStream } from "./RevenueStream";
import { UnitMetric } from "./UnitMetric";

export function BusinessModelSection() {
  return (
    <div className="grid md:grid-cols-2 gap-12 mb-12">
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-8">
        <h3 className="text-2xl font-bold mb-6">Revenue Streams</h3>
        <div className="space-y-4">
          <RevenueStream
            percentage="70%"
            title="Transaction Fees"
            description="15% commission on all bookings"
            color="emerald"
          />
          <RevenueStream
            percentage="20%"
            title="Premium Features"
            description="Featured listings, analytics, bulk services"
            color="purple"
          />
          <RevenueStream
            percentage="10%"
            title="Advertising"
            description="Sponsored posts, brand partnerships"
            color="teal"
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8">
        <h3 className="text-2xl font-bold mb-6">Unit Economics</h3>
        <div className="space-y-6">
          <UnitMetric
            label="Average Transaction Value"
            value="$85"
            trend="+12%"
          />
          <UnitMetric
            label="Platform Take Rate"
            value="15%"
            trend="industry standard"
          />
          <UnitMetric
            label="Customer Acquisition Cost"
            value="$8"
            trend="-23%"
          />
          <UnitMetric label="Lifetime Value" value="$340" trend="+34%" />
          <div className="pt-4 border-t border-white/10">
            <div className="text-sm text-gray-400 mb-2">LTV:CAC Ratio</div>
            <div className="text-4xl font-bold text-emerald-400">42.5x</div>
            <div className="text-xs text-gray-500">
              Exceptional growth efficiency
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

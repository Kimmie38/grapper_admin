import { GTMCard } from "./GTMCard";
import { ChannelMetric } from "./ChannelMetric";

export function GoToMarketSection() {
  return (
    <>
      <div className="grid md:grid-cols-3 gap-8">
        <GTMCard
          phase="Phase 1"
          title="Campus Ambassadors"
          description="Recruit 5-10 influential students per university. Offer commission on referrals + premium features."
        />
        <GTMCard
          phase="Phase 2"
          title="University Partnerships"
          description="Partner with student unions, clubs, and career centers for official endorsement and promotion."
        />
        <GTMCard
          phase="Phase 3"
          title="Viral Mechanics"
          description="Referral rewards, social sharing, and gamification drive organic growth at near-zero CAC."
        />
      </div>

      <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8">
        <h4 className="text-2xl font-bold mb-6 text-center">
          Customer Acquisition Channels
        </h4>
        <div className="grid md:grid-cols-4 gap-6">
          <ChannelMetric channel="Organic/Viral" percentage="45%" />
          <ChannelMetric channel="Campus Ambassadors" percentage="30%" />
          <ChannelMetric channel="Social Media Ads" percentage="15%" />
          <ChannelMetric channel="Partnerships" percentage="10%" />
        </div>
      </div>
    </>
  );
}

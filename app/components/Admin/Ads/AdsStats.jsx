import { StatCard } from "../StatCard";

export function AdsStats({ counts }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="Total Impressions"
        value={counts.total_impressions.toLocaleString()}
      />
      <StatCard
        label="Total Clicks"
        value={counts.total_clicks.toLocaleString()}
      />
      <StatCard
        label="Total Spend"
        value={`$${Number(counts.total_spend).toFixed(2)}`}
      />
      <StatCard label="Active Campaigns" value={counts.campaigns_count} />
      <StatCard label="Active Ads" value={counts.ads_count} />
    </div>
  );
}

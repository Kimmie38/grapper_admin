import { StatCard } from "../StatCard";

export default function EngagementStats({ engagement }) {
  const dauMauRatio =
    engagement.mau > 0
      ? ((engagement.dau / engagement.mau) * 100).toFixed(1)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard
        label="Daily Active Users"
        value={engagement.dau.toLocaleString()}
        sub={`${dauMauRatio}% of MAU`}
      />
      <StatCard
        label="Monthly Active Users"
        value={engagement.mau.toLocaleString()}
        sub="Last 30 days"
      />
      <StatCard
        label="Total Users"
        value={engagement.totalUsers.toLocaleString()}
        sub="All time"
      />
      <StatCard
        label="User Growth Rate"
        value={`${engagement.userGrowthRate}%`}
        sub="Last 30 days"
      />
      <StatCard
        label="Repeat Booking Rate"
        value={`${engagement.repeatBookingRate}%`}
        sub="Customer retention"
      />
    </div>
  );
}

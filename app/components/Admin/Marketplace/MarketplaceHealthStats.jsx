import { StatCard } from "../StatCard";

export default function MarketplaceHealthStats({ marketplace }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard
        label="Average Service Rating"
        value={marketplace.avgRating.toFixed(1)}
        sub={`★ Based on ${marketplace.totalReviews} reviews`}
      />
      <StatCard
        label="Total Reviews"
        value={marketplace.totalReviews.toLocaleString()}
        sub="All time"
      />
      <StatCard
        label="Customer Satisfaction"
        value={`${marketplace.customerSatisfaction}%`}
        sub="4+ star reviews"
      />
    </div>
  );
}

import { StatCard } from "../StatCard";

export default function RevenueStats({ revenue }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Gross Merchandise Value"
        value={formatCurrency(revenue.gmv)}
        sub="Total transaction volume"
      />
      <StatCard
        label="Total Commissions"
        value={formatCurrency(revenue.totalCommissions)}
        sub={`${formatCurrency(revenue.paidCommissions)} paid`}
      />
      <StatCard
        label="Pending Commissions"
        value={formatCurrency(revenue.pendingCommissions)}
        sub="Awaiting payment"
      />
      <StatCard
        label="Avg Transaction Value"
        value={formatCurrency(revenue.avgTransactionValue)}
        sub="Per booking"
      />
    </div>
  );
}

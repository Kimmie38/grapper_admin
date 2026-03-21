import { StatCard } from "../StatCard";

export default function ProviderStats({ providers }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Total Providers"
        value={providers.total.toLocaleString()}
        sub={`${providers.active} active`}
      />
      <StatCard
        label="Verified Providers"
        value={providers.verified.toLocaleString()}
        sub={`${((providers.verified / providers.total) * 100).toFixed(1)}% of total`}
      />
      <StatCard
        label="Total Services"
        value={providers.services.total.toLocaleString()}
        sub={`${providers.services.featured} featured`}
      />
      <StatCard
        label="Avg Service Price"
        value={formatCurrency(providers.services.avgPrice)}
        sub="Across all services"
      />
    </div>
  );
}

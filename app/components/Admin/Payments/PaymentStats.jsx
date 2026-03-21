import { StatCard } from "../StatCard";

export default function PaymentStats({ payments }) {
  const failureRate =
    payments.total > 0
      ? ((payments.failed / payments.total) * 100).toFixed(1)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Total Payments"
        value={payments.total.toLocaleString()}
        sub="All payment attempts"
      />
      <StatCard
        label="Success Rate"
        value={`${payments.successRate}%`}
        sub={`${payments.successful} successful`}
      />
      <StatCard
        label="Failed Payments"
        value={payments.failed.toLocaleString()}
        sub={`${failureRate}% failure rate`}
      />
      <StatCard
        label="Payment Methods"
        value={payments.byMethod.length.toLocaleString()}
        sub="Active methods"
      />
    </div>
  );
}

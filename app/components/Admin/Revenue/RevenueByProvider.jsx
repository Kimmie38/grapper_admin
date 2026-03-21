export default function RevenueByProvider({ byProvider }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const totalRevenue = byProvider.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Revenue by Payment Provider
      </h3>
      <div className="space-y-4">
        {byProvider.map((provider) => {
          const percentage =
            totalRevenue > 0
              ? ((provider.revenue / totalRevenue) * 100).toFixed(1)
              : 0;

          return (
            <div
              key={provider.provider}
              className="border-b pb-4 last:border-b-0"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold text-gray-900 capitalize">
                    {provider.provider}
                  </p>
                  <p className="text-sm text-gray-500">
                    {provider.bookings} bookings
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {formatCurrency(provider.revenue)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(provider.commission)} commission
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {percentage}% of total revenue
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

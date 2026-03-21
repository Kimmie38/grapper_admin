"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function RevenueTrendsChart({ trends }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const chartData = trends.map((t) => ({
    date: formatDate(t.date),
    GMV: t.gmv,
    Commission: t.commission,
    Bookings: t.bookings,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Revenue Trends (Last 30 Days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis yAxisId="left" fontSize={12} tickFormatter={formatCurrency} />
          <YAxis yAxisId="right" orientation="right" fontSize={12} />
          <Tooltip
            formatter={(value, name) =>
              name === "Bookings" ? value : formatCurrency(value)
            }
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="GMV"
            stroke="#10B981"
            strokeWidth={2}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Commission"
            stroke="#3B82F6"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Bookings"
            stroke="#8B5CF6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

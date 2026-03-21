"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export default function PaymentMethodsChart({ byMethod }) {
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Payment Method Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={byMethod}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ method, percent }) =>
              `${method}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {byMethod.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [value, props.payload.method]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {byMethod.map((method, index) => (
          <div
            key={method.method}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-600">{method.method}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{method.count} transactions</div>
              <div className="text-gray-500 text-xs">
                {formatCurrency(method.amount)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

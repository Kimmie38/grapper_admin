"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export default function BookingStatusBreakdown({ byStatus }) {
  const data = [
    { name: "Pending", value: byStatus.pending, color: "#F59E0B" },
    { name: "Confirmed", value: byStatus.confirmed, color: "#3B82F6" },
    { name: "In Progress", value: byStatus.inProgress, color: "#8B5CF6" },
    { name: "Completed", value: byStatus.completed, color: "#10B981" },
    { name: "Cancelled", value: byStatus.cancelled, color: "#EF4444" },
    { name: "Rejected", value: byStatus.rejected, color: "#6B7280" },
  ].filter((item) => item.value > 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Booking Status Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <span className="text-gray-600">{item.name}:</span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

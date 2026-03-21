import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function AdsPerformanceChart({ data }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="font-semibold text-gray-900 mb-4">
        Ad Performance (30 Days)
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(val) =>
                new Date(val).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis yAxisId="left" orientation="left" stroke="#2563EB" />
            <YAxis yAxisId="right" orientation="right" stroke="#16A34A" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="impressions"
              fill="#2563EB"
              name="Impressions"
            />
            <Bar
              yAxisId="right"
              dataKey="spend"
              fill="#16A34A"
              name="Spend ($)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

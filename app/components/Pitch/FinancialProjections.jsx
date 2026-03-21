import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function FinancialProjections() {
  const projectionData = [
    { year: "Year 1", users: 500, revenue: 1.5, transactions: 10 },
    { year: "Year 2", users: 2000, revenue: 8, transactions: 55 },
    { year: "Year 3", users: 8000, revenue: 32, transactions: 220 },
    { year: "Year 4", users: 18000, revenue: 68, transactions: 480 },
    { year: "Year 5", users: 25000, revenue: 110, transactions: 750 },
  ];

  return (
    <div className="space-y-12">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
        <h4 className="text-2xl font-bold mb-8 text-center">
          5-Year Revenue Projection
        </h4>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={projectionData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="year" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
              formatter={(value) => `$${value}M`}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
          <div className="text-sm text-gray-400 mb-2">Year 5 ARR</div>
          <div className="text-5xl font-bold text-emerald-400 mb-2">$110M</div>
          <div className="text-xs text-gray-500">73x growth from Year 1</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 text-center">
          <div className="text-sm text-gray-400 mb-2">Year 5 Users</div>
          <div className="text-5xl font-bold text-purple-400 mb-2">25M</div>
          <div className="text-xs text-gray-500">50x growth from Year 1</div>
        </div>

        <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-2xl p-6 text-center">
          <div className="text-sm text-gray-400 mb-2">Year 5 GMV</div>
          <div className="text-5xl font-bold text-teal-400 mb-2">$750M</div>
          <div className="text-xs text-gray-500">75x growth from Year 1</div>
        </div>
      </div>
    </div>
  );
}

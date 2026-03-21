export function MarketMetric({ label, value, subtext }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="text-4xl font-bold text-emerald-400 mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtext}</div>
    </div>
  );
}

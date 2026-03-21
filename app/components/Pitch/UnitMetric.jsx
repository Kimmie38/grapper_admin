export function UnitMetric({ label, value, trend }) {
  return (
    <div>
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="text-sm text-emerald-400">{trend}</div>
      </div>
    </div>
  );
}

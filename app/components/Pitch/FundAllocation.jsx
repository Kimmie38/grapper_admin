export function FundAllocation({ percentage, label, amount }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-gray-300">{label}</span>
        <span className="text-emerald-400 font-bold">{amount}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full"
          style={{ width: percentage }}
        />
      </div>
    </div>
  );
}

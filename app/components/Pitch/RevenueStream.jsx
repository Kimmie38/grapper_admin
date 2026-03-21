export function RevenueStream({ percentage, title, description, color }) {
  const colors = {
    emerald: "from-emerald-400 to-teal-400",
    purple: "from-purple-400 to-pink-400",
    teal: "from-teal-400 to-cyan-400",
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-bold">{title}</span>
        <span className="text-emerald-400 font-bold">{percentage}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
        <div
          className={`bg-gradient-to-r ${colors[color]} h-3 rounded-full`}
          style={{ width: percentage }}
        />
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

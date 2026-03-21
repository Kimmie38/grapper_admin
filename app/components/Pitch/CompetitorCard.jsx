export function CompetitorCard({ name, weakness }) {
  return (
    <div className="border-l-4 border-red-500/50 pl-4">
      <div className="font-bold text-gray-300 mb-1">{name}</div>
      <p className="text-sm text-gray-500">{weakness}</p>
    </div>
  );
}

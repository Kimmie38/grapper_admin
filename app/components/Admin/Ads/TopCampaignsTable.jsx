export function TopCampaignsTable({ campaigns }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="font-semibold text-gray-900 mb-4">Top Campaigns</div>
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2">Campaign</th>
            <th className="py-2">Status</th>
            <th className="py-2 text-right">Impressions</th>
            <th className="py-2 text-right">Spend</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} className="border-b border-gray-100 last:border-0">
              <td className="py-2 font-medium">{c.name}</td>
              <td className="py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${c.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {c.status}
                </span>
              </td>
              <td className="py-2 text-right">
                {Number(c.impressions).toLocaleString()}
              </td>
              <td className="py-2 text-right">${Number(c.spend).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

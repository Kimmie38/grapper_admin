export function LogsTable({ data, isLoading }) {
  if (isLoading) {
    return <div>Loading logs...</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Admin</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Target</th>
            <th className="px-4 py-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((log) => (
            <tr key={log.id} className="border-t border-gray-100">
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {new Date(log.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-3 font-medium">
                <div className="flex items-center gap-2">
                  {log.admin_avatar && (
                    <img
                      src={log.admin_avatar}
                      className="w-5 h-5 rounded-full"
                      alt=""
                    />
                  )}
                  <span>{log.admin_name || "System"}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-mono">
                  {log.action}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {log.target_type} #{log.target_id}
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                {JSON.stringify(log.details)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

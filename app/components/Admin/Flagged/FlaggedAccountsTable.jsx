import { ShieldAlert, UserCheck, AlertTriangle } from "lucide-react";
import { ErrorPanel } from "../ErrorPanel";

export function FlaggedAccountsTable({
  data,
  isLoading,
  isError,
  error,
  onUnflag,
  isUnflagging,
}) {
  if (isLoading) {
    return <div className="mt-4 text-gray-700">Loading flagged accounts…</div>;
  }

  if (isError) {
    return (
      <div className="mt-4">
        <ErrorPanel
          title="Could not load flagged accounts"
          message={error?.message || "Please try again."}
        />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">University</th>
              <th className="px-4 py-3">Reports</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  No flagged accounts found.
                </td>
              </tr>
            ) : (
              data.map((r) => {
                const key = `f-${r.profile_id}`;
                const name = r.full_name || r.name || "(no name)";
                const isShadowBanned = r.status === "shadow_ban";

                return (
                  <tr
                    key={key}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.avatar_url || "https://github.com/shadcn.png"}
                          className="w-8 h-8 rounded-full bg-gray-100"
                          alt=""
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {name}
                          </div>
                          <div className="text-xs text-gray-500">{r.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {r.university || "(not set)"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold border ${
                          isShadowBanned
                            ? "bg-orange-50 text-orange-700 border-orange-100"
                            : "bg-red-50 text-red-700 border-red-100"
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {r.report_count} reports
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          isShadowBanned
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isShadowBanned ? "SHADOW BANNED" : "FLAGGED"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          const reason = prompt(
                            `Why are you clearing the flag for ${name}?`,
                          );
                          if (reason !== null) {
                            onUnflag({ profileId: r.profile_id, reason });
                          }
                        }}
                        disabled={isUnflagging}
                        className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <UserCheck className="w-3 h-3" />
                        Clear Flag
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

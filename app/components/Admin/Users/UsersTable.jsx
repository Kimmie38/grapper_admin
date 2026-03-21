import { ErrorPanel } from "../ErrorPanel";

export function UsersTable({ data, isLoading, isError, error }) {
  if (isLoading) {
    return <div className="mt-4 text-gray-700">Loading users…</div>;
  }

  if (isError) {
    return (
      <div className="mt-4">
        <ErrorPanel
          title="Could not load users"
          message={error?.message || "Please try again."}
        />
      </div>
    );
  }

  if (!data?.rows) {
    return null;
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">University</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => {
              const key = `u-${r.user_id}`;
              const role = r.account_type || "user";
              const name = r.full_name || r.name || "(no name)";
              const university = r.university || "(not set)";
              const phone = r.phone_number || "(not set)";
              return (
                <tr
                  key={key}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <a
                      href={`/admin/users/${r.id}`}
                      className="text-[#0F4241] hover:underline"
                    >
                      {name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{r.email || ""}</td>
                  <td className="px-4 py-3 text-gray-700">{phone}</td>
                  <td className="px-4 py-3 text-gray-700">{university}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                      {role}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

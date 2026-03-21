export function AdminHeader({ generatedAt }) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <div className="text-lg font-semibold text-gray-900">
            Grapper Admin
          </div>
          <div className="text-xs text-gray-500">
            Live view (auto refresh). Generated: {generatedAt}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/account/logout"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
}

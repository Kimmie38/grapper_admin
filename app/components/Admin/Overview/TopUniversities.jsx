export function TopUniversities({ universities }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="font-semibold text-gray-900">Top universities</div>
      <div className="mt-3 space-y-2">
        {universities.map((u) => {
          const key = `${u.university}-${u.count}`;
          return (
            <div
              key={key}
              className="flex items-center justify-between text-sm"
            >
              <div className="text-gray-700">{u.university}</div>
              <div className="font-semibold text-gray-900">{u.count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { StatCard } from "../StatCard";

export function OverviewStats({ totals, onRecount, isRecounting }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Users" value={totals?.users ?? 0} />
      <StatCard label="Profiles" value={totals?.profiles ?? 0} />
      <StatCard label="Posts" value={totals?.posts ?? 0} />
      <StatCard label="Comments" value={totals?.comments ?? 0} />
      <StatCard label="Services" value={totals?.services ?? 0} />
      <StatCard label="Ads" value={totals?.ads ?? 0} />
      <StatCard label="Bookings" value={totals?.bookings ?? 0} />
      <StatCard
        label="Active sessions"
        value={totals?.activeSessions ?? 0}
        sub="Users currently signed in (approx)"
      />
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="text-sm text-gray-500">Maintenance</div>
        <div className="mt-2 text-sm text-gray-700">
          If counts ever look wrong, run a quick recount.
        </div>
        <button
          className="mt-3 rounded-lg bg-[#0F4241] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0c3534] disabled:opacity-60"
          onClick={onRecount}
          disabled={isRecounting}
        >
          {isRecounting ? "Running…" : "Recount comments"}
        </button>
      </div>
    </div>
  );
}

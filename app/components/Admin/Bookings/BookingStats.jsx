import { StatCard } from "../StatCard";

export default function BookingStats({ bookings }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Total Bookings"
        value={bookings.total.toLocaleString()}
        sub={`${bookings.completionRate}% completion rate`}
      />
      <StatCard
        label="Completed"
        value={bookings.byStatus.completed.toLocaleString()}
        sub="Successfully finished"
      />
      <StatCard
        label="In Progress"
        value={(
          bookings.byStatus.confirmed + bookings.byStatus.inProgress
        ).toLocaleString()}
        sub="Active bookings"
      />
      <StatCard
        label="Cancellation Rate"
        value={`${bookings.cancellationRate}%`}
        sub={`${bookings.byStatus.cancelled} cancelled`}
      />
    </div>
  );
}

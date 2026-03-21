import React from "react";
import { format } from "date-fns";
import { Calendar, User, ShoppingBag, CreditCard, Hash } from "lucide-react";
import { useUpdateBookingStatusMutation } from "@/hooks/useAdminMutations";

export function BookingsTable({ data, isLoading, isError, error }) {
  const updateStatusMutation = useUpdateBookingStatusMutation();

  if (isLoading) {
    return (
      <div className="py-10 text-center text-gray-500">Loading bookings...</div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-red-500">
        Error loading bookings: {error?.message}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">No bookings found.</div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">Reference ID</th>
              <th className="px-6 py-3">Service</th>
              <th className="px-6 py-3">Buyer</th>
              <th className="px-6 py-3">Provider</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-blue-600">
                        {booking.reference_code || `BKG-${booking.id}`}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        #{booking.id}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-gray-400" />
                    <span
                      className="truncate max-w-[200px]"
                      title={booking.service_title}
                    >
                      {booking.service_title || "Unknown Service"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-col">
                      <span className="text-gray-900">
                        {booking.buyer_name || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {booking.buyer_email}
                      </span>
                      {booking.buyer_phone && (
                        <span className="text-xs text-gray-400">
                          {booking.buyer_phone}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-col">
                      <span className="text-gray-900">
                        {booking.provider_name || "Unknown"}
                      </span>
                      {booking.provider_phone && (
                        <span className="text-xs text-gray-500">
                          {booking.provider_phone}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 font-medium text-gray-900">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    {booking.currency} {booking.total_price}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4">
                  <select
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
                    value={booking.status}
                    onChange={(e) =>
                      updateStatusMutation.mutate({
                        bookingId: booking.id,
                        status: e.target.value,
                      })
                    }
                    disabled={updateStatusMutation.isPending}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rejected">Rejected</option>
                    <option value="disputed">Disputed</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {booking.created_at
                      ? format(new Date(booking.created_at), "MMM d, yyyy")
                      : "N/A"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    in_progress: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800",
    disputed: "bg-orange-100 text-orange-800",
  };

  const className = styles[status] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className} capitalize`}
    >
      {status?.replace("_", " ")}
    </span>
  );
}

import { useQuery } from "@tanstack/react-query";

export function useAdminBookings(search = "", enabled = true) {
  return useQuery({
    queryKey: ["admin", "bookings", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/bookings?${params}`);
      if (!res.ok) {
        throw new Error("Failed to fetch bookings");
      }
      return res.json();
    },
    enabled,
  });
}

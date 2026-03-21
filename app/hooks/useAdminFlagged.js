import { useQuery } from "@tanstack/react-query";

export function useAdminFlagged(query, enabled) {
  return useQuery({
    queryKey: ["admin", "flagged", query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set("q", query.trim());
      }
      const res = await fetch(`/api/admin/flagged?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load flagged accounts");
      return res.json();
    },
    enabled,
  });
}

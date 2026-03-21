import { useQuery } from "@tanstack/react-query";

export function useAdminAds(enabled) {
  return useQuery({
    queryKey: ["admin", "ads"],
    queryFn: async () => {
      const res = await fetch("/api/admin/ads");
      if (!res.ok) throw new Error("Failed to load ads stats");
      return res.json();
    },
    enabled,
  });
}

import { useQuery } from "@tanstack/react-query";

export function useAdminLogs(enabled) {
  return useQuery({
    queryKey: ["admin", "logs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/logs");
      if (!res.ok) throw new Error("Failed to load logs");
      return res.json();
    },
    enabled,
  });
}

import { useQuery } from "@tanstack/react-query";

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const res = await fetch("/api/admin/overview");
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const err = new Error(payload.error || "Failed to load overview");
        err.status = res.status;
        throw err;
      }
      return res.json();
    },
    staleTime: 30000, // Data stays fresh for 30 seconds
    refetchInterval: 60000, // Refetch every 60 seconds instead of 5
    refetchIntervalInBackground: false,
    retry: 3, // Retry up to 3 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

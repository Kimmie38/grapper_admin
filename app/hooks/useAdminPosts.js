import { useQuery } from "@tanstack/react-query";

export function useAdminPosts(query, enabled) {
  return useQuery({
    queryKey: ["admin", "posts", query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set("q", query.trim());
      }
      const res = await fetch(`/api/admin/posts?${params.toString()}`);
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const err = new Error(payload.error || "Failed to load posts");
        err.status = res.status;
        throw err;
      }
      return res.json();
    },
    enabled,
    refetchInterval: 10000,
  });
}

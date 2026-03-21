import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUnflagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profileId, reason }) => {
      const res = await fetch(`/api/admin/flagged/${profileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active", reason }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to unflag account");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "flagged"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      toast.success("Account unflagged successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useRecountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/maintenance/recount", {
        method: "POST",
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to run maintenance");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
    },
  });
}

export function useUpdateBookingStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }) => {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to update booking status");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      toast.success("Booking status updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

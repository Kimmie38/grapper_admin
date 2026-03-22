import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUnflagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileId) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, profileId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "flagged"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      toast.success("Account unflagged successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unflag account");
    },
  });
}

export function useRecountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true, message: "Recount completed" };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      toast.success("Maintenance recount completed");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to run maintenance");
    },
  });
}

export function useUpdateBookingStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, bookingId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      toast.success("Booking status updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update booking status");
    },
  });
}

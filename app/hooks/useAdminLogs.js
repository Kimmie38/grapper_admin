import { useQuery } from "@tanstack/react-query";

const mockLogs = [
  {
    id: "log_001",
    timestamp: "2024-01-21T14:22:00Z",
    action: "User Login",
    user: "john.doe@example.com",
    details: "Successful login from IP 192.168.1.1",
    status: "success",
  },
  {
    id: "log_002",
    timestamp: "2024-01-21T14:15:00Z",
    action: "Post Created",
    user: "jane.smith@example.com",
    details: "Created new post: Machine Learning project assistance",
    status: "success",
  },
  {
    id: "log_003",
    timestamp: "2024-01-21T14:00:00Z",
    action: "Booking Completed",
    user: "mike.johnson@example.com",
    details: "Booking #booking_003 marked as completed",
    status: "success",
  },
  {
    id: "log_004",
    timestamp: "2024-01-21T13:45:00Z",
    action: "Payment Processed",
    user: "sarah.williams@example.com",
    details: "Payment of $75 processed successfully",
    status: "success",
  },
  {
    id: "log_005",
    timestamp: "2024-01-21T13:30:00Z",
    action: "Profile Updated",
    user: "alex.brown@example.com",
    details: "User updated their profile information",
    status: "success",
  },
];

export function useAdminLogs(enabled) {
  return useQuery({
    queryKey: ["admin", "logs"],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockLogs;
    },
    enabled,
  });
}

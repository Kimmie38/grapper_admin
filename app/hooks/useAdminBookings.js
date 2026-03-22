import { useQuery } from "@tanstack/react-query";

const mockBookings = [
  {
    id: "booking_001",
    client: "John Doe",
    provider: "Provider A",
    service: "Math Tutoring",
    date: "2024-01-25T14:00:00Z",
    duration: 60,
    amount: 75,
    status: "completed",
  },
  {
    id: "booking_002",
    client: "Jane Smith",
    provider: "Provider B",
    service: "Physics Coaching",
    date: "2024-01-26T10:30:00Z",
    duration: 90,
    amount: 120,
    status: "pending",
  },
  {
    id: "booking_003",
    client: "Mike Johnson",
    provider: "Provider C",
    service: "Programming Help",
    date: "2024-01-24T16:00:00Z",
    duration: 120,
    amount: 150,
    status: "completed",
  },
  {
    id: "booking_004",
    client: "Sarah Williams",
    provider: "Provider A",
    service: "Essay Review",
    date: "2024-01-23T13:00:00Z",
    duration: 45,
    amount: 60,
    status: "completed",
  },
  {
    id: "booking_005",
    client: "Alex Brown",
    provider: "Provider D",
    service: "Resume Consultation",
    date: "2024-01-27T11:00:00Z",
    duration: 30,
    amount: 45,
    status: "pending",
  },
];

export function useAdminBookings(search = "", enabled = true) {
  return useQuery({
    queryKey: ["admin", "bookings", search],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!search) {
        return mockBookings;
      }

      // Filter by search query
      const searchLower = search.toLowerCase();
      return mockBookings.filter(
        (booking) =>
          booking.client.toLowerCase().includes(searchLower) ||
          booking.provider.toLowerCase().includes(searchLower) ||
          booking.service.toLowerCase().includes(searchLower)
      );
    },
    enabled,
  });
}

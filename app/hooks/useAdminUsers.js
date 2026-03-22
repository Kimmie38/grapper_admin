import { useQuery } from "@tanstack/react-query";

const mockUsers = [
  {
    id: "user_001",
    email: "john.doe@example.com",
    name: "John Doe",
    university: "Stanford University",
    created_at: "2024-01-15T10:30:00Z",
    last_login: "2024-01-21T14:22:00Z",
    posts_count: 12,
    status: "active",
  },
  {
    id: "user_002",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    university: "MIT",
    created_at: "2024-01-16T09:15:00Z",
    last_login: "2024-01-21T16:45:00Z",
    posts_count: 8,
    status: "active",
  },
  {
    id: "user_003",
    email: "mike.johnson@example.com",
    name: "Mike Johnson",
    university: "Harvard University",
    created_at: "2024-01-17T11:20:00Z",
    last_login: "2024-01-20T12:10:00Z",
    posts_count: 5,
    status: "active",
  },
  {
    id: "user_004",
    email: "sarah.williams@example.com",
    name: "Sarah Williams",
    university: "Berkeley",
    created_at: "2024-01-18T14:45:00Z",
    last_login: "2024-01-21T13:20:00Z",
    posts_count: 15,
    status: "active",
  },
  {
    id: "user_005",
    email: "alex.brown@example.com",
    name: "Alex Brown",
    university: "Carnegie Mellon",
    created_at: "2024-01-19T08:30:00Z",
    last_login: "2024-01-21T10:15:00Z",
    posts_count: 3,
    status: "active",
  },
  {
    id: "user_006",
    email: "emma.davis@example.com",
    name: "Emma Davis",
    university: "Stanford University",
    created_at: "2024-01-20T13:45:00Z",
    last_login: "2024-01-21T09:50:00Z",
    posts_count: 7,
    status: "active",
  },
];

export function useAdminUsers(query, enabled) {
  return useQuery({
    queryKey: ["admin", "users", query],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!query.trim()) {
        return mockUsers;
      }

      // Filter by search query
      const searchLower = query.toLowerCase();
      return mockUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(searchLower) ||
          user.name.toLowerCase().includes(searchLower) ||
          user.university.toLowerCase().includes(searchLower)
      );
    },
    enabled,
  });
}

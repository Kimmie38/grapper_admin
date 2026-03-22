import { useQuery } from "@tanstack/react-query";

const mockFlaggedAccounts = [
  {
    id: "flagged_001",
    username: "suspicious_user_1",
    email: "suspicious1@example.com",
    flagged_at: "2024-01-20T10:30:00Z",
    reason: "Multiple reports for inappropriate content",
    report_count: 5,
  },
  {
    id: "flagged_002",
    username: "fake_provider_2",
    email: "fake2@example.com",
    flagged_at: "2024-01-19T14:15:00Z",
    reason: "Suspicious booking patterns",
    report_count: 3,
  },
  {
    id: "flagged_003",
    username: "spam_account_3",
    email: "spam3@example.com",
    flagged_at: "2024-01-18T09:45:00Z",
    reason: "Excessive promotional content",
    report_count: 2,
  },
];

export function useAdminFlagged(query, enabled) {
  return useQuery({
    queryKey: ["admin", "flagged", query],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!query.trim()) {
        return mockFlaggedAccounts;
      }

      // Filter by search query
      const searchLower = query.toLowerCase();
      return mockFlaggedAccounts.filter(
        (account) =>
          account.username.toLowerCase().includes(searchLower) ||
          account.email.toLowerCase().includes(searchLower) ||
          account.reason.toLowerCase().includes(searchLower)
      );
    },
    enabled,
  });
}

import { useQuery } from "@tanstack/react-query";

const mockOverviewData = {
  totals: {
    total_users: 12450,
    total_posts: 8923,
    total_comments: 45230,
    total_bookings: 3421,
    total_revenue: 125450.50,
    active_providers: 892,
  },
  postsByDay: [
    { date: "2024-01-15", posts: 45 },
    { date: "2024-01-16", posts: 52 },
    { date: "2024-01-17", posts: 38 },
    { date: "2024-01-18", posts: 61 },
    { date: "2024-01-19", posts: 55 },
    { date: "2024-01-20", posts: 48 },
    { date: "2024-01-21", posts: 67 },
  ],
  commentsByDay: [
    { date: "2024-01-15", comments: 123 },
    { date: "2024-01-16", comments: 156 },
    { date: "2024-01-17", comments: 98 },
    { date: "2024-01-18", comments: 187 },
    { date: "2024-01-19", comments: 142 },
    { date: "2024-01-20", comments: 165 },
    { date: "2024-01-21", comments: 201 },
  ],
  spendByDay: [
    { date: "2024-01-15", spend: 1250 },
    { date: "2024-01-16", spend: 1890 },
    { date: "2024-01-17", spend: 1450 },
    { date: "2024-01-18", spend: 2100 },
    { date: "2024-01-19", spend: 1750 },
    { date: "2024-01-20", spend: 1600 },
    { date: "2024-01-21", spend: 2300 },
  ],
  topUniversities: [
    { name: "Stanford University", count: 842 },
    { name: "MIT", count: 756 },
    { name: "Harvard University", count: 623 },
    { name: "Berkeley", count: 521 },
    { name: "Carnegie Mellon", count: 412 },
  ],
  revenue: {
    total: 125450.50,
    growth: 12.5,
    trends: [
      { month: "Jan", revenue: 45000 },
      { month: "Feb", revenue: 52000 },
      { month: "Mar", revenue: 58000 },
      { month: "Apr", revenue: 70000 },
    ],
    byProvider: [
      { provider: "Provider A", revenue: 45000 },
      { provider: "Provider B", revenue: 38000 },
      { provider: "Provider C", revenue: 32000 },
      { provider: "Provider D", revenue: 10450.50 },
    ],
  },
  bookings: {
    total: 3421,
    completed: 2980,
    pending: 341,
    cancelled: 100,
    trends: [
      { month: "Jan", bookings: 450 },
      { month: "Feb", bookings: 520 },
      { month: "Mar", bookings: 580 },
      { month: "Apr", bookings: 871 },
    ],
    byStatus: [
      { status: "Completed", count: 2980 },
      { status: "Pending", count: 341 },
      { status: "Cancelled", count: 100 },
    ],
  },
  providers: {
    total: 892,
    active: 756,
    inactive: 136,
    avgRating: 4.6,
    topPerformers: [
      { id: 1, name: "John Smith", servicesCount: 45, rating: 4.9, bookings: 234 },
      { id: 2, name: "Sarah Johnson", servicesCount: 38, rating: 4.8, bookings: 198 },
      { id: 3, name: "Mike Davis", servicesCount: 42, rating: 4.7, bookings: 187 },
    ],
    byCategory: [
      { category: "Tutoring", count: 234 },
      { category: "Consulting", count: 189 },
      { category: "Coaching", count: 256 },
      { category: "Other", count: 213 },
    ],
  },
  payments: {
    total: 125450.50,
    successful: 3401,
    failed: 20,
    byMethod: [
      { method: "Card", amount: 75000, percentage: 59.7 },
      { method: "PayStack", amount: 35000, percentage: 27.9 },
      { method: "Bank Transfer", amount: 15450.50, percentage: 12.3 },
    ],
  },
  engagement: {
    newSignups: 342,
    activeUsers: 8945,
    retentionRate: 78.5,
    signupTrends: [
      { date: "Week 1", signups: 145 },
      { date: "Week 2", signups: 178 },
      { date: "Week 3", signups: 156 },
      { date: "Week 4", signups: 87 },
      { date: "Week 5", signups: 92 },
      { date: "Week 6", signups: 124 },
      { date: "Week 7", signups: 167 },
      { date: "Week 8", signups: 201 },
    ],
  },
  marketplace: {
    health: 92,
    qualityScore: 8.7,
    userSatisfaction: 4.6,
    responseTime: 4.2,
  },
  generatedAt: new Date().toISOString(),
};

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockOverviewData;
    },
    staleTime: 30000,
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
    retry: 1,
  });
}

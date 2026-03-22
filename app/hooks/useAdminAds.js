import { useQuery } from "@tanstack/react-query";

const mockAdsData = {
  counts: {
    active: 145,
    paused: 32,
    completed: 287,
    total_spend: 12450.75,
  },
  history: [
    { date: "2024-01-15", impressions: 5420, clicks: 342, spend: 1250 },
    { date: "2024-01-16", impressions: 6100, clicks: 412, spend: 1890 },
    { date: "2024-01-17", impressions: 4890, clicks: 298, spend: 1450 },
    { date: "2024-01-18", impressions: 7200, clicks: 520, spend: 2100 },
    { date: "2024-01-19", impressions: 6050, clicks: 401, spend: 1750 },
    { date: "2024-01-20", impressions: 5800, clicks: 380, spend: 1600 },
    { date: "2024-01-21", impressions: 7850, clicks: 580, spend: 2300 },
  ],
  top_campaigns: [
    { id: 1, name: "Summer Tutoring Promo", impressions: 45230, clicks: 3120, spend: 3850 },
    { id: 2, name: "Spring Services Campaign", impressions: 38950, clicks: 2680, spend: 3200 },
    { id: 3, name: "New Provider Onboarding", impressions: 32100, clicks: 2100, spend: 2800 },
    { id: 4, name: "Student Retention", impressions: 28750, clicks: 1850, spend: 2600 },
  ],
};

export function useAdminAds(enabled) {
  return useQuery({
    queryKey: ["admin", "ads"],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockAdsData;
    },
    enabled,
  });
}

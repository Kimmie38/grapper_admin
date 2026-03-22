import { useQuery } from "@tanstack/react-query";

const mockPosts = [
  {
    id: "post_001",
    title: "Need help with calculus homework",
    content: "I'm struggling with derivatives and limits. Can anyone help?",
    author: "John Doe",
    author_id: "user_001",
    created_at: "2024-01-21T14:30:00Z",
    comments_count: 5,
    status: "published",
  },
  {
    id: "post_002",
    title: "Machine Learning project assistance",
    content: "Looking for someone to help with my ML final project",
    author: "Jane Smith",
    author_id: "user_002",
    created_at: "2024-01-21T13:15:00Z",
    comments_count: 8,
    status: "published",
  },
  {
    id: "post_003",
    title: "Physics assignment due tomorrow",
    content: "Need urgent help with thermodynamics problems",
    author: "Mike Johnson",
    author_id: "user_003",
    created_at: "2024-01-21T12:45:00Z",
    comments_count: 3,
    status: "published",
  },
  {
    id: "post_004",
    title: "Resume review for internship applications",
    content: "Would appreciate feedback on my resume for tech internships",
    author: "Sarah Williams",
    author_id: "user_004",
    created_at: "2024-01-21T11:20:00Z",
    comments_count: 12,
    status: "published",
  },
  {
    id: "post_005",
    title: "Web development mentorship",
    content: "Offering to mentor junior developers in web technologies",
    author: "Alex Brown",
    author_id: "user_005",
    created_at: "2024-01-21T10:00:00Z",
    comments_count: 2,
    status: "published",
  },
];

export function useAdminPosts(query, enabled) {
  return useQuery({
    queryKey: ["admin", "posts", query],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!query.trim()) {
        return mockPosts;
      }

      // Filter by search query
      const searchLower = query.toLowerCase();
      return mockPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.author.toLowerCase().includes(searchLower)
      );
    },
    enabled,
  });
}

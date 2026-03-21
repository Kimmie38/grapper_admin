import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    // Get trending hashtags from the last 7 days
    const trends = await sql`
      SELECT 
        h.id,
        h.tag, 
        COUNT(ph.post_id)::int as count
      FROM hashtags h
      JOIN post_hashtags ph ON h.id = ph.hashtag_id
      JOIN posts p ON ph.post_id = p.id
      WHERE p.created_at > NOW() - INTERVAL '7 days'
      GROUP BY h.id, h.tag
      ORDER BY count DESC
      LIMIT 10
    `;

    return Response.json(trends);
  } catch (error) {
    console.error("Error fetching trending hashtags:", error);
    return Response.json({ error: "Failed to fetch trends" }, { status: 500 });
  }
}

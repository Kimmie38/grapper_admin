import sql from "@/app/api/utils/sql";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam) : 20;

  // Validate limit to prevent abuse
  const safeLimit = isNaN(limit) || limit > 100 || limit < 1 ? 20 : limit;

  try {
    let users;
    if (query) {
      // Search across name, university, bio, services (jsonb), and interests (jsonb)
      users = await sql`
        SELECT 
          p.id, p.user_id, p.full_name, p.avatar_url, p.university, p.level, p.bio, p.services, p.interests, p.account_type,
          (
            SELECT COUNT(*)::int
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            WHERE s.profile_id = p.id
            AND b.status NOT IN ('completed', 'cancelled', 'rejected')
          ) as active_projects
        FROM profiles p
        WHERE (p.full_name ILIKE ${"%" + query + "%"}
        OR p.university ILIKE ${"%" + query + "%"}
        OR p.bio ILIKE ${"%" + query + "%"}
        OR p.services::text ILIKE ${"%" + query + "%"}
        OR p.interests::text ILIKE ${"%" + query + "%"})
        AND p.status NOT IN ('flagged', 'shadow_ban')
        LIMIT ${safeLimit}
      `;
    } else {
      users = await sql`
        SELECT 
          p.id, p.user_id, p.full_name, p.avatar_url, p.university, p.level, p.bio, p.services, p.interests, p.account_type,
          (
            SELECT COUNT(*)::int
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            WHERE s.profile_id = p.id
            AND b.status NOT IN ('completed', 'cancelled', 'rejected')
          ) as active_projects
        FROM profiles p
        WHERE p.status NOT IN ('flagged', 'shadow_ban')
        ORDER BY p.created_at DESC
        LIMIT ${safeLimit}
      `;
    }

    return Response.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

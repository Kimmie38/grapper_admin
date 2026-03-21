import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 1. Get user interests and recent searches
  const userProfile =
    await sql`SELECT interests FROM profiles WHERE user_id = ${userId}`;
  const userInterests = userProfile[0]?.interests || [];

  const recentSearches = await sql`
    SELECT query FROM user_searches 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC 
    LIMIT 10
  `;
  const searchTerms = recentSearches.map((s) => s.query);

  // Combine keywords
  const keywords = [...new Set([...userInterests, ...searchTerms])].filter(
    (k) => k && k.length > 2,
  );

  if (keywords.length === 0) {
    // Fallback: Random featured or highly rated providers if no data
    const fallbackProviders = await sql`
      SELECT 
        p.id, p.full_name, p.avatar_url, p.bio, p.rating, p.reviews_count,
        (
          SELECT plan_type FROM subscriptions 
          WHERE profile_id = p.id AND status = 'active' 
          LIMIT 1
        ) as plan_type
      FROM profiles p
      WHERE p.account_type IN ('provider', 'worker', 'organization', 'both')
      ORDER BY p.rating DESC NULLS LAST, p.created_at DESC
      LIMIT 5
    `;
    return Response.json({ providers: fallbackProviders, reason: "popular" });
  }

  // 2. Find matching providers
  // We'll use ILIKE for partial matches on services and profile data
  // This is a simple implementation; for production, Full Text Search (tsvector) is better.

  // Construct dynamic OR clauses for keywords
  // SQL template literals don't support dynamic arrays in this way easily for ILIKE,
  // so we'll do a slightly less efficient but functional query using checking if any keyword is contained.

  // Actually, let's just fetch potential candidates and filter in JS or use a smart query.
  // Using `SIMILAR TO` or regex is an option.

  const keywordPattern = `%(${keywords.join("|")})%`;

  const providers = await sql`
    WITH Matches AS (
      SELECT 
        p.id, 
        p.full_name, 
        p.avatar_url, 
        p.bio, 
        p.skills,
        s.plan_type,
        -- Score based on matches
        (
          CASE WHEN p.bio SIMILAR TO ${keywordPattern} THEN 2 ELSE 0 END +
          CASE WHEN EXISTS (
            SELECT 1 FROM services serv 
            WHERE serv.profile_id = p.id 
            AND (serv.title SIMILAR TO ${keywordPattern} OR serv.description SIMILAR TO ${keywordPattern})
          ) THEN 5 ELSE 0 END +
          CASE WHEN EXISTS (
            SELECT 1 FROM subscriptions sub
            WHERE sub.profile_id = p.id
            AND sub.status = 'active'
            AND sub.plan_type IN ('pro', 'premium', 'verified_yearly')
          ) THEN 3 ELSE 0 END -- Boost for verified
        ) as score
      FROM profiles p
      LEFT JOIN subscriptions s ON p.id = s.profile_id AND s.status = 'active'
      WHERE p.account_type IN ('provider', 'worker', 'organization', 'both')
      AND p.user_id != ${userId} -- Don't recommend self
    )
    SELECT * FROM Matches
    WHERE score > 0
    ORDER BY score DESC, id
    LIMIT 10
  `;

  // Fetch additional details (e.g., top service) for the recommended providers
  const providersWithDetails = await Promise.all(
    providers.map(async (p) => {
      const topService = await sql`
            SELECT title, price, currency, image_url 
            FROM services 
            WHERE profile_id = ${p.id} 
            ORDER BY rating DESC 
            LIMIT 1
        `;

      return {
        ...p,
        topService: topService[0] || null,
        isVerified: ["pro", "premium", "verified_yearly"].includes(p.plan_type),
      };
    }),
  );

  return Response.json({ providers: providersWithDetails, reason: "matched" });
}

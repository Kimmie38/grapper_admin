import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";
import { convertAndAdjustPrice } from "@/app/api/utils/pricing";

export async function GET(request, { params }) {
  const { id: providerProfileId } = params;
  const session = await getSession(request);
  const currentUserId = session?.user?.id;

  // 1. Fetch Provider Profile
  const providerRows = await sql`
    SELECT id, user_id as provider_user_id, full_name, avatar_url, university, level, bio, account_type, services, interests, created_at, status, phone_number
    FROM profiles
    WHERE id = ${providerProfileId}
  `;

  if (providerRows.length === 0) {
    return Response.json({ error: "Provider not found" }, { status: 404 });
  }
  const provider = providerRows[0];

  // Fetch strike count (total reports across all content)
  const strikeCountResult = await sql`
    SELECT COUNT(*)::int as count 
    FROM reports 
    WHERE 
      (target_type = 'User' AND target_id = ${providerProfileId})
      OR (target_type = 'Post' AND target_id IN (SELECT id::text FROM posts WHERE profile_id = ${providerProfileId}))
      OR (target_type = 'Service' AND target_id IN (SELECT id::text FROM services WHERE profile_id = ${providerProfileId}))
      OR (target_type = 'Comment' AND target_id IN (SELECT id::text FROM comments WHERE profile_id = ${providerProfileId}))
  `;
  provider.strikeCount = strikeCountResult[0].count;

  // Fetch provider's subscription status (for blue tick)
  const providerSub = await sql`
    SELECT plan_type FROM subscriptions 
    WHERE profile_id = ${providerProfileId} 
    AND status = 'active' 
    AND (end_date IS NULL OR end_date > NOW())
    ORDER BY start_date DESC
    LIMIT 1
  `;
  provider.isPremium =
    providerSub.length > 0 &&
    ["pro", "premium", "verified_yearly"].includes(providerSub[0].plan_type);

  // Stats: Total Completed Gigs
  const completedGigsResult = await sql`
    SELECT count(*) as count
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    WHERE s.profile_id = ${providerProfileId}
    AND b.status = 'completed'
  `;
  provider.totalCompletedGigs = parseInt(completedGigsResult[0].count || 0);

  // Stats: Average Rating
  const ratingResult = await sql`
    SELECT AVG(sr.rating) as avg_rating, COUNT(sr.id) as review_count
    FROM service_reviews sr
    JOIN services s ON sr.service_id = s.id
    WHERE s.profile_id = ${providerProfileId}
  `;
  provider.averageRating = parseFloat(ratingResult[0].avg_rating || 0).toFixed(
    1,
  );
  provider.totalReviews = parseInt(ratingResult[0].review_count || 0);

  // Stats: Active Gigs (bookings in progress)
  const activeGigsResult = await sql`
    SELECT count(*) as count
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    WHERE s.profile_id = ${providerProfileId}
    AND b.status IN ('pending', 'confirmed', 'in_progress', 'accepted')
  `;
  provider.totalActiveGigs = parseInt(activeGigsResult[0].count || 0);

  // 2. Fetch Provider's Active Services
  const services = await sql`
    SELECT 
      s.id, s.title, s.description, s.price, s.currency, s.rating, s.reviews_count, s.image_url,
      (
        SELECT COUNT(*)::int
        FROM bookings b
        JOIN services s2 ON b.service_id = s2.id
        WHERE s2.profile_id = s.profile_id
        AND b.status NOT IN ('completed', 'cancelled', 'rejected')
      ) as active_projects
    FROM services s
    WHERE s.profile_id = ${providerProfileId}
  `;

  // Adjust prices based on viewer's country and convert currency
  if (currentUserId) {
    const viewerProfiles =
      await sql`SELECT country FROM profiles WHERE user_id = ${currentUserId} LIMIT 1`;
    if (viewerProfiles.length > 0) {
      const viewerCountry = viewerProfiles[0].country;

      await Promise.all(
        services.map(async (service) => {
          const adjusted = await convertAndAdjustPrice(
            parseFloat(service.price),
            service.currency || "USD",
            viewerCountry,
          );
          service.price = adjusted.price;
          service.display_currency = adjusted.currency;
        }),
      );
    }
  }

  // 3. Check if requester is Premium
  let isPremium = false;
  if (currentUserId) {
    const subRows = await sql`
      SELECT s.plan_type, s.status
      FROM subscriptions s
      JOIN profiles p ON s.profile_id = p.id
      WHERE p.user_id = ${currentUserId}
      AND s.status = 'active'
      AND (s.end_date IS NULL OR s.end_date > NOW())
    `;
    if (
      subRows.length > 0 &&
      ["pro", "premium", "verified_yearly"].includes(subRows[0].plan_type)
    ) {
      isPremium = true;
    }
  }

  // 4. Fetch Work History (Completed Gigs + Reviews)
  // Now accessible to everyone as requested
  const workHistory = await sql`
      SELECT 
        b.id as booking_id, 
        b.created_at as booking_date,
        s.title as service_title,
        sr.rating,
        sr.comment,
        sr.created_at as review_date,
        u.name as reviewer_name,
        u.image as reviewer_avatar
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      LEFT JOIN service_reviews sr ON b.id = sr.booking_id
      LEFT JOIN auth_users u ON b.user_id = u.id
      WHERE s.profile_id = ${providerProfileId}
      AND b.status = 'completed'
      ORDER BY b.created_at DESC
    `;

  // 5. Fetch Recent Posts
  const recentPosts = await sql`
    SELECT id, content, image_url, audio_url, video_url, created_at, likes_count, comments_count
    FROM posts
    WHERE profile_id = ${providerProfileId}
    ORDER BY created_at DESC
    LIMIT 5
  `;

  return Response.json({
    provider,
    services,
    workHistory,
    isPremium,
    recentPosts,
  });
}

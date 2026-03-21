import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request, { params }) {
  const session = await getSession(request);
  const { id } = params;

  // Fetch ad details
  const ads = await sql`
    SELECT 
      a.*, 
      p.full_name as advertiser_name,
      p.avatar_url as advertiser_avatar,
      c.objective
    FROM ads a
    JOIN ad_sets as_set ON a.ad_set_id = as_set.id
    JOIN ad_campaigns c ON as_set.campaign_id = c.id
    JOIN profiles p ON c.profile_id = p.id
    WHERE a.id = ${id}
  `;

  if (ads.length === 0) {
    return Response.json({ error: "Ad not found" }, { status: 404 });
  }

  const ad = ads[0];
  ad.isAd = true;

  // Check if liked by current user
  if (session?.user) {
    const profiles =
      await sql`SELECT id FROM profiles WHERE user_id = ${session.user.id}`;
    if (profiles.length > 0) {
      const profileId = profiles[0].id;
      const likes = await sql`
        SELECT 1 FROM ad_likes 
        WHERE ad_id = ${id} AND profile_id = ${profileId}
      `;
      ad.liked = likes.length > 0;
    } else {
      ad.liked = false;
    }
  } else {
    ad.liked = false;
  }

  return Response.json(ad);
}

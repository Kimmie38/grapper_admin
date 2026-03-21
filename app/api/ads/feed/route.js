import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  const session = await getSession(request);
  let profileId = null;

  if (session?.user) {
    const profiles =
      await sql`SELECT id FROM profiles WHERE user_id = ${session.user.id}`;
    if (profiles.length > 0) {
      profileId = profiles[0].id;
    }
  }

  // Fetch a mix of ads to inject into the feed
  // Joining with profile to get the advertiser's name and avatar
  const ads = await sql`
    SELECT 
      a.*, 
      p.full_name as advertiser_name,
      p.avatar_url as advertiser_avatar,
      c.objective,
      CASE 
        WHEN ${profileId}::uuid IS NOT NULL AND EXISTS (
          SELECT 1 FROM ad_likes al WHERE al.ad_id = a.id AND al.profile_id = ${profileId}
        ) THEN true 
        ELSE false 
      END as liked
    FROM ads a
    JOIN ad_sets as_set ON a.ad_set_id = as_set.id
    JOIN ad_campaigns c ON as_set.campaign_id = c.id
    JOIN profiles p ON c.profile_id = p.id
    WHERE a.status = 'active'
    AND p.status NOT IN ('flagged', 'shadow_ban')
    ORDER BY RANDOM()
    LIMIT 5
  `;

  return Response.json(ads);
}

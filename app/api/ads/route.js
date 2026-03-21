import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's profile id
  const profiles =
    await sql`SELECT id FROM profiles WHERE user_id = ${session.user.id}`;
  if (profiles.length === 0)
    return Response.json({ error: "Profile not found" }, { status: 404 });
  const profileId = profiles[0].id;

  // Fetch all ads created by this user with their stats
  const ads = await sql`
    SELECT 
      a.*, 
      as_set.budget_type, as_set.budget_amount, 
      c.objective, c.name as campaign_name,
      COALESCE(SUM(am.impressions), 0) as total_impressions,
      COALESCE(SUM(am.clicks), 0) as total_clicks,
      COALESCE(SUM(am.spend), 0) as total_spend
    FROM ads a
    JOIN ad_sets as_set ON a.ad_set_id = as_set.id
    JOIN ad_campaigns c ON as_set.campaign_id = c.id
    LEFT JOIN ad_metrics am ON a.id = am.ad_id
    WHERE c.profile_id = ${profileId}
    GROUP BY a.id, as_set.id, c.id
    ORDER BY a.created_at DESC
  `;

  return Response.json(ads);
}

export async function POST(request) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's profile id
  const profiles =
    await sql`SELECT id FROM profiles WHERE user_id = ${session.user.id}`;
  if (profiles.length === 0)
    return Response.json({ error: "Profile not found" }, { status: 404 });
  const profileId = profiles[0].id;

  const body = await request.json();
  const {
    campaignName,
    objective,
    budgetType,
    budgetAmount,
    headline,
    primaryText,
    mediaUrl,
    mediaType,
    destinationUrl,
    ctaType,
  } = body;

  try {
    const result = await sql.transaction(async (txn) => {
      // 1. Create Campaign
      const campaigns = await txn`
        INSERT INTO ad_campaigns (profile_id, name, objective, status)
        VALUES (${profileId}, ${campaignName}, ${objective}, 'active')
        RETURNING id
      `;
      const campaignId = campaigns[0].id;

      // 2. Create Ad Set (Simplified: 1 set per campaign for MVP)
      const adSets = await txn`
        INSERT INTO ad_sets (campaign_id, name, budget_type, budget_amount, status)
        VALUES (${campaignId}, 'Default Set', ${budgetType}, ${budgetAmount}, 'active')
        RETURNING id
      `;
      const adSetId = adSets[0].id;

      // 3. Create Ad
      const ads = await txn`
        INSERT INTO ads (ad_set_id, name, headline, primary_text, media_url, media_type, cta_type, destination_url, status)
        VALUES (${adSetId}, 'Default Ad', ${headline}, ${primaryText}, ${mediaUrl}, ${mediaType || "image"}, ${ctaType}, ${destinationUrl}, 'active')
        RETURNING *
      `;
      return ads[0];
    });

    return Response.json(result);
  } catch (error) {
    console.error("Error creating ad:", error);
    return Response.json({ error: "Failed to create ad" }, { status: 500 });
  }
}

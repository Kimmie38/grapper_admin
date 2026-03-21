import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";
import { requireAdmin } from "@/app/api/utils/requireAdmin";

export async function GET(request) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;

  try {
    // 1. Overview Counts
    const counts = await sql`
      SELECT
        (SELECT COUNT(*) FROM ad_campaigns) as campaigns_count,
        (SELECT COUNT(*) FROM ad_sets) as ad_sets_count,
        (SELECT COUNT(*) FROM ads) as ads_count,
        (SELECT COALESCE(SUM(impressions), 0) FROM ad_metrics) as total_impressions,
        (SELECT COALESCE(SUM(clicks), 0) FROM ad_metrics) as total_clicks,
        (SELECT COALESCE(SUM(spend), 0) FROM ad_metrics) as total_spend
    `;

    // 2. Charts Data (Last 30 days)
    const metricsHistory = await sql`
      SELECT
        date,
        SUM(impressions) as impressions,
        SUM(clicks) as clicks,
        SUM(spend) as spend
      FROM ad_metrics
      WHERE date >= NOW() - INTERVAL '30 days'
      GROUP BY date
      ORDER BY date ASC
    `;

    // 3. Top Campaigns
    const topCampaigns = await sql`
      SELECT
        c.id,
        c.name,
        c.status,
        COALESCE(SUM(m.impressions), 0) as impressions,
        COALESCE(SUM(m.spend), 0) as spend
      FROM ad_campaigns c
      LEFT JOIN ad_sets s ON s.campaign_id = c.id
      LEFT JOIN ads a ON a.ad_set_id = s.id
      LEFT JOIN ad_metrics m ON m.ad_id = a.id
      GROUP BY c.id
      ORDER BY spend DESC
      LIMIT 5
    `;

    return Response.json({
      counts: counts[0],
      history: metricsHistory,
      top_campaigns: topCampaigns,
    });
  } catch (error) {
    console.error("Admin ads stats error:", error);
    return Response.json(
      { error: "Failed to fetch ad stats" },
      { status: 500 },
    );
  }
}

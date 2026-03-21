import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request, { params }) {
  const { id } = params;

  // We can optionally check for auth if we want to prevent bots,
  // but for public ads, we usually just want to record the view.
  // Ideally, we'd check for IP or session to prevent spam, but for now just increment.

  try {
    // Check if metric exists for today
    await sql`
      INSERT INTO ad_metrics (ad_id, date, impressions, clicks, spend)
      VALUES (${id}, CURRENT_DATE, 1, 0, 0)
      ON CONFLICT (ad_id, date)
      DO UPDATE SET impressions = ad_metrics.impressions + 1
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error tracking impression:", error);
    return Response.json(
      { error: "Failed to track impression" },
      { status: 500 },
    );
  }
}

import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/requireAdmin";

export async function GET(request) {
  const adminError = await requireAdmin();
  if (adminError) return adminError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "pending";

  try {
    const reports = await sql`
      SELECT 
        r.*,
        p_reporter.full_name as reporter_name,
        p_reporter.avatar_url as reporter_avatar,
        p_resolved.full_name as resolved_by_name,
        p_claimed.full_name as claimed_by_name
      FROM reports r
      JOIN profiles p_reporter ON r.reporter_id = p_reporter.id
      LEFT JOIN profiles p_resolved ON r.resolved_by = p_resolved.id
      LEFT JOIN profiles p_claimed ON r.claimed_by = p_claimed.id
      WHERE ${status} = 'all' OR r.status = ${status}
      ORDER BY r.created_at DESC
    `;

    return Response.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return Response.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

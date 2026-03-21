import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";
import { requireAdmin } from "@/app/api/utils/requireAdmin";

export async function GET(request) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;

  try {
    const logs = await sql`
      SELECT
        l.*,
        p.full_name as admin_name,
        p.avatar_url as admin_avatar
      FROM admin_audit_logs l
      LEFT JOIN profiles p ON l.admin_id = p.id
      ORDER BY l.created_at DESC
      LIMIT 100
    `;
    return Response.json(logs);
  } catch (error) {
    console.error("Fetch logs error:", error);
    return Response.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

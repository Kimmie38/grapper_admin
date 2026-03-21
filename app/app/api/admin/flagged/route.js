import sql from "../../utils/sql";
import { requireAdmin } from "../../utils/requireAdmin";

export async function GET(request) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) {
      return adminCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    const values = [];
    let whereClause = "WHERE p.status IN ('flagged', 'shadow_ban')";

    if (q) {
      values.push(`%${q}%`);
      const p = values.length;
      whereClause += ` AND (au.email ILIKE $${p} OR au.name ILIKE $${p} OR p.full_name ILIKE $${p} OR p.university ILIKE $${p})`;
    }

    const query = `
      SELECT
        au.id AS user_id,
        au.email,
        au.name,
        p.id AS profile_id,
        p.full_name,
        p.university,
        p.level,
        p.account_type,
        p.status,
        p.avatar_url,
        (SELECT COUNT(*) FROM reports r WHERE r.target_profile_id = p.id OR (r.target_type = 'User' AND r.target_id = p.id::text)) as report_count
      FROM auth_users au
      JOIN profiles p ON p.user_id = au.id
      ${whereClause}
      ORDER BY p.created_at DESC
    `;

    const rows = await sql(query, values);
    return Response.json(rows);
  } catch (err) {
    console.error("GET /api/admin/flagged error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

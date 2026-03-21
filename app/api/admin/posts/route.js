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

    const limitRaw = Number(searchParams.get("limit") || 50);
    const offsetRaw = Number(searchParams.get("offset") || 0);

    const limit = Number.isFinite(limitRaw)
      ? Math.min(Math.max(limitRaw, 1), 200)
      : 50;
    const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;

    const values = [];
    let whereClause = "WHERE 1=1";

    if (q) {
      values.push(`%${q}%`);
      const p = values.length;
      whereClause += ` AND (posts.content ILIKE $${p} OR profiles.full_name ILIKE $${p} OR profiles.university ILIKE $${p})`;
    }

    values.push(limit);
    const limitIdx = values.length;
    values.push(offset);
    const offsetIdx = values.length;

    const query = `
      SELECT
        posts.*,
        profiles.full_name AS user_name,
        profiles.university AS user_university,
        profiles.avatar_url AS user_avatar
      FROM posts
      JOIN profiles ON posts.profile_id = profiles.id
      ${whereClause}
      ORDER BY posts.created_at DESC
      LIMIT $${limitIdx}
      OFFSET $${offsetIdx}
    `;

    const rows = await sql(query, values);
    return Response.json({ rows, limit, offset, q });
  } catch (err) {
    console.error("GET /api/admin/posts error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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

    let query = `
      SELECT
        au.id AS user_id,
        au.email,
        au.name,
        au.image,
        p.id AS profile_id,
        p.full_name,
        p.university,
        p.phone_number,
        p.level,
        p.account_type,
        p.created_at AS profile_created_at
      FROM auth_users au
      LEFT JOIN profiles p ON p.user_id = au.id
    `;

    if (q) {
      values.push(`%${q}%`);
      const p = values.length;
      query += ` WHERE (au.email ILIKE $${p} OR au.name ILIKE $${p} OR p.full_name ILIKE $${p} OR p.university ILIKE $${p})`;
    } else {
      query += ` WHERE 1=1`;
    }

    values.push(limit);
    const limitIdx = values.length;
    values.push(offset);
    const offsetIdx = values.length;

    query += `
      ORDER BY au.id DESC
      LIMIT $${limitIdx}
      OFFSET $${offsetIdx}
    `;

    const rows = await sql(query, values);
    return Response.json({ rows, limit, offset, q });
  } catch (err) {
    console.error("GET /api/admin/users error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

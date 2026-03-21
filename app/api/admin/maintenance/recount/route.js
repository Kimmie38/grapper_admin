import sql from "../../../utils/sql";
import { requireAdmin } from "../../../utils/requireAdmin";

export async function POST(request) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) {
      return adminCheck.response;
    }

    await sql.transaction((txn) => [
      txn`
        WITH counts AS (
          SELECT post_id, COUNT(*)::int AS cnt
          FROM comments
          GROUP BY post_id
        )
        UPDATE posts p
        SET comments_count = counts.cnt
        FROM counts
        WHERE p.id = counts.post_id
      `,
      txn`
        UPDATE posts p
        SET comments_count = 0
        WHERE NOT EXISTS (
          SELECT 1 FROM comments c WHERE c.post_id = p.id
        )
      `,
    ]);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("POST /api/admin/maintenance/recount error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

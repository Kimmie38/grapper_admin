import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

function normalizeUserId(raw) {
  const n = typeof raw === "string" ? Number.parseInt(raw, 10) : Number(raw);
  if (!Number.isFinite(n)) {
    return null;
  }
  return n;
}

// IMPORTANT: This is meant to be used once to create your first admin.
// After you have an admin account, delete this route.
export async function POST(request) {
  try {
    const session = await getSession(request);

    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = normalizeUserId(session.user.id);
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create a profile if missing
    const existing =
      await sql`SELECT id FROM profiles WHERE user_id = ${userId} LIMIT 1`;

    if (!existing.length) {
      await sql`
        INSERT INTO profiles (user_id, full_name, avatar_url, account_type)
        VALUES (${userId}, ${session.user.name || null}, ${session.user.image || null}, 'admin')
      `;
    } else {
      await sql`
        UPDATE profiles
        SET account_type = 'admin'
        WHERE user_id = ${userId}
      `;
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("POST /api/admin/bootstrap error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

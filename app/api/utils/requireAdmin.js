import sql from "@/api/utils/sql";
import { getSession } from "@/api/utils/getSession";

function normalizeUserId(raw) {
  const n = typeof raw === "string" ? Number.parseInt(raw, 10) : Number(raw);
  if (!Number.isFinite(n)) {
    return null;
  }
  return n;
}

export async function requireAdmin(request) {
  const session = await getSession(request);

  if (!session || !session.user?.id) {
    return {
      ok: false,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const userId = normalizeUserId(session.user.id);
  if (!userId) {
    return {
      ok: false,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const profiles = await sql`
    SELECT id, user_id, full_name, university, account_type
    FROM profiles
    WHERE user_id = ${userId}
    LIMIT 1
  `;

  if (!profiles.length) {
    return {
      ok: false,
      response: Response.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  const profile = profiles[0];
  if (profile.account_type !== "admin") {
    return {
      ok: false,
      response: Response.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, session, profile, userId };
}

import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      token,
      token_type = "expo", // 'expo' | 'fcm'
      platform = null,
      device_id = null,
    } = body || {};

    if (!token || typeof token !== "string") {
      return Response.json({ error: "Missing token" }, { status: 400 });
    }

    await sql`
      INSERT INTO push_tokens (user_id, token, token_type, platform, device_id, updated_at)
      VALUES (${session.user.id}, ${token}, ${token_type}, ${platform}, ${device_id}, now())
      ON CONFLICT (token)
      DO UPDATE SET
        user_id = EXCLUDED.user_id,
        token_type = EXCLUDED.token_type,
        platform = EXCLUDED.platform,
        device_id = EXCLUDED.device_id,
        updated_at = now()
    `;

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Error registering push token:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

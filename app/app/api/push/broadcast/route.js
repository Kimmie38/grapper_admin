import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";
import { sendPushToTokens } from "@/app/api/utils/push";

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Simple admin gate based on profiles.account_type
  const profileRows = await sql`
    SELECT account_type
    FROM profiles
    WHERE user_id = ${session.user.id}
    LIMIT 1
  `;

  const accountType = profileRows?.[0]?.account_type;
  if (accountType !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title = "Announcement", message = "", data = {} } = body || {};

    const tokens = await sql`
      SELECT token, token_type
      FROM push_tokens
    `;

    // Avoid provider limits (FCM legacy: 1000 tokens; Expo: keep batches smaller)
    const batches = chunk(tokens, 500);
    const results = [];

    for (const batchTokens of batches) {
      // eslint-disable-next-line no-await-in-loop
      results.push(
        await sendPushToTokens({
          tokens: batchTokens,
          title,
          body: message,
          data,
        }),
      );
    }

    return Response.json({ ok: true, batches: batches.length, results });
  } catch (error) {
    console.error("Error sending broadcast push:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

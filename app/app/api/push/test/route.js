import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";
import { sendPushToTokens } from "@/app/api/utils/push";

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title = "Test notification",
      message = "This is a test push notification.",
      data = {},
    } = body || {};

    const tokens = await sql`
      SELECT token, token_type
      FROM push_tokens
      WHERE user_id = ${session.user.id}
    `;

    const result = await sendPushToTokens({
      tokens,
      title,
      body: message,
      data,
    });

    return Response.json({ ok: true, result });
  } catch (error) {
    console.error("Error sending test push:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

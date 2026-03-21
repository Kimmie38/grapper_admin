import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In a real app, verify payment here.
  // For now, we assume payment was successful on the client side.

  const rows = await sql`
    UPDATE profiles
    SET verified = true
    WHERE user_id = ${session.user.id}
    RETURNING verified
  `;

  return Response.json({ success: true, verified: rows[0].verified });
}

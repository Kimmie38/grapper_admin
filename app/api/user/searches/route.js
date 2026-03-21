import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { query } = await request.json();

  if (!query || typeof query !== "string") {
    return Response.json({ error: "Query is required" }, { status: 400 });
  }

  // Save search
  await sql`
    INSERT INTO user_searches (user_id, query)
    VALUES (${session.user.id}, ${query.trim()})
  `;

  return Response.json({ success: true });
}

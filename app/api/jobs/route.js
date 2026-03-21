import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "open";

  const jobs = await sql`
    SELECT 
      j.*,
      u.name as posted_by_name,
      u.image as posted_by_image,
      p.verified as posted_by_verified
    FROM jobs j
    JOIN auth_users u ON j.user_id = u.id
    LEFT JOIN profiles p ON p.user_id = u.id
    WHERE j.status = ${status}
    ORDER BY j.created_at DESC
  `;

  return Response.json(jobs);
}

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, budget, location } = body;

  if (!title) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO jobs (user_id, title, description, budget, location)
    VALUES (${session.user.id}, ${title}, ${description}, ${budget}, ${location})
    RETURNING *
  `;

  return Response.json(rows[0]);
}

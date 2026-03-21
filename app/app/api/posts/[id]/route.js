import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request, { params }) {
  const session = await getSession(request);
  const { id } = params;

  let profileId = null;
  if (session?.user) {
    const profiles =
      await sql`SELECT id FROM profiles WHERE user_id = ${session.user.id}`;
    if (profiles.length > 0) profileId = profiles[0].id;
  }

  const rows = await sql`
    SELECT 
      posts.*,
      profiles.full_name as user_name,
      profiles.avatar_url as user_avatar,
      profiles.university as user_university,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id) as likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comments_count,
      EXISTS(SELECT 1 FROM post_likes WHERE post_id = posts.id AND profile_id = ${profileId}) as liked
    FROM posts
    JOIN profiles ON posts.profile_id = profiles.id
    WHERE posts.id = ${id}
  `;

  if (rows.length === 0) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  return Response.json(rows[0]);
}

export async function PATCH(request, { params }) {
  const session = await getSession(request);
  if (!session) {
    console.log("PATCH /api/posts/[id]: Unauthorized - No session found");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.error("PATCH /api/posts/[id]: Failed to parse request body", error);
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { content } = body;

  if (!content || typeof content !== "string" || !content.trim()) {
    console.log("PATCH /api/posts/[id]: Invalid content provided");
    return Response.json({ error: "Content is required" }, { status: 400 });
  }

  try {
    const updated = await sql`
      UPDATE posts 
      SET content = ${content.trim()}
      WHERE id = ${id}
      RETURNING *
    `;

    if (updated.length === 0) {
      console.log(`PATCH /api/posts/[id]: Post ${id} not found`);
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    console.log(`PATCH /api/posts/[id]: Successfully updated post ${id}`);
    return Response.json(updated[0]);
  } catch (error) {
    console.error(
      `PATCH /api/posts/[id]: Database error updating post ${id}`,
      error,
    );
    return Response.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  // Removed ownership check as per user request "anyone delete, edit any post"
  const result = await sql`DELETE FROM posts WHERE id = ${id} RETURNING id`;

  if (result.length === 0) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  return Response.json({ message: "Post deleted" });
}

import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";
import { sendPushToTokens } from "@/app/api/utils/push";

export async function GET(request, { params }) {
  const { id } = params;

  const rows = await sql`
    SELECT 
      comments.*,
      profiles.full_name as user_name,
      profiles.avatar_url as user_avatar,
      profiles.university as user_university
    FROM comments
    JOIN profiles ON comments.profile_id = profiles.id
    WHERE comments.post_id = ${id}
    ORDER BY comments.created_at ASC
  `;

  // Organize into threads if needed, but for now just return flat list with parent_id
  return Response.json(rows);
}

export async function POST(request, { params }) {
  // Use getSession so mobile Bearer tokens work too
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();
  const { content, audio_url, parent_id } = body;

  // Get profile id
  const profiles = await sql`
    SELECT id, full_name
    FROM profiles
    WHERE user_id = ${session.user.id}
  `;
  if (profiles.length === 0) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }
  const profileId = profiles[0].id;
  const commenterName = profiles[0].full_name || session.user.name || "Someone";

  const rows = await sql`
    INSERT INTO comments (post_id, profile_id, content, audio_url, parent_id)
    VALUES (${id}, ${profileId}, ${content}, ${audio_url}, ${parent_id})
    RETURNING *
  `;

  // Increment comment count on post
  await sql`
    UPDATE posts 
    SET comments_count = comments_count + 1 
    WHERE id = ${id}
  `;

  // Notify the post owner (best-effort; posting should still succeed if push fails)
  try {
    const ownerRows = await sql`
      SELECT profiles.user_id
      FROM posts
      JOIN profiles ON posts.profile_id = profiles.id
      WHERE posts.id = ${id}
      LIMIT 1
    `;

    const ownerUserId = ownerRows?.[0]?.user_id;
    if (ownerUserId && String(ownerUserId) !== String(session.user.id)) {
      const tokens = await sql`
        SELECT token, token_type
        FROM push_tokens
        WHERE user_id = ${ownerUserId}
      `;

      if (tokens.length > 0) {
        await sendPushToTokens({
          tokens,
          title: "New comment",
          body: `${commenterName} commented on your post`,
          data: { postId: String(id), type: "comment" },
        });
      }
    }
  } catch (error) {
    console.error("Comment push notification error:", error);
  }

  return Response.json(rows[0]);
}

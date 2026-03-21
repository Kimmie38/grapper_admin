import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";
import { sendPushToTokens } from "@/app/api/utils/push";

export async function POST(request, { params }) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: postId } = params;

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
  const likerName = profiles[0].full_name || session.user.name || "Someone";

  // Check if already liked
  const existing = await sql`
    SELECT id FROM post_likes 
    WHERE post_id = ${postId} AND profile_id = ${profileId}
  `;

  if (existing.length > 0) {
    // Unlike
    await sql`
      DELETE FROM post_likes 
      WHERE post_id = ${postId} AND profile_id = ${profileId}
    `;

    await sql`
      UPDATE posts 
      SET likes_count = GREATEST(0, likes_count - 1) 
      WHERE id = ${postId}
    `;

    return Response.json({ liked: false });
  } else {
    // Like
    await sql`
      INSERT INTO post_likes (post_id, profile_id)
      VALUES (${postId}, ${profileId})
    `;

    await sql`
      UPDATE posts 
      SET likes_count = likes_count + 1 
      WHERE id = ${postId}
    `;

    // Notify owner
    try {
      const ownerRows = await sql`
        SELECT profiles.user_id
        FROM posts
        JOIN profiles ON posts.profile_id = profiles.id
        WHERE posts.id = ${postId}
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
            title: "New like",
            body: `${likerName} liked your post`,
            data: { postId: String(postId), type: "like" },
          });
        }
      }
    } catch (error) {
      console.error("Like push notification error:", error);
    }

    return Response.json({ liked: true });
  }
}

export async function GET(request, { params }) {
  const session = await getSession(request);
  const { id: postId } = params;

  if (!session || !session.user) {
    return Response.json({ liked: false });
  }

  const profiles = await sql`
    SELECT id FROM profiles WHERE user_id = ${session.user.id}
  `;
  if (profiles.length === 0) return Response.json({ liked: false });

  const profileId = profiles[0].id;
  const existing = await sql`
    SELECT id FROM post_likes 
    WHERE post_id = ${postId} AND profile_id = ${profileId}
  `;

  return Response.json({ liked: existing.length > 0 });
}

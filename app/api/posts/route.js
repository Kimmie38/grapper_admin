import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  const session = await getSession(request);
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");

  let profileId = null;
  if (session?.user) {
    const profiles =
      await sql`SELECT id FROM profiles WHERE user_id = ${session.user.id}`;
    if (profiles.length > 0) profileId = profiles[0].id;
  }

  const query = tag
    ? sql`
      SELECT 
        posts.*,
        profiles.full_name as user_name,
        profiles.avatar_url as user_avatar,
        profiles.university as user_university,
        profiles.account_type as account_type,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comments_count,
        (SELECT COUNT(*) FROM services WHERE services.profile_id = posts.profile_id AND services.id IS NOT NULL) > 0 as has_services,
        EXISTS(SELECT 1 FROM post_likes WHERE post_id = posts.id AND profile_id = ${profileId}) as liked
      FROM posts
      JOIN profiles ON posts.profile_id = profiles.id
      JOIN post_hashtags ph ON posts.id = ph.post_id
      JOIN hashtags h ON ph.hashtag_id = h.id
      WHERE h.tag = ${tag}
      AND profiles.status NOT IN ('flagged', 'shadow_ban')
      ORDER BY posts.created_at DESC
    `
    : sql`
    SELECT 
      posts.*,
      profiles.full_name as user_name,
      profiles.avatar_url as user_avatar,
      profiles.university as user_university,
      profiles.account_type as account_type,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id) as likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comments_count,
      (SELECT COUNT(*) FROM services WHERE services.profile_id = posts.profile_id AND services.id IS NOT NULL) > 0 as has_services,
      EXISTS(SELECT 1 FROM post_likes WHERE post_id = posts.id AND profile_id = ${profileId}) as liked
    FROM posts
    JOIN profiles ON posts.profile_id = profiles.id
    WHERE profiles.status NOT IN ('flagged', 'shadow_ban')
    ORDER BY posts.created_at DESC
  `;

  const rows = await query;
  return Response.json(rows);
}

export async function POST(request) {
  const session = await getSession(request);

  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      content,
      image_url = null,
      audio_url = null,
      video_url = null,
    } = body;

    // Get profile id or create if not exists
    let profiles =
      await sql`SELECT id FROM profiles WHERE user_id = ${session.user.id}`;

    if (profiles.length === 0) {
      profiles = await sql`
        INSERT INTO profiles (user_id, full_name, avatar_url)
        VALUES (${session.user.id}, ${session.user.name || null}, ${session.user.image || null})
        RETURNING id
      `;
    }

    const profileId = profiles[0].id;

    const rows = await sql`
      INSERT INTO posts (profile_id, content, image_url, audio_url, video_url)
      VALUES (${profileId}, ${content}, ${image_url}, ${audio_url}, ${video_url})
      RETURNING *
    `;

    const post = rows[0];

    // Extract hashtags
    const hashtags = content.match(/#[\w]+/g);
    if (hashtags) {
      for (const tag of hashtags) {
        // Remove the # and convert to lowercase for consistency
        const cleanTag = tag.substring(1).toLowerCase();

        // Insert hashtag if it doesn't exist
        // Note: Postgres doesn't return ID on ON CONFLICT DO NOTHING, so we do a select after or upsert
        // Simple approach: Insert or Ignore, then Select
        await sql`
          INSERT INTO hashtags (tag) VALUES (${cleanTag})
          ON CONFLICT (tag) DO NOTHING
        `;

        const hashtagRows =
          await sql`SELECT id FROM hashtags WHERE tag = ${cleanTag}`;
        if (hashtagRows.length > 0) {
          const hashtagId = hashtagRows[0].id;
          await sql`
            INSERT INTO post_hashtags (post_id, hashtag_id)
            VALUES (${post.id}, ${hashtagId})
            ON CONFLICT DO NOTHING
          `;
        }
      }
    }

    return Response.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

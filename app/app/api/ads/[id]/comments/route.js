import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request, { params }) {
  const { id: adId } = params;

  const comments = await sql`
    SELECT 
      c.*,
      p.full_name as user_name,
      p.avatar_url as user_avatar,
      p.university as user_university
    FROM comments c
    LEFT JOIN profiles p ON c.profile_id = p.id
    WHERE c.ad_id = ${adId}
    ORDER BY c.created_at ASC
  `;

  return Response.json(comments);
}

export async function POST(request, { params }) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: adId } = params;
  const { content, audio_url, parent_id } = await request.json();

  if ((!content || !content.trim()) && !audio_url) {
    return Response.json({ error: "Content is required" }, { status: 400 });
  }

  const profiles = await sql`
    SELECT id FROM profiles WHERE user_id = ${session.user.id}
  `;
  if (profiles.length === 0) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }
  const profileId = profiles[0].id;

  const newComment = await sql`
    INSERT INTO comments (ad_id, profile_id, content, audio_url, parent_id)
    VALUES (${adId}, ${profileId}, ${content}, ${audio_url}, ${parent_id})
    RETURNING *
  `;

  await sql`
    UPDATE ads 
    SET comments_count = comments_count + 1 
    WHERE id = ${adId}
  `;

  return Response.json(newComment[0]);
}

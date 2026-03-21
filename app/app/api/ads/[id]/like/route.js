import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function POST(request, { params }) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: adId } = params;

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

  // Check if already liked
  const existing = await sql`
    SELECT id FROM ad_likes 
    WHERE ad_id = ${adId} AND profile_id = ${profileId}
  `;

  if (existing.length > 0) {
    // Unlike
    await sql`
      DELETE FROM ad_likes 
      WHERE ad_id = ${adId} AND profile_id = ${profileId}
    `;

    await sql`
      UPDATE ads 
      SET likes_count = GREATEST(0, likes_count - 1) 
      WHERE id = ${adId}
    `;

    return Response.json({ liked: false });
  } else {
    // Like
    await sql`
      INSERT INTO ad_likes (ad_id, profile_id)
      VALUES (${adId}, ${profileId})
    `;

    await sql`
      UPDATE ads 
      SET likes_count = likes_count + 1 
      WHERE id = ${adId}
    `;

    return Response.json({ liked: true });
  }
}

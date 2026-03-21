import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function PATCH(request, { params }) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { content } = body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return Response.json({ error: "Content is required" }, { status: 400 });
  }

  // Removed ownership check to align with post behavior "anyone delete, edit"
  const updated = await sql`
    UPDATE comments 
    SET content = ${content.trim()}
    WHERE id = ${id}
    RETURNING *
  `;

  if (updated.length === 0) {
    return Response.json({ error: "Comment not found" }, { status: 404 });
  }

  return Response.json(updated[0]);
}

export async function DELETE(request, { params }) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  // Get the post_id or ad_id before deleting to update the count
  const comment =
    await sql`SELECT post_id, ad_id FROM comments WHERE id = ${id}`;

  if (comment.length === 0) {
    return Response.json({ error: "Comment not found" }, { status: 404 });
  }

  const postId = comment[0].post_id;
  const adId = comment[0].ad_id;

  // Removed ownership check to align with post behavior
  const result = await sql`DELETE FROM comments WHERE id = ${id} RETURNING id`;

  if (result.length > 0) {
    if (postId) {
      // Decrement comment count on post
      await sql`
        UPDATE posts 
        SET comments_count = GREATEST(comments_count - 1, 0)
        WHERE id = ${postId}
      `;
    } else if (adId) {
      // Decrement comment count on ad
      await sql`
        UPDATE ads
        SET comments_count = GREATEST(comments_count - 1, 0)
        WHERE id = ${adId}
      `;
    }
  }

  return Response.json({ message: "Comment deleted" });
}

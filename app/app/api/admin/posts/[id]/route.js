import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";
import { requireAdmin } from "@/app/api/utils/requireAdmin";
import { logAdminAction } from "@/app/api/utils/adminLog";

export async function DELETE(request, { params }) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;

  const { id } = params;

  // Get admin profile id
  const adminProfileId = adminCheck.profile.id;

  try {
    await sql`DELETE FROM posts WHERE id = ${id}`;
    await logAdminAction(adminProfileId, "delete_post", "post", id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete post error:", error);
    return Response.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";
import { requireAdmin } from "@/app/api/utils/requireAdmin";
import { logAdminAction } from "@/app/api/utils/adminLog";

export async function GET(request, { params }) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;

  const { id } = params; // profile_id

  try {
    // 1. Profile Details
    const profile = await sql`
      SELECT p.*, u.email, u.name as auth_name, u.image as auth_image
      FROM profiles p
      JOIN auth_users u ON p.user_id = u.id
      WHERE p.id = ${id}
    `;

    if (profile.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Recent Posts
    const posts = await sql`
      SELECT * FROM posts 
      WHERE profile_id = ${id} 
      ORDER BY created_at DESC 
      LIMIT 20
    `;

    // 3. Recent Comments
    const comments = await sql`
      SELECT c.*, p.content as post_content
      FROM comments c
      LEFT JOIN posts p ON c.post_id = p.id
      WHERE c.profile_id = ${id}
      ORDER BY c.created_at DESC
      LIMIT 20
    `;

    // 4. Reports (against this user or their content)
    // Note: Reports on their posts + Reports on the user directly
    const reports = await sql`
      SELECT * FROM reports 
      WHERE (target_type = 'user' AND target_id = ${id})
         OR (target_type = 'post' AND target_id IN (SELECT id::text FROM posts WHERE profile_id = ${id}))
      ORDER BY created_at DESC
      LIMIT 20
    `;

    return Response.json({
      profile: profile[0],
      posts,
      comments,
      reports,
    });
  } catch (error) {
    console.error("Fetch user details error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;

  const { id } = params;
  const body = await request.json();
  const { action, ...data } = body;
  // action: 'ban', 'unban', 'reset_profile'

  const adminProfileId = adminCheck.profile.id;

  try {
    if (action === "ban") {
      await sql`UPDATE profiles SET status = 'banned' WHERE id = ${id}`;
      await logAdminAction(adminProfileId, "ban_user", "user", id, {
        reason: data.reason,
      });
      return Response.json({ success: true, status: "banned" });
    }

    if (action === "unban") {
      await sql`UPDATE profiles SET status = 'active' WHERE id = ${id}`;
      await logAdminAction(adminProfileId, "unban_user", "user", id);
      return Response.json({ success: true, status: "active" });
    }

    if (action === "reset_profile") {
      // Clear bio, avatar, etc.
      await sql`
        UPDATE profiles 
        SET bio = '', avatar_url = NULL, university = NULL, full_name = 'Reset User'
        WHERE id = ${id}
      `;
      await logAdminAction(adminProfileId, "reset_profile", "user", id);
      return Response.json({ success: true });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin user action error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

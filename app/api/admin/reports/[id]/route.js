import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/requireAdmin";
import { logAdminAction } from "@/app/api/utils/adminLog";

export async function PATCH(request, { params }) {
  const adminError = await requireAdmin();
  if (adminError) return adminError;

  const { id } = params;
  const session = await auth();

  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return Response.json({ error: "Status is required" }, { status: 400 });
    }

    // Get admin's profile id
    const adminProfiles = await sql`
      SELECT id FROM profiles WHERE user_id = ${session.user.id} LIMIT 1
    `;
    const admin_id = adminProfiles[0].id;

    const [updatedReport] = await sql`
      UPDATE reports
      SET 
        status = ${status},
        resolved_at = CASE WHEN ${status} IN ('resolved', 'dismissed') THEN now() ELSE resolved_at END,
        resolved_by = CASE WHEN ${status} IN ('resolved', 'dismissed') THEN ${admin_id} ELSE resolved_by END,
        claimed_at = CASE WHEN ${status} = 'claimed' THEN now() ELSE claimed_at END,
        claimed_by = CASE WHEN ${status} = 'claimed' THEN ${admin_id} ELSE claimed_by END
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updatedReport) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    // Log the action
    await logAdminAction(
      admin_id,
      `Updated report ${id} status to ${status}`,
      "report",
      id,
      { status },
    );

    return Response.json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    return Response.json({ error: "Failed to update report" }, { status: 500 });
  }
}

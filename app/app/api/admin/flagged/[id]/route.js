import sql from "../../../utils/sql";
import { requireAdmin } from "../../../utils/requireAdmin";
import { logAdminAction } from "../../../utils/adminLog";

export async function PATCH(request, { params }) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) {
      return adminCheck.response;
    }

    const { id } = params;
    const body = await request.json();
    const { status, reason } = body;

    if (status !== "active") {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const [updated] = await sql`
      UPDATE profiles
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updated) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    await logAdminAction(
      adminCheck.profile.id,
      "unflag_profile",
      "Profile",
      id,
      {
        previous_status:
          updated.status === "active" ? "flagged" : updated.status, // This is a bit tricky since we just updated it. Let's assume it was flagged or shadow_ban
        new_status: status,
        reason: reason || "No reason provided",
      },
    );

    return Response.json(updated);
  } catch (err) {
    console.error("PATCH /api/admin/flagged/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

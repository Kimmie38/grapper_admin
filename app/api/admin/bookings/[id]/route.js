import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/requireAdmin";

export async function PATCH(request, { params }) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) {
      return adminCheck.response;
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return Response.json({ error: "Status is required" }, { status: 400 });
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
      "rejected",
      "disputed",
    ];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const [updatedBooking] = await sql`
      UPDATE bookings
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updatedBooking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    return Response.json(updatedBooking);
  } catch (error) {
    console.error("PATCH /api/admin/bookings/[id] error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

export async function POST(request, { params }) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { reason } = await request.json();

    // Get booking details
    const bookings = await sql`
      SELECT * FROM bookings 
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;

    if (bookings.length === 0) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bookings[0];

    // Check if within cancellation window (5 minutes)
    const now = new Date();
    const cancellationDeadline = new Date(booking.cancellation_deadline);

    if (now > cancellationDeadline) {
      return Response.json(
        {
          error:
            "Cancellation window expired. You can no longer cancel this booking for free.",
          canCancel: false,
        },
        { status: 400 },
      );
    }

    // Check if deposit has been paid
    if (booking.deposit_paid) {
      return Response.json(
        {
          error:
            "Cannot cancel - deposit has already been paid. Please contact support.",
          canCancel: false,
        },
        { status: 400 },
      );
    }

    // Cancel the booking
    await sql`
      UPDATE bookings 
      SET 
        status = 'cancelled',
        cancelled_at = NOW(),
        cancellation_reason = ${reason || "User cancelled within 5-minute window"}
      WHERE id = ${id}
    `;

    return Response.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancellation error:", error);
    return Response.json(
      { error: error.message || "Failed to cancel booking" },
      { status: 500 },
    );
  }
}

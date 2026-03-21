import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

// Provider marks gig as complete
export async function POST(request, { params }) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    // Get booking and verify provider owns this service
    const bookings = await sql`
      SELECT b.*, s.profile_id, p.user_id as provider_user_id
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN profiles p ON s.profile_id = p.id
      WHERE b.id = ${id}
    `;

    if (bookings.length === 0) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bookings[0];

    // Verify this is the provider
    if (booking.provider_user_id !== session.user.id) {
      return Response.json(
        { error: "Unauthorized - not the provider" },
        { status: 403 },
      );
    }

    // Check if deposit was paid
    if (!booking.deposit_paid) {
      return Response.json(
        { error: "Cannot complete - deposit not paid yet" },
        { status: 400 },
      );
    }

    // Check if already completed
    if (booking.provider_completed_at) {
      return Response.json(
        { error: "Already marked as complete" },
        { status: 400 },
      );
    }

    // Mark as provider completed
    await sql`
      UPDATE bookings 
      SET 
        provider_completed_at = NOW(),
        status = 'awaiting_confirmation'
      WHERE id = ${id}
    `;

    return Response.json({
      success: true,
      message: "Gig marked as complete. Awaiting user confirmation.",
    });
  } catch (error) {
    console.error("Complete error:", error);
    return Response.json(
      { error: error.message || "Failed to mark as complete" },
      { status: 500 },
    );
  }
}

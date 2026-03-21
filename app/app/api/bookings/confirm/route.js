import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bookingId, rating, comment } = await request.json();

    if (!bookingId) {
      return Response.json(
        { error: "Booking ID is required" },
        { status: 400 },
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return Response.json(
        { error: "Valid rating (1-5) is required" },
        { status: 400 },
      );
    }

    // Get booking details
    const bookings = await sql`
      SELECT b.*, s.id as service_id, s.profile_id
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.id = ${bookingId} AND b.user_id = ${session.user.id}
    `;

    if (bookings.length === 0) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bookings[0];

    // Verify deposit was paid
    if (!booking.deposit_paid) {
      return Response.json(
        { error: "Cannot confirm - deposit not paid" },
        { status: 400 },
      );
    }

    // Verify provider marked as complete
    if (!booking.provider_completed_at) {
      return Response.json(
        { error: "Provider hasn't marked this as complete yet" },
        { status: 400 },
      );
    }

    // Check if already confirmed
    if (booking.user_confirmed_at) {
      return Response.json({ error: "Already confirmed" }, { status: 400 });
    }

    // Check if within gig timeline
    const now = new Date();
    const deadline = new Date(booking.booking_deadline);
    if (now > deadline) {
      return Response.json(
        { error: "Gig timeline has elapsed. Please contact support." },
        { status: 400 },
      );
    }

    // Start transaction - confirm booking and create review
    const [updatedBooking, review] = await sql.transaction([
      sql`
        UPDATE bookings 
        SET 
          user_confirmed_at = NOW(),
          status = 'awaiting_final_payment'
        WHERE id = ${bookingId}
        RETURNING *
      `,
      sql`
        INSERT INTO service_reviews (service_id, user_id, booking_id, rating, comment)
        VALUES (${booking.service_id}, ${session.user.id}, ${bookingId}, ${rating}, ${comment || ""})
        RETURNING *
      `,
    ]);

    // Update service rating
    const reviews = await sql`
      SELECT AVG(rating)::numeric(3,2) as avg_rating, COUNT(*) as count
      FROM service_reviews
      WHERE service_id = ${booking.service_id}
    `;

    await sql`
      UPDATE services
      SET rating = ${reviews[0].avg_rating}, reviews_count = ${reviews[0].count}
      WHERE id = ${booking.service_id}
    `;

    return Response.json({
      success: true,
      message: "Work confirmed! Please proceed with final payment.",
      booking: updatedBooking[0],
      review: review[0],
      requiresFinalPayment: true,
    });
  } catch (error) {
    console.error("Confirm error:", error);
    return Response.json(
      { error: error.message || "Failed to confirm booking" },
      { status: 500 },
    );
  }
}

import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

// Send corrections to provider
export async function POST(request, { params }) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { message } = await request.json();

    if (!message || message.trim() === "") {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Get booking details
    const bookings = await sql`
      SELECT * FROM bookings 
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;

    if (bookings.length === 0) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bookings[0];

    // Check if gig is still within timeline
    const now = new Date();
    const deadline = new Date(booking.booking_deadline);

    if (now > deadline) {
      return Response.json(
        {
          error: "Gig timeline has elapsed. No corrections allowed.",
          canCorrect: false,
        },
        { status: 400 },
      );
    }

    // Check if deposit was paid
    if (!booking.deposit_paid) {
      return Response.json(
        { error: "Cannot send corrections - deposit not paid yet" },
        { status: 400 },
      );
    }

    // Insert correction
    await sql`
      INSERT INTO booking_corrections (booking_id, user_id, message)
      VALUES (${id}, ${session.user.id}, ${message})
    `;

    return Response.json({
      success: true,
      message: "Correction sent to provider",
    });
  } catch (error) {
    console.error("Corrections error:", error);
    return Response.json(
      { error: error.message || "Failed to send correction" },
      { status: 500 },
    );
  }
}

// Get all corrections for a booking
export async function GET(request, { params }) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    // Verify user has access to this booking
    const bookings = await sql`
      SELECT b.*, s.profile_id, p.user_id as provider_user_id
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN profiles p ON s.profile_id = p.id
      WHERE b.id = ${id} 
      AND (b.user_id = ${session.user.id} OR p.user_id = ${session.user.id})
    `;

    if (bookings.length === 0) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    // Get all corrections
    const corrections = await sql`
      SELECT c.*, u.name as user_name, u.email as user_email
      FROM booking_corrections c
      JOIN auth_users u ON c.user_id = u.id
      WHERE c.booking_id = ${id}
      ORDER BY c.created_at DESC
    `;

    return Response.json({ corrections });
  } catch (error) {
    console.error("Get corrections error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch corrections" },
      { status: 500 },
    );
  }
}

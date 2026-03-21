import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request, { params }) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  // Check if booking exists and belongs to a service owned by the user
  const bookings = await sql`
    SELECT bookings.* 
    FROM bookings 
    JOIN services ON bookings.service_id = services.id
    JOIN profiles ON services.profile_id = profiles.id
    WHERE bookings.id = ${id} AND profiles.user_id = ${session.user.id}
  `;

  if (bookings.length === 0) {
    return Response.json(
      { error: "Booking not found or unauthorized" },
      { status: 404 },
    );
  }

  const booking = bookings[0];

  if (booking.commission_paid) {
    return Response.json({ error: "Commission already paid" }, { status: 400 });
  }

  // In a real app, we would process the payment here
  // For now, we just mark it as paid
  const updatedBookings = await sql`
    UPDATE bookings 
    SET commission_paid = true, updated_at = now() 
    WHERE id = ${id} 
    RETURNING *
  `;

  return Response.json(updatedBookings[0]);
}

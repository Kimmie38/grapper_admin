import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request, { params }) {
  const { id } = params;

  const reviews = await sql`
    SELECT 
      service_reviews.*,
      auth_users.name as user_name,
      auth_users.image as user_avatar
    FROM service_reviews
    JOIN auth_users ON service_reviews.user_id = auth_users.id
    WHERE service_reviews.service_id = ${id}
    ORDER BY service_reviews.created_at DESC
  `;

  return Response.json(reviews);
}

export async function POST(request, { params }) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();
  const { rating, comment, bookingId } = body;

  if (!rating || !comment || !bookingId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify that the booking belongs to the user and is for this service
  const bookings = await sql`
    SELECT id, status FROM bookings 
    WHERE id = ${bookingId} 
    AND user_id = ${session.user.id} 
    AND service_id = ${id}
  `;

  if (bookings.length === 0) {
    return Response.json({ error: "Invalid booking" }, { status: 403 });
  }

  /* // Optional: Check if booking is completed
  if (bookings[0].status !== 'completed') {
    return Response.json({ error: "Service must be completed before reviewing" }, { status: 400 });
  }
  */

  // Check if already reviewed
  const existingReviews = await sql`
    SELECT id FROM service_reviews WHERE booking_id = ${bookingId}
  `;

  if (existingReviews.length > 0) {
    return Response.json(
      { error: "You have already reviewed this service" },
      { status: 400 },
    );
  }

  // Create review
  const reviews = await sql`
    INSERT INTO service_reviews (service_id, user_id, booking_id, rating, comment)
    VALUES (${id}, ${session.user.id}, ${bookingId}, ${rating}, ${comment})
    RETURNING *
  `;

  // Update service average rating
  // We can do this asynchronously or simply re-calculate it
  // Let's just update the cached fields in the services table
  await sql`
    UPDATE services 
    SET 
      reviews_count = (SELECT COUNT(*) FROM service_reviews WHERE service_id = ${id}),
      rating = (SELECT COALESCE(AVG(rating), 0) FROM service_reviews WHERE service_id = ${id})
    WHERE id = ${id}
  `;

  return Response.json(reviews[0]);
}

import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    // Get booking with service and provider details
    const bookings = await sql`
      SELECT 
        b.*,
        s.title as service_title,
        s.image_url as service_image_url,
        s.description as service_description,
        p.full_name as provider_name,
        p.avatar_url as provider_avatar
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN profiles p ON s.profile_id = p.id
      WHERE b.id = ${id}
      AND (b.user_id = ${session.user.id} OR p.user_id = ${session.user.id})
    `;

    if (bookings.length === 0) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    return Response.json(bookings[0]);
  } catch (error) {
    console.error("Get booking details error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch booking details" },
      { status: 500 },
    );
  }
}

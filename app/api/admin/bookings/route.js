import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/requireAdmin";

export async function GET(request) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) {
      return adminCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search") || "";

    let bookings;

    if (search) {
      const searchPattern = `%${search}%`;
      bookings = await sql`
        SELECT 
          b.id,
          b.reference_code,
          b.status,
          b.total_price,
          b.currency,
          b.created_at,
          b.updated_at,
          s.title as service_title,
          s.id as service_id,
          u.name as buyer_name,
          u.email as buyer_email,
          u.id as buyer_id,
          bp.phone_number as buyer_phone,
          p.full_name as provider_name,
          p.id as provider_id,
          p.phone_number as provider_phone
        FROM bookings b
        LEFT JOIN services s ON b.service_id = s.id
        LEFT JOIN auth_users u ON b.user_id = u.id
        LEFT JOIN profiles bp ON u.id = bp.user_id
        LEFT JOIN profiles p ON s.profile_id = p.id
        WHERE 
          u.name ILIKE ${searchPattern} OR 
          u.email ILIKE ${searchPattern} OR 
          s.title ILIKE ${searchPattern} OR
          p.full_name ILIKE ${searchPattern} OR
          b.id::text ILIKE ${searchPattern} OR
          b.reference_code ILIKE ${searchPattern}
        ORDER BY b.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      bookings = await sql`
        SELECT 
          b.id,
          b.reference_code,
          b.status,
          b.total_price,
          b.currency,
          b.created_at,
          b.updated_at,
          s.title as service_title,
          s.id as service_id,
          u.name as buyer_name,
          u.email as buyer_email,
          u.id as buyer_id,
          bp.phone_number as buyer_phone,
          p.full_name as provider_name,
          p.id as provider_id,
          p.phone_number as provider_phone
        FROM bookings b
        LEFT JOIN services s ON b.service_id = s.id
        LEFT JOIN auth_users u ON b.user_id = u.id
        LEFT JOIN profiles bp ON u.id = bp.user_id
        LEFT JOIN profiles p ON s.profile_id = p.id
        ORDER BY b.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    return Response.json(bookings);
  } catch (error) {
    console.error("GET /api/admin/bookings error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

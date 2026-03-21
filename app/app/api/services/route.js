import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";
import { convertAndAdjustPrice } from "@/app/api/utils/pricing";

export async function GET(request) {
  const session = await getSession(request);
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const sortBy = searchParams.get("sortBy"); // 'price_asc', 'price_desc', 'rating', 'newest'
  const featured = searchParams.get("featured") === "true";
  const search = searchParams.get("search");

  // Build dynamic query string and values array
  let queryStr = `
    SELECT 
      services.*,
      profiles.full_name as user_name,
      profiles.avatar_url as user_avatar,
      profiles.verified as is_verified,
      profiles.phone_number as provider_phone,
      profiles.account_type as account_type,
      profiles.user_id as provider_user_id,
      EXISTS (
        SELECT 1 FROM subscriptions s 
        WHERE s.profile_id = profiles.id 
        AND s.status = 'active' 
        AND (s.end_date IS NULL OR s.end_date > NOW())
        AND s.plan_type IN ('pro', 'premium')
      ) as is_premium,
      (
        SELECT COUNT(*)::int
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        WHERE s.profile_id = services.profile_id
        AND b.status NOT IN ('completed', 'cancelled', 'rejected')
      ) as active_projects
    FROM services
    JOIN profiles ON services.profile_id = profiles.id
    WHERE profiles.status NOT IN ('flagged', 'shadow_ban')
  `;

  const values = [];
  let paramIndex = 1;

  if (featured) {
    queryStr += ` AND rating >= 4.5 AND reviews_count >= 5`;
  }

  if (category && category !== "All") {
    queryStr += ` AND category = $${paramIndex}`;
    values.push(category);
    paramIndex++;
  }

  if (search) {
    const searchPattern = "%" + search + "%";
    queryStr += ` AND (
      services.title ILIKE $${paramIndex} 
      OR services.description ILIKE $${paramIndex}
      OR services.category ILIKE $${paramIndex}
      OR profiles.full_name ILIKE $${paramIndex}
      OR services.tags::text ILIKE $${paramIndex}
    )`;
    values.push(searchPattern);
    paramIndex++;
  }

  if (minPrice) {
    queryStr += ` AND price >= $${paramIndex}`;
    values.push(minPrice);
    paramIndex++;
  }

  if (maxPrice) {
    queryStr += ` AND price <= $${paramIndex}`;
    values.push(maxPrice);
    paramIndex++;
  }

  if (minRating) {
    queryStr += ` AND rating >= $${paramIndex}`;
    values.push(minRating);
    paramIndex++;
  }

  // Sorting logic
  if (sortBy === "price_asc") {
    queryStr += ` ORDER BY price ASC`;
  } else if (sortBy === "price_desc") {
    queryStr += ` ORDER BY price DESC`;
  } else if (sortBy === "rating" || search) {
    // If searching, prioritize "best" providers (premium, verified, high rating, many reviews)
    queryStr += ` ORDER BY 
      (CASE WHEN EXISTS (
        SELECT 1 FROM subscriptions s 
        WHERE s.profile_id = profiles.id 
        AND s.status = 'active' 
        AND (s.end_date IS NULL OR s.end_date > NOW())
        AND s.plan_type IN ('pro', 'premium')
      ) THEN 1 ELSE 0 END) DESC,
      profiles.verified DESC,
      rating DESC, 
      reviews_count DESC,
      services.created_at DESC`;
  } else {
    // default to newest
    queryStr += ` ORDER BY services.created_at DESC`;
  }

  // Execute query using function form of sql
  const rows = await sql(queryStr, values);

  // Adjust prices based on viewer's country and convert currency
  if (session?.user) {
    const viewerProfiles =
      await sql`SELECT country FROM profiles WHERE user_id = ${session.user.id} LIMIT 1`;
    if (viewerProfiles.length > 0) {
      const viewerCountry = viewerProfiles[0].country;

      // Use Promise.all to handle async currency conversion for all rows
      await Promise.all(
        rows.map(async (service) => {
          const adjusted = await convertAndAdjustPrice(
            parseFloat(service.price),
            service.currency || "USD",
            viewerCountry,
          );
          service.price = adjusted.price;
          service.display_currency = adjusted.currency;
        }),
      );
    }
  }

  return Response.json(rows);
}

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, price, category, image_url, currency, tags } =
    body;

  // Get profile id
  const profiles =
    await sql`SELECT id, phone_number, account_type FROM profiles WHERE user_id = ${session.user.id}`;
  if (profiles.length === 0) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }
  const profile = profiles[0];

  // Enforce phone number requirement for service creation
  if (!profile.phone_number || profile.phone_number.trim() === "") {
    return Response.json(
      {
        error:
          "You must add a WhatsApp phone number to your profile before creating services.",
      },
      { status: 400 },
    );
  }

  const rows = await sql`
    INSERT INTO services (profile_id, title, description, price, category, image_url, currency, tags)
    VALUES (${profile.id}, ${title}, ${description}, ${price}, ${category}, ${image_url}, ${currency}, ${JSON.stringify(tags || [])})
    RETURNING *
  `;

  return Response.json(rows[0]);
}

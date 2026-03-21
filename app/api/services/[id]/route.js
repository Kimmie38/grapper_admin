import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";
import { convertAndAdjustPrice } from "@/app/api/utils/pricing";

export async function GET(request, { params }) {
  const { id } = params;
  const session = await getSession(request);

  const services = await sql`
    SELECT 
      services.*,
      profiles.full_name as user_name,
      profiles.avatar_url as user_avatar,
      profiles.university as user_university,
      profiles.phone_number as provider_phone,
      profiles.user_id as provider_user_id
    FROM services
    JOIN profiles ON services.profile_id = profiles.id
    WHERE services.id = ${id}
  `;

  if (services.length === 0) {
    return Response.json({ error: "Service not found" }, { status: 404 });
  }

  const service = services[0];

  // Adjust price based on viewer's country and convert currency
  if (session?.user) {
    const viewerProfiles =
      await sql`SELECT country FROM profiles WHERE user_id = ${session.user.id} LIMIT 1`;
    if (viewerProfiles.length > 0) {
      const viewerCountry = viewerProfiles[0].country;
      const adjusted = await convertAndAdjustPrice(
        parseFloat(service.price),
        service.currency || "USD",
        viewerCountry,
      );
      service.price = adjusted.price;
      service.display_currency = adjusted.currency;
    }
  }

  return Response.json(service);
}

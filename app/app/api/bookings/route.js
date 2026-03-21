import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";
import { convertAndAdjustPrice } from "@/app/api/utils/pricing";
import {
  getCurrencyForCountry,
  getExchangeRate,
} from "@/app/api/utils/currency";
import { generateBookingReference } from "@/app/api/utils/reference";

export async function GET(request) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'purchases' or 'sales'

  if (type === "sales") {
    // Get sales (bookings on my services)
    const sales = await sql`
      SELECT 
        bookings.*,
        services.title as service_title,
        services.price as service_price,
        profiles.full_name as client_name,
        profiles.avatar_url as client_avatar,
        profiles.country as client_country
      FROM bookings
      JOIN services ON bookings.service_id = services.id
      JOIN profiles ON bookings.user_id = profiles.user_id
      WHERE services.profile_id = (SELECT id FROM profiles WHERE user_id = ${session.user.id} LIMIT 1)
      ORDER BY bookings.created_at DESC
    `;

    // Get provider's country and currency
    const providerProfiles =
      await sql`SELECT country FROM profiles WHERE user_id = ${session.user.id} LIMIT 1`;
    const providerCountry = providerProfiles[0]?.country;
    const providerCurrency = getCurrencyForCountry(providerCountry);

    // Convert sales prices to provider's local currency
    await Promise.all(
      sales.map(async (sale) => {
        if (sale.currency !== providerCurrency) {
          const rate = await getExchangeRate(sale.currency, providerCurrency);
          sale.total_price_local = parseFloat(sale.total_price) * rate;
          sale.currency_local = providerCurrency;
        } else {
          sale.total_price_local = parseFloat(sale.total_price);
          sale.currency_local = providerCurrency;
        }
      }),
    );

    return Response.json(sales);
  }

  // Get bookings (purchases I made)
  const bookings = await sql`
    SELECT 
      bookings.*,
      services.title as service_title,
      services.price as service_price,
      services.currency as service_currency,
      services.image_url as service_image_url
    FROM bookings
    JOIN services ON bookings.service_id = services.id
    WHERE bookings.user_id = ${session.user.id}
    ORDER BY bookings.created_at DESC
  `;

  return Response.json(bookings);
}

export async function POST(request) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { serviceId, paymentMethodId } = body;

  if (!serviceId) {
    return Response.json({ error: "Service ID is required" }, { status: 400 });
  }

  // Check if service exists
  const services = await sql`SELECT * FROM services WHERE id = ${serviceId}`;
  if (services.length === 0) {
    return Response.json({ error: "Service not found" }, { status: 404 });
  }
  const service = services[0];

  // Get user's country for price adjustment
  const userProfiles =
    await sql`SELECT country FROM profiles WHERE user_id = ${session.user.id} LIMIT 1`;
  const userCountry = userProfiles.length > 0 ? userProfiles[0].country : null;

  // Calculate amounts with adjustment and currency conversion
  const basePrice = parseFloat(service.price);
  const baseCurrency = service.currency || "USD";

  const adjusted = await convertAndAdjustPrice(
    basePrice,
    baseCurrency,
    userCountry,
  );

  const totalPrice = adjusted.price;
  const currency = adjusted.currency;

  const depositAmount = totalPrice * 0.5;
  const platformFee = totalPrice * 0.13;
  const commissionAmount = totalPrice * 0.15; // 15% commission for provider

  // Verify payment method exists and belongs to user (optional mock check)
  if (paymentMethodId) {
    // In a real app, we would charge the card here
    // const method = await sql`SELECT * FROM payment_methods WHERE id = ${paymentMethodId} AND user_id = ${session.user.id}`;
    // if (method.length === 0) return Response.json({ error: "Invalid payment method" }, { status: 400 });
  }

  const referenceCode = generateBookingReference();

  // Create booking
  // Automatically mark as completed for demo purposes so they can review immediately
  // In a real app, this would be 'pending' then 'completed'
  const bookings = await sql`
    INSERT INTO bookings (
      service_id, 
      user_id, 
      status, 
      total_price, 
      deposit_amount, 
      platform_fee, 
      currency,
      commission_amount,
      commission_paid,
      reference_code
    )
    VALUES (
      ${serviceId}, 
      ${session.user.id}, 
      'completed',
      ${totalPrice},
      ${depositAmount},
      ${platformFee},
      ${currency},
      ${commissionAmount},
      false,
      ${referenceCode}
    )
    RETURNING *
  `;

  return Response.json(bookings[0]);
}

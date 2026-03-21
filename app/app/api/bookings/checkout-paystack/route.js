import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";
import { convertAndAdjustPrice } from "@/app/api/utils/pricing";
import { generateBookingReference } from "@/app/api/utils/reference";

// Calculate commission (15% for platform, deducted from 50% deposit only)
function calculatePayments(fullPrice) {
  const depositAmount = fullPrice * 0.5; // 50% deposit
  const platformFee = fullPrice * 0.15; // 15% of full price
  const providerDepositPayout = depositAmount - platformFee; // Provider gets 35% of full price
  const finalPayment = fullPrice * 0.5; // Remaining 50% (no fee)

  return {
    fullPrice,
    depositAmount, // What user pays first (50%)
    platformFee, // What platform keeps (15% of full price)
    providerDepositPayout, // What provider gets from deposit (35% of full price)
    finalPayment, // What user pays on completion (50%)
    totalProviderPayout: providerDepositPayout + finalPayment, // Total provider gets (85%)
  };
}

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { serviceId, email, redirectURL } = body;

    if (!serviceId) {
      return Response.json(
        { error: "Service ID is required" },
        { status: 400 },
      );
    }

    // Get service and provider info
    const services = await sql`
      SELECT s.*, p.paystack_subaccount_code, p.country as provider_country, p.full_name as provider_name
      FROM services s
      JOIN profiles p ON s.profile_id = p.id
      WHERE s.id = ${serviceId}
    `;

    if (services.length === 0) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }
    const service = services[0];

    // Ensure provider has a Paystack subaccount
    if (!service.paystack_subaccount_code) {
      return Response.json(
        {
          error:
            "This provider has not set up their bank account for payments yet.",
        },
        { status: 400 },
      );
    }

    // Get user's country for price adjustment
    const userProfiles =
      await sql`SELECT country FROM profiles WHERE user_id = ${session.user.id} LIMIT 1`;
    const userCountry =
      userProfiles.length > 0 ? userProfiles[0].country : null;

    // Calculate price
    const adjusted = await convertAndAdjustPrice(
      parseFloat(service.price),
      service.currency || "USD",
      userCountry,
    );

    const fullPrice = adjusted.price;
    const currency = adjusted.currency;

    // Calculate all payment amounts
    const payments = calculatePayments(fullPrice);

    // Calculate deadlines
    const now = new Date();
    const cancellationDeadline = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
    const gigDurationDays = service.estimated_duration_days || 7;
    const bookingDeadline = new Date(
      now.getTime() + gigDurationDays * 24 * 60 * 60 * 1000,
    );

    // Initialize Paystack transaction for 50% deposit
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email || session.user.email,
          amount: Math.round(payments.depositAmount * 100), // 50% deposit in kobo/cents
          currency: currency,
          callback_url: `${redirectURL}?service_id=${serviceId}`,
          metadata: {
            serviceId: serviceId.toString(),
            userId: session.user.id.toString(),
            serviceName: service.title,
            providerName: service.provider_name,
            paymentType: "deposit",
            cancel_action: redirectURL,
          },
          subaccount: service.paystack_subaccount_code,
          transaction_charge: Math.round(payments.platformFee * 100), // Platform fee in kobo/cents
          bearer: "account", // Provider bears the transaction fee
          channels: [
            "card",
            "bank",
            "ussd",
            "qr",
            "mobile_money",
            "bank_transfer",
          ],
        }),
      },
    );

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json();
      console.error("Paystack error:", errorData);
      return Response.json(
        { error: errorData.message || "Failed to initialize payment" },
        { status: 500 },
      );
    }

    const paystackData = await paystackResponse.json();

    const referenceCode = generateBookingReference();

    // Store the booking with enhanced fields
    await sql`
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
        stripe_session_id,
        reference_code,
        cancellation_deadline,
        booking_deadline,
        gig_duration_days,
        deposit_paid,
        final_payment_paid
      )
      VALUES (
        ${serviceId},
        ${session.user.id},
        'pending_deposit',
        ${fullPrice},
        ${payments.depositAmount},
        ${payments.platformFee},
        ${currency},
        ${payments.platformFee},
        false,
        ${paystackData.data.reference},
        ${referenceCode},
        ${cancellationDeadline},
        ${bookingDeadline},
        ${gigDurationDays},
        false,
        false
      )
    `;

    return Response.json({
      url: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
      processor: "paystack",
      cancellationDeadline: cancellationDeadline.toISOString(),
      bookingDeadline: bookingDeadline.toISOString(),
      paymentBreakdown: {
        depositAmount: payments.depositAmount,
        platformFee: payments.platformFee,
        finalPayment: payments.finalPayment,
        totalPrice: fullPrice,
        currency,
      },
    });
  } catch (error) {
    console.error("Paystack checkout error:", error);
    return Response.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 },
    );
  }
}

import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";
import { convertAndAdjustPrice } from "@/app/api/utils/pricing";
import {
  calculateCommission,
  getPaymentProcessor,
} from "@/app/api/utils/paymentProcessor";
import { generateBookingReference } from "@/app/api/utils/reference";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Calculate payment breakdown (15% fee from 50% deposit)
function calculatePayments(fullPrice) {
  const depositAmount = fullPrice * 0.5; // 50% deposit
  const platformFee = fullPrice * 0.15; // 15% of full price
  const providerDepositPayout = depositAmount - platformFee; // Provider gets 35% from deposit
  const finalPayment = fullPrice * 0.5; // Remaining 50% (no fee)

  return {
    fullPrice,
    depositAmount,
    platformFee,
    providerDepositPayout,
    finalPayment,
    totalProviderPayout: providerDepositPayout + finalPayment, // Total 85%
  };
}

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { serviceId, redirectURL, paymentMethod } = body;

    if (!serviceId) {
      return Response.json(
        { error: "Service ID is required" },
        { status: 400 },
      );
    }

    if (paymentMethod) {
      console.log("Selected payment method:", paymentMethod);
    }

    // Get user's country to determine payment processor
    const userProfiles =
      await sql`SELECT country FROM profiles WHERE user_id = ${session.user.id} LIMIT 1`;
    const userCountry =
      userProfiles.length > 0 ? userProfiles[0].country : null;

    // Route to appropriate payment processor
    const processor = getPaymentProcessor(userCountry);

    if (processor === "paystack") {
      // Forward to Paystack checkout (which already handles deposits)
      const origin = new URL(request.url).origin;

      const headers = {
        "Content-Type": "application/json",
      };

      const authHeader = request.headers.get("authorization");
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }

      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }

      const response = await fetch(`${origin}/api/bookings/checkout-paystack`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          serviceId,
          redirectURL,
          email: session.user.email,
        }),
      });

      const data = await response.json();
      return Response.json(data, { status: response.status });
    }

    // Continue with Stripe for non-African countries
    // Get service and provider info
    const services = await sql`
      SELECT s.*, p.stripe_account_id, p.country as provider_country
      FROM services s
      JOIN profiles p ON s.profile_id = p.id
      WHERE s.id = ${serviceId}
    `;

    if (services.length === 0) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }
    const service = services[0];

    // Ensure provider has a connected account
    if (!service.stripe_account_id) {
      return Response.json(
        {
          error:
            "This provider has not set up their bank account for payments yet.",
        },
        { status: 400 },
      );
    }

    // Calculate price
    const adjusted = await convertAndAdjustPrice(
      parseFloat(service.price),
      service.currency || "USD",
      userCountry,
    );

    const fullPrice = adjusted.price;
    const currency = adjusted.currency.toLowerCase();

    // Calculate all payment amounts
    const payments = calculatePayments(fullPrice);

    // Calculate platform fee for Stripe (15% of full price)
    const applicationFeeAmount = Math.round(payments.platformFee * 100);

    // Calculate deadlines
    const now = new Date();
    const cancellationDeadline = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    const gigDurationDays = service.estimated_duration_days || 7;
    const bookingDeadline = new Date(
      now.getTime() + gigDurationDays * 24 * 60 * 60 * 1000,
    );

    const referenceCode = generateBookingReference();

    const sessionOptions = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `${service.title} - 50% Deposit`,
              description: `Initial deposit for ${service.title}. Remaining 50% due upon completion.`,
            },
            unit_amount: Math.round(payments.depositAmount * 100), // 50% deposit
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${redirectURL}?session_id={CHECKOUT_SESSION_ID}&service_id=${serviceId}`,
      cancel_url: redirectURL,
      metadata: {
        serviceId: serviceId.toString(),
        userId: session.user.id.toString(),
        paymentType: "deposit",
        referenceCode,
      },
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: service.stripe_account_id,
        },
      },
    };

    const checkoutSession =
      await stripe.checkout.sessions.create(sessionOptions);

    // Create booking with enhanced fields
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
        ${currency.toUpperCase()},
        ${payments.platformFee},
        false,
        ${checkoutSession.id},
        ${referenceCode},
        ${cancellationDeadline},
        ${bookingDeadline},
        ${gigDurationDays},
        false,
        false
      )
    `;

    return Response.json({
      url: checkoutSession.url,
      processor: "stripe",
      cancellationDeadline: cancellationDeadline.toISOString(),
      bookingDeadline: bookingDeadline.toISOString(),
      paymentBreakdown: {
        depositAmount: payments.depositAmount,
        platformFee: payments.platformFee,
        finalPayment: payments.finalPayment,
        totalPrice: fullPrice,
        currency: currency.toUpperCase(),
      },
    });
  } catch (error) {
    console.error("Stripe/Checkout error:", error);
    return Response.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 },
    );
  }
}

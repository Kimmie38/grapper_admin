import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request, { params }) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { redirectURL, provider } = await request.json();

    // Get booking details
    const bookings = await sql`
      SELECT b.*, s.title as service_title, 
             p.paystack_subaccount_code, p.stripe_account_id
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN profiles p ON s.profile_id = p.id
      WHERE b.id = ${id} AND b.user_id = ${session.user.id}
    `;

    if (bookings.length === 0) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bookings[0];

    // Verify deposit was paid
    if (!booking.deposit_paid) {
      return Response.json({ error: "Deposit not paid yet" }, { status: 400 });
    }

    // Verify user confirmed the work
    if (!booking.user_confirmed_at) {
      return Response.json(
        { error: "Please confirm the work first" },
        { status: 400 },
      );
    }

    // Check if final payment already made
    if (booking.final_payment_paid) {
      return Response.json(
        { error: "Final payment already made" },
        { status: 400 },
      );
    }

    // Calculate final payment (remaining 50%, no platform fee)
    const finalPaymentAmount = booking.total_price * 0.5;

    if (provider === "paystack") {
      // Paystack final payment
      const paystackResponse = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email,
            amount: Math.round(finalPaymentAmount * 100),
            currency: booking.currency,
            callback_url: `${redirectURL}?booking_id=${id}&payment_type=final`,
            metadata: {
              bookingId: id.toString(),
              userId: session.user.id.toString(),
              paymentType: "final",
            },
            subaccount: booking.paystack_subaccount_code,
            transaction_charge: 0, // No platform fee on final payment
            bearer: "account",
          }),
        },
      );

      const paystackData = await paystackResponse.json();

      if (!paystackData.status) {
        throw new Error(
          paystackData.message || "Failed to initialize final payment",
        );
      }

      // Update booking with final payment reference
      await sql`
        UPDATE bookings 
        SET final_payment_amount = ${finalPaymentAmount}
        WHERE id = ${id}
      `;

      return Response.json({
        url: paystackData.data.authorization_url,
        reference: paystackData.data.reference,
        processor: "paystack",
      });
    } else {
      // Stripe final payment
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: booking.currency.toLowerCase(),
              product_data: {
                name: `${booking.service_title} - Final Payment`,
                description: "Remaining 50% payment upon completion",
              },
              unit_amount: Math.round(finalPaymentAmount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${redirectURL}?session_id={CHECKOUT_SESSION_ID}&booking_id=${id}&payment_type=final`,
        cancel_url: redirectURL,
        customer_email: session.user.email,
        metadata: {
          bookingId: id.toString(),
          userId: session.user.id.toString(),
          paymentType: "final",
        },
      });

      // Update booking with final payment session
      await sql`
        UPDATE bookings 
        SET final_payment_amount = ${finalPaymentAmount}
        WHERE id = ${id}
      `;

      return Response.json({
        url: stripeSession.url,
        id: stripeSession.id,
        processor: "stripe",
      });
    }
  } catch (error) {
    console.error("Final payment error:", error);
    return Response.json(
      { error: error.message || "Failed to process final payment" },
      { status: 500 },
    );
  }
}

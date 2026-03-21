import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const APP_URL = process.env.APP_URL || "http://localhost:4000"; // Fallback for callbacks

// Pricing configuration
const PRICING = {
  pro: { usd: 1000, eur: 1000, ngn: 500000 }, // in cents/kobo
  premium: { usd: 2000, eur: 2000, ngn: 2000000 },
  verified_yearly: { usd: 10000, eur: 10000, ngn: 15000000 },
};

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      plan,
      currency = "USD",
      provider: requestedProvider,
    } = await request.json();

    if (plan === "basic") {
      // Free plan - just update immediately
      await updateSubscription(session.user.id, plan);
      return Response.json({ success: true, method: "immediate" });
    }

    // Determine provider logic
    // If user explicitly requested a provider, try to use it
    let provider = requestedProvider;
    let selectedCurrency = currency;

    if (!provider) {
      // Fallback to currency based logic
      provider = selectedCurrency === "NGN" ? "paystack" : "stripe";
    }

    // Ensure currency matches provider if possible
    if (provider === "paystack" && selectedCurrency !== "NGN") {
      // Paystack supports USD, but let's default to NGN if they chose paystack without specifying currency,
      // or just pass USD if they selected USD.
      // For simplicity in this logic, we trust the currency passed, but Paystack needs NGN usually for local cards.
      // Let's allow USD on Paystack if the account supports it.
    }

    const price = PRICING[plan]?.[selectedCurrency.toLowerCase()];
    if (!price) {
      return Response.json(
        { error: "Invalid plan or currency" },
        { status: 400 },
      );
    }

    const isPaystack = provider === "paystack";

    if (isPaystack) {
      // Initialize Paystack
      const response = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email,
            amount: price,
            currency: selectedCurrency,
            // Use a specific verify endpoint that can handle the redirect
            callback_url: `${APP_URL}/api/subscriptions/verify?provider=paystack`,
            metadata: {
              userId: session.user.id,
              plan,
              custom_fields: [
                {
                  display_name: "Plan",
                  variable_name: "plan",
                  value: plan,
                },
              ],
            },
          }),
        },
      );

      const data = await response.json();
      if (!data.status) {
        throw new Error(data.message || "Paystack initialization failed");
      }

      return Response.json({
        url: data.data.authorization_url,
        reference: data.data.reference,
        provider: "paystack",
      });
    } else {
      // Initialize Stripe Checkout
      const stripe = new Stripe(STRIPE_SECRET_KEY);

      const sessionStripe = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: selectedCurrency.toLowerCase(),
              product_data: {
                name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
                description: `Subscription to ${plan} features`,
              },
              unit_amount: price,
              recurring:
                plan === "verified_yearly"
                  ? { interval: "year" }
                  : { interval: "month" },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        // Append provider and platform to success_url
        success_url: `${APP_URL}/api/subscriptions/verify?session_id={CHECKOUT_SESSION_ID}&provider=stripe`,
        cancel_url: `${APP_URL}/cancel`,
        customer_email: session.user.email,
        metadata: {
          userId: session.user.id,
          plan,
        },
      });

      return Response.json({
        url: sessionStripe.url,
        id: sessionStripe.id,
        provider: "stripe",
      });
    }
  } catch (error) {
    console.error("Subscription error:", error);
    return Response.json(
      { error: error.message || "Failed to initiate subscription" },
      { status: 500 },
    );
  }
}

// Helper to update subscription directly (reused from original code)
async function updateSubscription(userId, plan) {
  const profiles = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (profiles.length === 0) throw new Error("Profile not found");
  const profileId = profiles[0].id;

  await sql`
    UPDATE subscriptions SET status = 'cancelled' 
    WHERE profile_id = ${profileId} AND status = 'active'
  `;

  const endDate = new Date();
  if (plan === "verified_yearly") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  await sql`
    INSERT INTO subscriptions (profile_id, plan_type, status, start_date, end_date)
    VALUES (${profileId}, ${plan}, 'active', NOW(), ${endDate})
  `;

  if (["premium", "verified_yearly", "pro"].includes(plan)) {
    await sql`UPDATE profiles SET verified = true WHERE id = ${profileId}`;
  }
}

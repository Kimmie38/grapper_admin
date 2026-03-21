import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { reference, sessionId, provider } = await request.json();

    let plan = null;
    let verified = false;

    if (provider === "paystack") {
      // Verify Paystack
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          },
        },
      );
      const data = await response.json();

      if (!data.status || data.data.status !== "success") {
        return Response.json(
          { error: "Payment not successful" },
          { status: 400 },
        );
      }

      // Extract plan from metadata
      plan = data.data.metadata?.plan;
      verified = true;
    } else if (provider === "stripe") {
      // Verify Stripe
      const stripe = new Stripe(STRIPE_SECRET_KEY);

      const sessionStripe = await stripe.checkout.sessions.retrieve(sessionId);

      if (sessionStripe.payment_status !== "paid") {
        return Response.json({ error: "Payment not paid" }, { status: 400 });
      }

      plan = sessionStripe.metadata?.plan;
      verified = true;
    }

    if (verified && plan) {
      await updateSubscription(session.user.id, plan);
      return Response.json({ success: true, plan });
    }

    return Response.json({ error: "Verification failed" }, { status: 400 });
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json(
      { error: error.message || "Failed to verify subscription" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference") || searchParams.get("trxref"); // Paystack sends trxref or reference
  const sessionId = searchParams.get("session_id");
  const provider = searchParams.get("provider");

  // If we have neither, show error
  if (!reference && !sessionId) {
    return new Response("Missing verification details", { status: 400 });
  }

  try {
    // Re-use the verification logic (we can refactor this into a shared function later, but for now calling the internal logic is tricky, so we'll duplicate or mock)
    // Actually, best to just implement the verification here directly since we can't easily call the POST handler function.

    let plan = null;
    let verified = false;
    let userId = null;

    if (provider === "paystack" && reference) {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        },
      );
      const data = await response.json();

      if (data.status && data.data.status === "success") {
        plan = data.data.metadata?.plan;
        userId = data.data.metadata?.userId; // We need userId from metadata since GET request might not have session cookie from mobile browser context
        verified = true;
      }
    } else if (provider === "stripe" && sessionId) {
      const stripe = new Stripe(STRIPE_SECRET_KEY);
      const sessionStripe = await stripe.checkout.sessions.retrieve(sessionId);

      if (sessionStripe.payment_status === "paid") {
        plan = sessionStripe.metadata?.plan;
        userId = sessionStripe.metadata?.userId;
        verified = true;
      }
    }

    if (verified && plan && userId) {
      await updateSubscription(userId, plan);

      // Return HTML that closes the window or redirects
      const html = `
         <!DOCTYPE html>
         <html>
         <head>
           <title>Payment Successful</title>
           <meta name="viewport" content="width=device-width, initial-scale=1">
           <style>
             body { font-family: system-ui, -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f0fdfa; color: #0f4241; }
             .card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; }
             h1 { margin-bottom: 0.5rem; }
             p { color: #4b5563; }
           </style>
         </head>
         <body>
           <div class="card">
             <h1>Payment Successful!</h1>
             <p>You can now return to the app.</p>
           </div>
           <script>
             // Attempt to close window or redirect to app scheme if known
             setTimeout(() => {
                // If we knew the scheme, we could window.location = "scheme://..."
                // For now, rely on user or WebBrowser closing.
             }, 1000);
           </script>
         </body>
         </html>
       `;
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    }

    return new Response("Payment verification failed", { status: 400 });
  } catch (error) {
    console.error(error);
    return new Response("Server error", { status: 500 });
  }
}

async function updateSubscription(userId, plan) {
  const profiles = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (profiles.length === 0) throw new Error("Profile not found");
  const profileId = profiles[0].id;

  // Cancel previous active
  await sql`
    UPDATE subscriptions SET status = 'cancelled' 
    WHERE profile_id = ${profileId} AND status = 'active'
  `;

  // Calculate end date
  const endDate = new Date();
  if (plan === "verified_yearly") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  // Insert new subscription
  await sql`
    INSERT INTO subscriptions (profile_id, plan_type, status, start_date, end_date)
    VALUES (${profileId}, ${plan}, 'active', NOW(), ${endDate})
  `;

  // Update profile verification status if needed
  if (["premium", "verified_yearly", "pro"].includes(plan)) {
    await sql`UPDATE profiles SET verified = true WHERE id = ${profileId}`;
  }
}

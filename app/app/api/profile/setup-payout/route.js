import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

const PAYSTACK_COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Egypt",
];

function getPaymentProcessor(country) {
  if (!country) {
    return "stripe";
  }
  return PAYSTACK_COUNTRIES.includes(country) ? "paystack" : "stripe";
}

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    processor, // 'stripe' or 'paystack'
    // Paystack fields
    bankCode,
    accountNumber,
    accountName,
    // Stripe fields
    stripeAccountId,
  } = body;

  // Get user's profile
  const profiles =
    await sql`SELECT * FROM profiles WHERE user_id = ${session.user.id}`;
  if (profiles.length === 0) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }
  const profile = profiles[0];

  try {
    if (processor === "paystack") {
      // Create Paystack subaccount
      const subaccountResponse = await fetch(
        "https://api.paystack.co/subaccount",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            business_name: profile.full_name || "Service Provider",
            settlement_bank: bankCode,
            account_number: accountNumber,
            percentage_charge: 15, // 15% commission for platform
            description: `Subaccount for ${profile.full_name}`,
          }),
        },
      );

      if (!subaccountResponse.ok) {
        const errorData = await subaccountResponse.json();
        return Response.json(
          { error: errorData.message || "Failed to create subaccount" },
          { status: 400 },
        );
      }

      const subaccountData = await subaccountResponse.json();

      // Update profile with Paystack details
      await sql`
        UPDATE profiles
        SET 
          paystack_subaccount_code = ${subaccountData.data.subaccount_code},
          bank_account_name = ${accountName},
          bank_account_number = ${accountNumber},
          bank_code = ${bankCode}
        WHERE user_id = ${session.user.id}
      `;

      return Response.json({
        success: true,
        processor: "paystack",
        subaccountCode: subaccountData.data.subaccount_code,
      });
    } else if (processor === "stripe") {
      // For Stripe, store the connected account ID
      // (In production, you'd use Stripe Connect OAuth flow)
      await sql`
        UPDATE profiles
        SET stripe_account_id = ${stripeAccountId}
        WHERE user_id = ${session.user.id}
      `;

      return Response.json({
        success: true,
        processor: "stripe",
        accountId: stripeAccountId,
      });
    } else {
      return Response.json(
        { error: "Invalid payment processor" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Payout setup error:", error);
    return Response.json(
      { error: "Failed to setup payout account" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profiles =
    await sql`SELECT country, paystack_subaccount_code, stripe_account_id, bank_account_name, bank_account_number, bank_code FROM profiles WHERE user_id = ${session.user.id}`;

  if (profiles.length === 0) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  const profile = profiles[0];
  const recommendedProcessor = getPaymentProcessor(profile.country);

  return Response.json({
    recommendedProcessor,
    paystack: {
      configured: !!profile.paystack_subaccount_code,
      accountName: profile.bank_account_name,
      accountNumber: profile.bank_account_number,
      bankCode: profile.bank_code,
    },
    stripe: {
      configured: !!profile.stripe_account_id,
    },
  });
}

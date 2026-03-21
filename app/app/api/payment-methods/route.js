import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const methods = await sql`
    SELECT * FROM payment_methods 
    WHERE user_id = ${session.user.id}
    ORDER BY is_default DESC, created_at DESC
  `;

  return Response.json(methods);
}

export async function POST(request) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { cardNumber, expiry, cvc, saveCard } = body;

  // In a real app, we would:
  // 1. Send these details to Stripe/Payment Provider to get a token/paymentMethodId
  // 2. Not store sensitive data like full number or cvc
  // 3. Only store the token and the last 4 digits/brand for display

  // Mock implementation:
  const last4 = cardNumber.slice(-4);
  const brand = getCardBrand(cardNumber);

  // Parse expiry (MM/YY)
  const [expMonth, expYear] = expiry.split("/").map((p) => parseInt(p.trim()));
  const fullYear = 2000 + (expYear || 0);

  if (saveCard) {
    // If saving as default, unset other defaults
    await sql`
      UPDATE payment_methods 
      SET is_default = FALSE 
      WHERE user_id = ${session.user.id}
    `;

    const newMethod = await sql`
      INSERT INTO payment_methods (user_id, last4, brand, exp_month, exp_year, is_default, provider)
      VALUES (${session.user.id}, ${last4}, ${brand}, ${expMonth}, ${fullYear}, TRUE, ${body.provider || "stripe"})
      RETURNING *
    `;
    return Response.json(newMethod[0]);
  }

  // If not saving, just return a mock "ephemeral" payment method object
  return Response.json({
    id: "temp_" + Date.now(),
    last4,
    brand,
    exp_month: expMonth,
    exp_year: fullYear,
    is_ephemeral: true,
    provider: body.provider || "stripe",
  });
}

export async function DELETE(request) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Method ID required" }, { status: 400 });
  }

  await sql`
    DELETE FROM payment_methods 
    WHERE id = ${id} AND user_id = ${session.user.id}
  `;

  return Response.json({ success: true });
}

function getCardBrand(number) {
  if (number.startsWith("4")) return "Visa";
  if (number.startsWith("5")) return "Mastercard";
  if (number.startsWith("3")) return "Amex";
  return "Card";
}

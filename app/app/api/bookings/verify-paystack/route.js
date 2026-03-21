import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { reference } = body;

  if (!reference) {
    return Response.json({ error: "Reference is required" }, { status: 400 });
  }

  try {
    // Verify transaction with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    if (!verifyResponse.ok) {
      return Response.json(
        { error: "Failed to verify payment" },
        { status: 400 },
      );
    }

    const verifyData = await verifyResponse.json();

    if (verifyData.data.status !== "success") {
      return Response.json(
        { error: "Payment was not successful" },
        { status: 400 },
      );
    }

    // Update booking status
    const bookings = await sql`
      UPDATE bookings
      SET status = 'completed', commission_paid = true
      WHERE stripe_session_id = ${reference}
      AND user_id = ${session.user.id}
      RETURNING *
    `;

    if (bookings.length === 0) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      booking: bookings[0],
      paymentDetails: verifyData.data,
    });
  } catch (error) {
    console.error("Paystack verification error:", error);
    return Response.json(
      { error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}

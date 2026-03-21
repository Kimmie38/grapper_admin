/**
 * Get list of supported banks for Paystack
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || "nigeria";

  try {
    const response = await fetch(
      `https://api.paystack.co/bank?country=${country}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    if (!response.ok) {
      return Response.json({ error: "Failed to fetch banks" }, { status: 500 });
    }

    const data = await response.json();
    return Response.json(data.data);
  } catch (error) {
    console.error("Banks fetch error:", error);
    return Response.json({ error: "Failed to fetch banks" }, { status: 500 });
  }
}

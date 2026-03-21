/**
 * Verify bank account details with Paystack
 */
export async function POST(request) {
  const body = await request.json();
  const { accountNumber, bankCode } = body;

  if (!accountNumber || !bankCode) {
    return Response.json(
      { error: "Account number and bank code are required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    if (!response.ok) {
      return Response.json(
        { error: "Failed to verify account" },
        { status: 400 },
      );
    }

    const data = await response.json();
    return Response.json({
      accountName: data.data.account_name,
      accountNumber: data.data.account_number,
    });
  } catch (error) {
    console.error("Account verification error:", error);
    return Response.json(
      { error: "Failed to verify account" },
      { status: 500 },
    );
  }
}

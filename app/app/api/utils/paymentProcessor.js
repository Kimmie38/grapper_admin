/**
 * Determines which payment processor to use based on user's country
 * Paystack: African countries (especially Nigeria)
 * Stripe: Rest of the world
 */

const PAYSTACK_COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Egypt",
];

export function getPaymentProcessor(country) {
  if (!country) {
    return "stripe"; // Default to Stripe if country unknown
  }

  return PAYSTACK_COUNTRIES.includes(country) ? "paystack" : "stripe";
}

export function getProcessorForCurrency(currency) {
  const paystackCurrencies = ["NGN", "GHS", "KES", "ZAR"];
  return paystackCurrencies.includes(currency) ? "paystack" : "stripe";
}

/**
 * Platform commission rate (15%)
 */
export const PLATFORM_COMMISSION_RATE = 0.15;

/**
 * Calculate platform fee and provider payout
 */
export function calculateCommission(amount) {
  const platformFee = amount * PLATFORM_COMMISSION_RATE;
  const providerPayout = amount - platformFee;

  return {
    totalAmount: amount,
    platformFee,
    providerPayout,
    commissionRate: PLATFORM_COMMISSION_RATE,
  };
}

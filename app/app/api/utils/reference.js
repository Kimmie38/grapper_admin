/**
 * Generates a unique reference code for bookings.
 * Format: BKG-XXXX-XXXX
 */
export function generateBookingReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I, O, 1, 0 to avoid confusion
  let result = "BKG-";
  for (let i = 0; i < 8; i++) {
    if (i === 4) result += "-";
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

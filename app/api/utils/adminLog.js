import sql from "@/app/api/utils/sql";

export async function logAdminAction(
  adminId,
  action,
  targetType,
  targetId,
  details = {},
) {
  try {
    await sql`
      INSERT INTO admin_audit_logs (admin_id, action, target_type, target_id, details)
      VALUES (${adminId}, ${action}, ${targetType}, ${targetId}, ${details})
    `;
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}

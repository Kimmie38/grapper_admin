import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";
import { sendPushToTokens } from "@/app/api/utils/push";

// Helper to simulate sending email to admins
async function notifyAdminsOfFlaggedUser(profileId, reportCount) {
  try {
    const admins = await sql`
      SELECT email FROM auth_users 
      JOIN profiles ON auth_users.id = profiles.user_id 
      WHERE profiles.account_type = 'admin'
    `;

    const profile =
      await sql`SELECT full_name FROM profiles WHERE id = ${profileId}`;
    const name = profile[0]?.full_name || "A user";

    console.log(
      `[EMAIL NOTIFICATION] To Admins: ${admins.map((a) => a.email).join(", ")}`,
    );
    console.log(`Subject: User Flagged - ${name}`);
    console.log(
      `Body: User ${name} (ID: ${profileId}) has been automatically flagged after reaching ${reportCount} reports.`,
    );

    // In a real app, you would use a service like SendGrid or AWS SES here:
    /*
    await sendEmail({
      to: admins.map(a => a.email),
      subject: `User Flagged - ${name}`,
      text: `User ${name} (ID: ${profileId}) has been automatically flagged after reaching ${reportCount} reports.`
    });
    */
  } catch (error) {
    console.error("Failed to notify admins:", error);
  }
}

async function sendWarningToUser(profileId) {
  try {
    const profile = await sql`
      SELECT p.full_name, u.id as user_id 
      FROM profiles p 
      JOIN auth_users u ON p.user_id = u.id 
      WHERE p.id = ${profileId}
    `;

    if (profile.length === 0) return;

    const { full_name, user_id } = profile[0];

    // Get push tokens
    const tokens = await sql`
      SELECT token, token_type FROM push_tokens WHERE user_id = ${user_id}
    `;

    console.log(
      `[WARNING NOTIFICATION] To User ${full_name} (ID: ${profileId})`,
    );
    console.log(`Subject: Community Standards Warning`);
    console.log(
      `Body: Hello ${full_name}, we've received a report regarding your account or content. Please review our community guidelines to ensure a positive experience for everyone.`,
    );

    if (tokens.length > 0) {
      await sendPushToTokens({
        tokens,
        title: "Community Standards Warning",
        body: "We've received a report regarding your account. Please review our guidelines.",
        data: { type: "warning" },
      });
    }

    // Log the warning
    await sql`
      INSERT INTO admin_audit_logs (action, target_type, target_id, details)
      VALUES (
        'automatic_warning', 
        'Profile', 
        ${profileId}, 
        ${JSON.stringify({
          reason: "First report received",
          timestamp: new Date().toISOString(),
        })}
      )
    `;
  } catch (error) {
    console.error("Failed to send warning to user:", error);
  }
}

export async function POST(request) {
  const session = await auth();
  // Remove strict auth check to allow anonymous reporting
  // if (!session || !session.user) {
  //   return Response.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const body = await request.json();
    const { target_type, target_id, reason } = body;

    if (!target_type || !target_id || !reason) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get reporter's profile id if authenticated
    let reporter_id = null;
    if (session?.user?.id) {
      const profiles = await sql`
        SELECT id FROM profiles WHERE user_id = ${session.user.id} LIMIT 1
      `;

      if (profiles.length > 0) {
        reporter_id = profiles[0].id;
      }
    }

    // Identify the profile associated with the report target
    let target_profile_id = null;

    // Helper to safely parse ID for numeric IDs
    const safeId = parseInt(target_id);
    const isValidId = !isNaN(safeId);

    if (target_type === "User") {
      target_profile_id = target_id;
    } else if (isValidId) {
      if (target_type === "Post") {
        const postRows =
          await sql`SELECT profile_id FROM posts WHERE id = ${safeId}`;
        if (postRows.length > 0) target_profile_id = postRows[0].profile_id;
      } else if (target_type === "Service") {
        const serviceRows =
          await sql`SELECT profile_id FROM services WHERE id = ${safeId}`;
        if (serviceRows.length > 0)
          target_profile_id = serviceRows[0].profile_id;
      } else if (target_type === "Comment") {
        const commentRows =
          await sql`SELECT profile_id FROM comments WHERE id = ${safeId}`;
        if (commentRows.length > 0)
          target_profile_id = commentRows[0].profile_id;
      }
    }

    const [report] = await sql`
      INSERT INTO reports (reporter_id, target_type, target_id, reason, target_profile_id)
      VALUES (${reporter_id}, ${target_type}, ${target_id}, ${reason}, ${target_profile_id})
      RETURNING *
    `;

    // Strike System: Check if target needs to be flagged or shadow banned
    // Thresholds
    const WARNING_THRESHOLD = 1;
    const SHADOW_BAN_THRESHOLD = 2;
    const FLAG_THRESHOLD = 3;

    if (target_profile_id) {
      // Count all reports for this profile (including their posts, services, etc.)
      const reportCountResult = await sql`
        SELECT COUNT(*)::int as count 
        FROM reports 
        WHERE 
          (target_type = 'User' AND target_id = ${target_profile_id})
          OR (target_type = 'Post' AND target_id IN (SELECT id::text FROM posts WHERE profile_id = ${target_profile_id}))
          OR (target_type = 'Service' AND target_id IN (SELECT id::text FROM services WHERE profile_id = ${target_profile_id}))
          OR (target_type = 'Comment' AND target_id IN (SELECT id::text FROM comments WHERE profile_id = ${target_profile_id}))
      `;
      const reportCount = reportCountResult[0].count;

      if (reportCount >= FLAG_THRESHOLD) {
        // Flag the profile
        await sql`
          UPDATE profiles 
          SET status = 'flagged' 
          WHERE id = ${target_profile_id} AND status != 'flagged'
        `;

        // Log the automatic action
        await sql`
          INSERT INTO admin_audit_logs (action, target_type, target_id, details)
          VALUES (
            'automatic_flag', 
            'Profile', 
            ${target_profile_id}, 
            ${JSON.stringify({
              reason: `Reached ${FLAG_THRESHOLD} total reports across all content`,
              report_id: report.id,
              total_reports: reportCount,
            })}
          )
        `;

        // Notify admins
        await notifyAdminsOfFlaggedUser(target_profile_id, reportCount);
      } else if (reportCount >= SHADOW_BAN_THRESHOLD) {
        // Shadow ban the profile
        await sql`
          UPDATE profiles 
          SET status = 'shadow_ban' 
          WHERE id = ${target_profile_id} AND status = 'active'
        `;

        // Log the automatic action
        await sql`
          INSERT INTO admin_audit_logs (action, target_type, target_id, details)
          VALUES (
            'automatic_shadow_ban', 
            'Profile', 
            ${target_profile_id}, 
            ${JSON.stringify({
              reason: `Reached ${SHADOW_BAN_THRESHOLD} total reports (final warning)`,
              report_id: report.id,
              total_reports: reportCount,
            })}
          )
        `;
      } else if (reportCount === WARNING_THRESHOLD) {
        // Send automated warning for the first report
        await sendWarningToUser(target_profile_id);
      }
    }

    return Response.json(report);
  } catch (error) {
    console.error("Error creating report:", error);
    return Response.json({ error: "Failed to submit report" }, { status: 500 });
  }
}

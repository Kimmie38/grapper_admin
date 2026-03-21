import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  // Check if profile exists
  let rows = await sql`SELECT * FROM profiles WHERE user_id = ${userId}`;

  if (rows.length === 0) {
    // Create profile if it doesn't exist
    rows = await sql`
      INSERT INTO profiles (user_id, full_name, avatar_url)
      VALUES (${userId}, ${session.user.name}, ${session.user.image})
      RETURNING *
    `;
  }

  const profile = rows[0];

  // Fetch strike count (total reports across all content)
  const strikeCountResult = await sql`
    SELECT COUNT(*)::int as count 
    FROM reports 
    WHERE 
      (target_type = 'User' AND target_id = ${profile.id})
      OR (target_type = 'Post' AND target_id IN (SELECT id::text FROM posts WHERE profile_id = ${profile.id}))
      OR (target_type = 'Service' AND target_id IN (SELECT id::text FROM services WHERE profile_id = ${profile.id}))
      OR (target_type = 'Comment' AND target_id IN (SELECT id::text FROM comments WHERE profile_id = ${profile.id}))
  `;
  profile.strikeCount = strikeCountResult[0].count;

  // Fetch active subscription
  const subscriptions = await sql`
    SELECT plan_type, end_date FROM subscriptions 
    WHERE profile_id = ${profile.id} 
    AND status = 'active' 
    AND (end_date IS NULL OR end_date > NOW())
    ORDER BY start_date DESC
    LIMIT 1
  `;

  if (subscriptions.length > 0) {
    profile.subscription = subscriptions[0];
    profile.isPremium = ["pro", "premium", "verified_yearly"].includes(
      subscriptions[0].plan_type,
    );
    profile.plan = subscriptions[0].plan_type;
  } else {
    profile.isPremium = false;
    profile.plan = "basic";
  }

  // Fetch services created by this profile
  const userServices = await sql`
    SELECT 
      s.*,
      (
        SELECT COUNT(*)::int
        FROM bookings b
        JOIN services s2 ON b.service_id = s2.id
        WHERE s2.profile_id = s.profile_id
        AND b.status NOT IN ('completed', 'cancelled', 'rejected')
      ) as active_projects
    FROM services s
    WHERE s.profile_id = ${profile.id}
    ORDER BY s.created_at DESC
  `;
  profile.userServices = userServices;

  return Response.json(profile);
}

export async function PUT(request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await request.json();
  const {
    university,
    level,
    bio,
    full_name,
    email,
    services,
    interests,
    country,
    phone_number,
    stripe_account_id,
    avatar_url, // allow changing profile picture
  } = body;

  // Ensure profile exists
  let existing =
    await sql`SELECT id, account_type, phone_number FROM profiles WHERE user_id = ${userId} LIMIT 1`;
  if (existing.length === 0) {
    existing = await sql`
      INSERT INTO profiles (user_id, full_name, avatar_url, services, interests, country, phone_number)
      VALUES (${userId}, ${session.user.name || null}, ${session.user.image || null}, ${services ? JSON.stringify(services) : JSON.stringify([])}, ${interests ? JSON.stringify(interests) : JSON.stringify([])}, ${country || null}, ${phone_number || null})
      RETURNING id, account_type, phone_number
    `;
  }

  // Prevent privilege escalation: only existing admins can change account_type
  const isAdmin = existing[0]?.account_type === "admin";

  // Allow users to update their account_type to valid non-admin roles
  // But prevent escalation to 'admin'
  let allowedAccountTypes = [
    "user",
    "worker",
    "mixed",
    "organization",
    "provider",
    "both",
  ];
  let accountTypeToSet = existing[0].account_type;

  if (body.account_type) {
    if (body.account_type === "admin") {
      // Only admins can set to admin
      if (isAdmin) {
        accountTypeToSet = "admin";
      }
    } else if (allowedAccountTypes.includes(body.account_type)) {
      // Users can switch to these roles
      accountTypeToSet = body.account_type;
    }
  }

  // Enforce phone number for service providers
  const isProviderRole = [
    "worker",
    "mixed",
    "organization",
    "provider",
    "both",
  ].includes(accountTypeToSet);
  if (isProviderRole) {
    // Check if phone number is provided in body or exists in DB (if not being updated)
    // If body.phone_number is undefined, we use existing. If it is defined (even empty string), we use it.
    const finalPhone =
      body.phone_number !== undefined
        ? body.phone_number
        : existing[0].phone_number;

    if (!finalPhone || finalPhone.trim() === "") {
      return Response.json(
        {
          error:
            "Active WhatsApp phone number is required for service providers.",
        },
        { status: 400 },
      );
    }
  }

  const rows = await sql`
    UPDATE profiles
    SET 
      university = COALESCE(${university}, university), 
      level = COALESCE(${level}, level),
      bio = COALESCE(${bio}, bio),
      full_name = COALESCE(${full_name}, full_name),
      avatar_url = COALESCE(${avatar_url}, avatar_url),
      account_type = ${accountTypeToSet},
      services = COALESCE(${services ? JSON.stringify(services) : null}, services),
      interests = COALESCE(${interests ? JSON.stringify(interests) : null}, interests),
      country = COALESCE(${country}, country),
      phone_number = COALESCE(${phone_number}, phone_number),
      stripe_account_id = COALESCE(${stripe_account_id}, stripe_account_id)
    WHERE user_id = ${userId}
    RETURNING *
  `;

  // Sync name and email with auth_users to ensure consistency across the platform
  if (full_name || email) {
    await sql`
      UPDATE auth_users 
      SET 
        name = COALESCE(${full_name}, name),
        email = COALESCE(${email}, email)
      WHERE id = ${userId}
    `;
  }

  return Response.json(rows[0]);
}

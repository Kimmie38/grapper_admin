import { hash } from "argon2";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { email, password, name, country, phone } = await request.json();

    if (!email || !password || !name) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 1. Check if user exists
    const existing =
      await sql`SELECT id FROM auth_users WHERE email = ${email}`;
    if (existing.length > 0) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    // 2. Hash password
    const hashedPassword = await hash(password);

    // 3. Insert user
    const [user] = await sql`
      INSERT INTO auth_users (name, email, image)
      VALUES (${name}, ${email}, null)
      RETURNING id
    `;

    // 4. Insert account
    await sql`
      INSERT INTO auth_accounts ("userId", type, provider, "providerAccountId", password)
      VALUES (${user.id}, 'credentials', 'credentials', ${email}, ${hashedPassword})
    `;

    // 5. Create profile
    await sql`
      INSERT INTO profiles (user_id, full_name, country, phone_number)
      VALUES (${user.id}, ${name}, ${country}, ${phone})
    `;

    return Response.json({ success: true, userId: user.id });
  } catch (e) {
    console.error("Registration error:", e);
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}

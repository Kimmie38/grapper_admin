import { verify } from "argon2";
import { encode } from "@auth/core/jwt";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Missing email or password" },
        { status: 400 },
      );
    }

    // 1. Find user
    const users =
      await sql`SELECT id, name, email, image FROM auth_users WHERE email = ${email}`;
    if (users.length === 0) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const user = users[0];

    // 2. Find account password
    const accounts = await sql`
      SELECT password FROM auth_accounts 
      WHERE "userId" = ${user.id} AND provider = 'credentials'
    `;

    if (accounts.length === 0) {
      // User exists but has no password (maybe OAuth only)
      return Response.json(
        { error: "Please sign in with your social account" },
        { status: 401 },
      );
    }

    // 3. Verify password
    const isValid = await verify(accounts[0].password, password);
    if (!isValid) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 4. Generate Token (compatible with NextAuth/Auth.js)
    const token = await encode({
      token: {
        sub: user.id.toString(),
        name: user.name,
        email: user.email,
        picture: user.image,
      },
      secret: process.env.AUTH_SECRET,
      salt: process.env.AUTH_SECRET, // Sometimes needed for consistent salt usage
    });

    return Response.json({
      jwt: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (e) {
    console.error("Login error:", e);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}

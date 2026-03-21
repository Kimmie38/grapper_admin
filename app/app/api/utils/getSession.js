import { auth } from "@/auth";
import { getToken } from "@auth/core/jwt";

export async function getSession(request) {
  let session = await auth();

  if (session && session.user) {
    return session;
  }

  // Mobile/API flow: Extract from Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const rawToken = authHeader.split(" ")[1];

    // Create a mock request with the token in cookies so getToken() can decode it
    // We populate all common cookie names to ensure getToken finds it regardless of configuration
    const cookieValue = rawToken;
    const cookies = [
      `authjs.session-token=${cookieValue}`,
      `__Secure-authjs.session-token=${cookieValue}`,
      `__Host-authjs.session-token=${cookieValue}`,
      `next-auth.session-token=${cookieValue}`,
      `__Secure-next-auth.session-token=${cookieValue}`,
      `__Host-next-auth.session-token=${cookieValue}`,
    ].join("; ");

    const mockReq = {
      headers: {
        get: (name) => {
          if (name.toLowerCase() === "cookie") return cookies;
          return request.headers.get(name);
        },
      },
      cookies: {
        get: (name) => {
          if (name.includes("session-token")) return { value: cookieValue };
          return undefined;
        },
      },
      url: request.url,
      method: request.method,
    };

    const isSecure = process.env.AUTH_URL?.startsWith("https");

    try {
      // Try with derived security setting
      let token = await getToken({
        req: mockReq,
        secret: process.env.AUTH_SECRET,
        secureCookie: isSecure,
      });

      // Fallback: try opposite security setting (handles http/https mismatches)
      if (!token) {
        token = await getToken({
          req: mockReq,
          secret: process.env.AUTH_SECRET,
          secureCookie: !isSecure,
        });
      }

      if (token) {
        return {
          user: {
            id: token.sub,
            email: token.email,
            name: token.name,
            image: token.picture,
          },
        };
      } else {
        console.log("getSession: getToken returned null for Bearer token");
      }
    } catch (error) {
      console.error("getSession: Error decoding Bearer token", error);
    }
  }

  return null;
}

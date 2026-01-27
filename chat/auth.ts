import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        console.log("🔐 [NextAuth] Authorize called for:", email);

        if (!email || !password) {
          console.error("❌ [NextAuth] Missing email or password");
          return null;
        }

        try {
          console.log(
            "📡 [NextAuth] Calling backend:",
            `${BACKEND_API_URL}/api/user/login`
          );

          // Validate credentials via backend API
          const response = await fetch(`${BACKEND_API_URL}/api/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          console.log(
            "📡 [NextAuth] Backend response status:",
            response.status
          );

          if (!response.ok) {
            console.error("❌ [NextAuth] Backend authentication failed");
            return null;
          }

          const data = await response.json();

          console.log(
            "✅ [NextAuth] Backend authentication successful:",
            data.email
          );
          console.log("🎫 [NextAuth] Token received:", data.token);

          // Return user object for NextAuth session
          return {
            id: data.token, // Use backend token as user ID
            email: data.email,
            name: email.split("@")[0], // Extract name from email
          };
        } catch (error) {
          console.error("❌ [NextAuth] Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        console.log("🎫 [NextAuth] JWT token created:", {
          id: user.id,
          email: user.email,
        });
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        console.log("✅ [NextAuth] Session created for:", session.user.email);
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
  debug: true, // Enable debug logs
});

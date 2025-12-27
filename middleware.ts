import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const email = request.cookies.get("user_email")?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    "/dashboard",
    "/transactions",
    "/wallet",
    "/support",
    "/settings",
    "/agreements",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Protect routes - check for your cookie-based auth
  if (isProtectedRoute && (!token || !email)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === "/sign-in" || pathname === "/sign-up") && token && email) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/wallet/:path*",
    "/support/:path*",
    "/settings/:path*",
    "/agreements/:path*",
    "/sign-in",
    "/sign-up",
  ],
};

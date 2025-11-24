import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const proxy = (request: NextRequest) => {
  const authToken = request.cookies.get("authjs.session-token");
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

  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if ((pathname === "/sign-in" || pathname === "/sign-up") && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
};

// matcher is now moved under "proxy" config
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

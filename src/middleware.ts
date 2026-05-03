import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  { path: "/", whenAuthenticated: "next" },
  { path: "/signup", whenAuthenticated: "redirect" },
  { path: "/signin", whenAuthenticated: "redirect" },
  { path: "/reset-password", whenAuthenticated: "redirect" },
  { path: "/change-password", whenAuthenticated: "redirect" },
  { path: "/verify-email", whenAuthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/signin";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const publicRoute = PUBLIC_ROUTES.find((route) => route.path === pathname);
  const authToken = req.cookies.get("token");

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = req.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && publicRoute && publicRoute.whenAuthenticated === "redirect") {
    const redirectUrl = req.nextUrl.clone();

    redirectUrl.pathname = "/dashboard";

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

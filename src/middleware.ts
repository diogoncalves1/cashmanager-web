import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  if (
    !token &&
    ["/signup", "/verify-email", "/change-password", "/reset-password", "/signin"].includes(
      pathname
    )
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  if (token && pathname === "/signin") {
    const from = request.nextUrl.searchParams.get("from");
    if (from) {
      return NextResponse.redirect(new URL(from, request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/signup", "/verify-email", "/change-password", "/reset-password", "/signin"],
};

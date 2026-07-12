import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAuthPath, isProtectedPath, SESSION_COOKIE_NAME } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  if (isProtectedPath(pathname) && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPath(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/registration", "/feed/:path*"]
};

import { NextRequest, NextResponse } from "next/server";
import { ROLE_COOKIE_KEY } from "@/lib/auth-keys";
import { decideRouteAccess } from "@/lib/route-access";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get(ROLE_COOKIE_KEY)?.value;
  const decision = decideRouteAccess(pathname, roleCookie);
  if (decision.action === "redirect") {
    return NextResponse.redirect(new URL(decision.destination, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|workbox-.*|icons|images).*)",
  ],
};

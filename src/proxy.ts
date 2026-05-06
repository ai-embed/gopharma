import { NextRequest, NextResponse } from "next/server";
import { ROLE_COOKIE_KEY } from "@/lib/auth-keys";
import { decideRouteAccess } from "@/lib/route-access";
import { logger } from "@/lib/observability/logger";

export function proxy(request: NextRequest) {
  // Generate trace ID for observability
  const traceId = request.headers.get("x-trace-id") ?? logger.generateTraceId();
  
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get(ROLE_COOKIE_KEY)?.value;
  
  // Log request (structured logging)
  const requestLog = {
    timestamp: new Date().toISOString(),
    level: "info",
    message: `Request ${request.method} ${pathname}`,
    context: {
      traceId,
      method: request.method,
      path: pathname,
      userAgent: request.headers.get("user-agent")?.substring(0, 50),
    },
  };
  
  if (typeof process !== "undefined" && process.stdout?.isTTY === false) {
    // Production: JSON output
    console.log(JSON.stringify(requestLog));
  }

  const decision = decideRouteAccess(pathname, roleCookie);
  
  if (decision.action === "redirect") {
    // Log redirect
    const redirectLog = {
      timestamp: new Date().toISOString(),
      level: "warn",
      message: `Redirect ${pathname} -> ${decision.destination}`,
      context: { traceId, from: pathname, to: decision.destination, role: roleCookie },
    };
    if (typeof process !== "undefined" && process.stdout?.isTTY === false) {
      console.log(JSON.stringify(redirectLog));
    }
    
    const response = NextResponse.redirect(new URL(decision.destination, request.url));
    response.headers.set("x-trace-id", traceId);
    return response;
  }

  // Continue with trace ID in response header
  const response = NextResponse.next();
  response.headers.set("x-trace-id", traceId);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|workbox-.*|icons|images).*)",
  ],
};

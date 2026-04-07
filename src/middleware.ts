import { NextRequest, NextResponse } from "next/server";
import { ROLE_COOKIE_KEY } from "@/lib/auth-keys";

type RoleBucket = "ADMIN" | "PHARMACY" | "PATIENT" | "UNKNOWN";

const AUTH_PAGES = new Set([
  "/login",
  "/register",
  "/verify-email",
  "/pharmacy-login",
  "/pharmacy-register",
]);

const PATIENT_PREFIXES = [
  "/dashboard",
  "/search",
  "/history",
  "/favorites",
  "/profile",
  "/preferences",
  "/assistant",
  "/localisation",
  "/scan",
  "/reminders",
  "/pharmacies",
  "/account",
];

function normalizeRole(role?: string | null): string {
  return role?.toUpperCase() ?? "";
}

function getRoleBucket(role?: string | null): RoleBucket {
  const normalized = normalizeRole(role);
  if (normalized.includes("ADMIN")) return "ADMIN";
  if (normalized.includes("PHARM")) return "PHARMACY";
  if (normalized.includes("PATIENT")) return "PATIENT";
  return "UNKNOWN";
}

function getRoleHome(role: RoleBucket): string {
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "PHARMACY") return "/pharmacy/dashboard";
  if (role === "PATIENT") return "/dashboard";
  return "/login";
}

function isPrefixedRoute(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isPatientRoute(pathname: string): boolean {
  return PATIENT_PREFIXES.some((prefix) => isPrefixedRoute(pathname, prefix));
}

function isPharmacyRoute(pathname: string): boolean {
  return isPrefixedRoute(pathname, "/pharmacy");
}

function isAdminRoute(pathname: string): boolean {
  return isPrefixedRoute(pathname, "/admin");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get(ROLE_COOKIE_KEY)?.value;
  const role = getRoleBucket(roleCookie);
  const isAuthenticated = role !== "UNKNOWN";

  const onAdminRoute = isAdminRoute(pathname);
  const onPharmacyRoute = isPharmacyRoute(pathname);
  const onPatientRoute = isPatientRoute(pathname);
  const onAuthPage = AUTH_PAGES.has(pathname);

  if (!isAuthenticated) {
    if (onAdminRoute || onPatientRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (onPharmacyRoute) {
      return NextResponse.redirect(new URL("/pharmacy-login", request.url));
    }
    return NextResponse.next();
  }

  if (onAuthPage) {
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  if (onAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  if (onPharmacyRoute && role !== "PHARMACY") {
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  if (onPatientRoute && role !== "PATIENT") {
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|workbox-.*|icons|images).*)",
  ],
};

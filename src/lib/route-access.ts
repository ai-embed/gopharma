export type RoleBucket = "ADMIN" | "PHARMACY" | "PATIENT" | "UNKNOWN";

export const AUTH_PAGES = new Set([
  "/login",
  "/register",
  "/verify-email",
  "/pharmacy-login",
  "/pharmacy-register",
]);

export const PATIENT_PREFIXES = [
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

export function normalizeRole(role?: string | null): string {
  return role?.toUpperCase() ?? "";
}

export function getRoleBucket(role?: string | null): RoleBucket {
  const normalized = normalizeRole(role);
  if (normalized.includes("ADMIN")) return "ADMIN";
  if (normalized.includes("PHARM")) return "PHARMACY";
  if (normalized.includes("PATIENT")) return "PATIENT";
  return "UNKNOWN";
}

export function getRoleHome(role: RoleBucket): string {
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "PHARMACY") return "/pharmacy/dashboard";
  if (role === "PATIENT") return "/dashboard";
  return "/login";
}

export function isPrefixedRoute(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isPatientRoute(pathname: string): boolean {
  return PATIENT_PREFIXES.some((prefix) => isPrefixedRoute(pathname, prefix));
}

export function isPharmacyRoute(pathname: string): boolean {
  return isPrefixedRoute(pathname, "/pharmacy");
}

export function isAdminRoute(pathname: string): boolean {
  return isPrefixedRoute(pathname, "/admin");
}

export type RouteAccessDecision =
  | { action: "allow" }
  | { action: "redirect"; destination: string };

export function decideRouteAccess(
  pathname: string,
  roleCookie?: string | null
): RouteAccessDecision {
  const role = getRoleBucket(roleCookie);
  const isAuthenticated = role !== "UNKNOWN";

  const onAdminRoute = isAdminRoute(pathname);
  const onPharmacyRoute = isPharmacyRoute(pathname);
  const onPatientRoute = isPatientRoute(pathname);
  const onAuthPage = AUTH_PAGES.has(pathname);

  if (!isAuthenticated) {
    if (onAdminRoute || onPatientRoute) {
      return { action: "redirect", destination: "/login" };
    }
    if (onPharmacyRoute) {
      return { action: "redirect", destination: "/pharmacy-login" };
    }
    return { action: "allow" };
  }

  if (onAuthPage) {
    return { action: "redirect", destination: getRoleHome(role) };
  }

  if (onAdminRoute && role !== "ADMIN") {
    return { action: "redirect", destination: getRoleHome(role) };
  }

  if (onPharmacyRoute && role !== "PHARMACY") {
    return { action: "redirect", destination: getRoleHome(role) };
  }

  if (onPatientRoute && role !== "PATIENT") {
    return { action: "redirect", destination: getRoleHome(role) };
  }

  return { action: "allow" };
}

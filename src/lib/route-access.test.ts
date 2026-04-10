import { describe, expect, it } from "vitest";
import {
  decideRouteAccess,
  getRoleBucket,
  getRoleHome,
  isAdminRoute,
  isPatientRoute,
  isPharmacyRoute,
} from "./route-access";

describe("route access guard", () => {
  it("classifies route families correctly", () => {
    expect(isAdminRoute("/admin/dashboard")).toBe(true);
    expect(isAdminRoute("/dashboard")).toBe(false);

    expect(isPharmacyRoute("/pharmacy/settings")).toBe(true);
    expect(isPharmacyRoute("/settings")).toBe(false);

    expect(isPatientRoute("/search")).toBe(true);
    expect(isPatientRoute("/profile/edit")).toBe(true);
    expect(isPatientRoute("/login")).toBe(false);
  });

  it("computes role buckets and home routes", () => {
    expect(getRoleBucket("ADMIN")).toBe("ADMIN");
    expect(getRoleBucket("manager_pharmacie")).toBe("PHARMACY");
    expect(getRoleBucket("patient")).toBe("PATIENT");
    expect(getRoleBucket("")).toBe("UNKNOWN");

    expect(getRoleHome("ADMIN")).toBe("/admin/dashboard");
    expect(getRoleHome("PHARMACY")).toBe("/pharmacy/dashboard");
    expect(getRoleHome("PATIENT")).toBe("/dashboard");
    expect(getRoleHome("UNKNOWN")).toBe("/login");
  });

  it("blocks anonymous access to protected routes", () => {
    expect(decideRouteAccess("/admin/dashboard", null)).toEqual({
      action: "redirect",
      destination: "/login",
    });
    expect(decideRouteAccess("/dashboard", null)).toEqual({
      action: "redirect",
      destination: "/login",
    });
    expect(decideRouteAccess("/pharmacy/dashboard", null)).toEqual({
      action: "redirect",
      destination: "/pharmacy-login",
    });
    expect(decideRouteAccess("/login", null)).toEqual({ action: "allow" });
  });

  it("prevents cross-role access", () => {
    expect(decideRouteAccess("/admin/users", "PATIENT")).toEqual({
      action: "redirect",
      destination: "/dashboard",
    });
    expect(decideRouteAccess("/pharmacy/inventory", "PATIENT")).toEqual({
      action: "redirect",
      destination: "/dashboard",
    });

    expect(decideRouteAccess("/admin/users", "PHARMACY_MANAGER")).toEqual({
      action: "redirect",
      destination: "/pharmacy/dashboard",
    });
    expect(decideRouteAccess("/dashboard", "PHARMACY_MANAGER")).toEqual({
      action: "redirect",
      destination: "/pharmacy/dashboard",
    });

    expect(decideRouteAccess("/search", "ADMIN")).toEqual({
      action: "redirect",
      destination: "/admin/dashboard",
    });
    expect(decideRouteAccess("/pharmacy/history", "ADMIN")).toEqual({
      action: "redirect",
      destination: "/admin/dashboard",
    });
  });

  it("redirects authenticated users away from auth pages", () => {
    expect(decideRouteAccess("/login", "PATIENT")).toEqual({
      action: "redirect",
      destination: "/dashboard",
    });
    expect(decideRouteAccess("/register", "PHARMACY")).toEqual({
      action: "redirect",
      destination: "/pharmacy/dashboard",
    });
    expect(decideRouteAccess("/verify-email", "ADMIN")).toEqual({
      action: "redirect",
      destination: "/admin/dashboard",
    });
  });
});

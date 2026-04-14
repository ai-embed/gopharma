/**
 * Role Guard - Validation stricte des rôles côté client
 * Vérifie l'accès aux routes et actions sensibles
 */

export const ROLES = {
  PATIENT: "PATIENT",
  PHARMACY_MANAGER: "PHARMACY_MANAGER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Route permissions mapping
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  [ROLES.PATIENT]: ["/dashboard", "/search", "/favorites", "/profile"],
  [ROLES.PHARMACY_MANAGER]: ["/pharmacy/dashboard", "/pharmacy/inventory"],
  [ROLES.ADMIN]: [
    "/admin/dashboard",
    "/admin/users",
    "/admin/pharmacies",
    "/admin/validation-queue",
    "/admin/observability",
  ],
};

interface GuardResult {
  allowed: boolean;
  reason?: string;
  requiredRole?: Role;
}

/**
 * Normalise un rôle (handle legacy formats)
 */
export function normalizeRole(role: string): Role | null {
  const upper = role.toUpperCase();
  if (upper.includes("ADMIN")) return ROLES.ADMIN;
  if (upper.includes("PHARM") || upper.includes("MANAGER")) return ROLES.PHARMACY_MANAGER;
  if (upper.includes("PATIENT")) return ROLES.PATIENT;
  return null;
}

/**
 * Vérifie l'accès à une route
 */
export function canAccessRoute(role: string, path: string): GuardResult {
  const normalizedRole = normalizeRole(role);
  if (!normalizedRole) {
    return { allowed: false, reason: "Rôle invalide" };
  }

  if (normalizedRole === ROLES.ADMIN) {
    return { allowed: true };
  }

  const allowedPaths = ROLE_PERMISSIONS[normalizedRole];
  const isAllowed = allowedPaths.some(
    (allowed) => path === allowed || path.startsWith(`${allowed}/`)
  );

  if (!isAllowed) {
    return {
      allowed: false,
      reason: `Accès refusé: le rôle ${normalizedRole} n'a pas accès à ${path}`,
      requiredRole: ROLES.ADMIN,
    };
  }

  return { allowed: true };
}

/**
 * Hook-compatible function to check access with role hierarchy
 */
export function checkAccess(
  userRole: string | null | undefined,
  requiredRole: Role,
  context?: { path?: string }
): GuardResult {
  if (!userRole) {
    return { allowed: false, reason: "Non authentifié" };
  }

  const normalizedRole = normalizeRole(userRole);
  if (!normalizedRole) {
    return { allowed: false, reason: "Rôle invalide" };
  }

  // Role hierarchy check
  const roleHierarchy: Role[] = [ROLES.PATIENT, ROLES.PHARMACY_MANAGER, ROLES.ADMIN];
  const userLevel = roleHierarchy.indexOf(normalizedRole);
  const requiredLevel = roleHierarchy.indexOf(requiredRole);

  if (userLevel < requiredLevel) {
    return {
      allowed: false,
      reason: `Privilèges insuffisants. Requis: ${requiredRole}, Actuel: ${normalizedRole}`,
      requiredRole,
    };
  }

  if (context?.path) {
    const routeCheck = canAccessRoute(normalizedRole, context.path);
    if (!routeCheck.allowed) {
      return routeCheck;
    }
  }

  return { allowed: true };
}

export function normalizeRole(role?: string | null) {
  return role?.toUpperCase() ?? "";
}

export function getRoleHomePath(role?: string | null) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole.includes("ADMIN")) return "/admin/dashboard";
  if (normalizedRole.includes("PHARM")) return "/pharmacy/dashboard";
  if (normalizedRole.includes("PATIENT")) return "/dashboard";

  return "/login";
}

export function getRolePostAuthPath(role?: string | null) {
  return getRoleHomePath(role);
}

export function getRoleTargetLabel(role?: string | null) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole.includes("ADMIN")) return "l’espace administrateur";
  if (normalizedRole.includes("PHARM")) return "l’espace pharmacie";
  if (normalizedRole.includes("PATIENT")) return "l’espace patient";

  return "la connexion";
}

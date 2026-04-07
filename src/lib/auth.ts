import { ACCESS_KEY, REFRESH_KEY, ROLE_COOKIE_KEY } from "./auth-keys";

export function saveTokens(
  accessToken: string,
  refreshToken: string,
  rememberMe = true
) {
  if (typeof window === "undefined") return;
  const primary = rememberMe ? localStorage : sessionStorage;
  const secondary = rememberMe ? sessionStorage : localStorage;

  primary.setItem(ACCESS_KEY, accessToken);
  primary.setItem(REFRESH_KEY, refreshToken);
  secondary.removeItem(ACCESS_KEY);
  secondary.removeItem(REFRESH_KEY);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  clearRoleCookie();
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return (
    sessionStorage.getItem(ACCESS_KEY) ?? localStorage.getItem(ACCESS_KEY)
  );
}

export function saveRoleCookie(role: string, rememberMe = true) {
  if (typeof window === "undefined") return;
  const normalizedRole = role.trim().toUpperCase();
  if (!normalizedRole) return;

  const base = `${ROLE_COOKIE_KEY}=${encodeURIComponent(normalizedRole)}; Path=/; SameSite=Lax`;
  const rememberSuffix = rememberMe ? "; Max-Age=2592000" : "";
  document.cookie = `${base}${rememberSuffix}`;
}

export function clearRoleCookie() {
  if (typeof window === "undefined") return;
  document.cookie = `${ROLE_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}

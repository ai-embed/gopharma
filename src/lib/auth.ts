const ACCESS_KEY = "gopharma_access_token";
const REFRESH_KEY = "gopharma_refresh_token";

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
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return (
    sessionStorage.getItem(ACCESS_KEY) ?? localStorage.getItem(ACCESS_KEY)
  );
}

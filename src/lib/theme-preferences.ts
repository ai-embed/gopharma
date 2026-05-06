export type ThemePreference = "light" | "dark";

const THEME_STORAGE_KEY = "gp.theme.preference";

function normalizeTheme(value: string | null | undefined): ThemePreference {
  return value === "dark" ? "dark" : "light";
}

export function getSavedThemePreference(): ThemePreference | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (!raw) return null;
  return normalizeTheme(raw);
}

export function applyThemePreference(theme: ThemePreference) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  const body = document.body;
  if (body) {
    body.classList.toggle("gp-theme-dark", theme === "dark");
    body.classList.toggle("gp-theme-light", theme === "light");
  }
}

export function setThemePreference(theme: ThemePreference) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
  applyThemePreference(theme);
}

export function hydrateThemePreference(defaultTheme: ThemePreference = "light") {
  const savedTheme = getSavedThemePreference();
  applyThemePreference(savedTheme ?? defaultTheme);
  return savedTheme ?? defaultTheme;
}

export function normalizeThemePreference(value: string | null | undefined): ThemePreference {
  return normalizeTheme(value);
}

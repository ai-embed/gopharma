"use client";

import { useState, useSyncExternalStore } from "react";
import {
  getSavedThemePreference,
  setThemePreference,
  type ThemePreference,
} from "@/lib/theme-preferences";
import { apiJsonAuth } from "@/lib/api";

const THEME_CHANGE_EVENT = "gp-theme-change";

function getThemeSnapshot(): ThemePreference {
  const rootTheme =
    typeof document === "undefined"
      ? null
      : document.documentElement.dataset.theme;
  return rootTheme === "dark"
    ? "dark"
    : rootTheme === "light"
      ? "light"
      : getSavedThemePreference() ?? "light";
}

function subscribeToTheme(listener: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => "light"
  );
  const [saveError, setSaveError] = useState("");

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Activer le thème ${nextTheme === "dark" ? "sombre" : "clair"}`}
      aria-pressed={theme === "dark"}
      title={`Passer au thème ${nextTheme === "dark" ? "sombre" : "clair"}`}
      onClick={() => {
        setThemePreference(nextTheme);
        setSaveError("");
        void apiJsonAuth("/api/users/me/preferences", {
          method: "PATCH",
          body: JSON.stringify({ theme: nextTheme }),
        }).then((result) => {
          if (!result.ok) {
            setSaveError(
              "Le thème est appliqué sur cet appareil, mais n’a pas pu être synchronisé."
            );
          }
        });
      }}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1F2937] transition hover:bg-[#F8FAFC]"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            d="M20.2 15.3A8.5 8.5 0 0 1 8.7 3.8 8.5 8.5 0 1 0 20.2 15.3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span className="sr-only" role="status">
        {saveError}
      </span>
    </button>
  );
}

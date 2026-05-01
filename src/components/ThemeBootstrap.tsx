"use client";

import { useEffect } from "react";
import { hydrateThemePreference } from "@/lib/theme-preferences";

export default function ThemeBootstrap() {
  useEffect(() => {
    hydrateThemePreference("light");
  }, []);

  return null;
}

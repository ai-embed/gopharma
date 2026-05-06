"use client";

import { useEffect, useState } from "react";
import { UserProfileSchema } from "./schemas";
import { apiGetValidated } from "./api-validated";
import { clearTokens, saveRoleCookie } from "./auth";
import type { UserProfile } from "./schemas";

export type UseUserResult =
  | { user: UserProfile; loading: false; error: null }
  | { user: null; loading: true; error: null }
  | { user: null; loading: false; error: string };

export function useUser(): UseUserResult {
  const [state, setState] = useState<UseUserResult>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    apiGetValidated("/api/users/me", UserProfileSchema).then((res) => {
      if (!active) return;

      if (res.ok) {
        setState({ user: res.data, loading: false, error: null });
        saveRoleCookie(res.data.role);
      } else {
        if (res.error?.includes("401")) {
          clearTokens();
        }
        setState({ user: null, loading: false, error: res.error });
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return state;
}

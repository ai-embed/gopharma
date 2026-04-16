"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { saveRoleCookie, saveTokens } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/roles";

type GoogleAuthPayload =
  | {
      error: string;
    }
  | {
      accessToken: string;
      refreshToken: string;
      role: string | null;
      error: null;
    };

function parseHashParams() {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }
  const hash = window.location.hash.replace(/^#/, "");
  return new URLSearchParams(hash);
}

export default function GoogleSuccessPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const authPayload = useMemo<GoogleAuthPayload>(() => {
    const params = parseHashParams();
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const role = params.get("role");

    if (!accessToken || !refreshToken) {
      return {
        error: "Impossible de finaliser la connexion Google.",
      };
    }

    return {
      accessToken,
      refreshToken,
      role,
      error: null,
    };
  }, []);

  const validPayload = authPayload.error === null ? authPayload : null;

  useEffect(() => {
    if (!validPayload) {
      return;
    }

    saveTokens(validPayload.accessToken, validPayload.refreshToken, true);
    if (validPayload.role) {
      saveRoleCookie(validPayload.role, true);
    }

    const nextPath = getRoleHomePath(validPayload.role);
    router.replace(nextPath);
  }, [router, validPayload]);

  // Show loading state during hydration to avoid mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#F3F6F9] px-4 py-10 text-[#1E1E1E]">
        <div className="mx-auto w-full max-w-120 rounded-[28px] bg-white p-8 text-center shadow-[0_18px_60px_-40px_rgba(15,23,42,0.6)]">
          <div className="text-lg font-semibold">Connexion Google</div>
          <p className="mt-3 text-sm text-[#6B7280]">
            Validation en cours, redirection…
          </p>
          <div className="mt-6 flex items-center justify-center">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#0B63D1] border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (authPayload.error) {
    return (
      <div className="min-h-screen bg-[#F3F6F9] px-4 py-10 text-[#1E1E1E]">
        <div className="mx-auto w-full max-w-120 rounded-[28px] bg-white p-8 text-center shadow-[0_18px_60px_-40px_rgba(15,23,42,0.6)]">
          <div className="text-lg font-semibold">Connexion Google</div>
          <p className="mt-3 text-sm text-[#6B7280]">{authPayload.error}</p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 w-full rounded-2xl bg-[#0B63D1] py-3 text-sm font-semibold text-white"
          >
            Revenir à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F6F9] px-4 py-10 text-[#1E1E1E]">
      <div className="mx-auto w-full max-w-120 rounded-[28px] bg-white p-8 text-center shadow-[0_18px_60px_-40px_rgba(15,23,42,0.6)]">
        <div className="text-lg font-semibold">Connexion Google</div>
        <p className="mt-3 text-sm text-[#6B7280]">
          Validation en cours, redirection…
        </p>
        <div className="mt-6 flex items-center justify-center">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#0B63D1] border-t-transparent" />
        </div>
      </div>
    </div>
  );
}

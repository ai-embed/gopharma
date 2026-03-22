"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveTokens } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/roles";

function parseHashParams() {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }
  const hash = window.location.hash.replace(/^#/, "");
  return new URLSearchParams(hash);
}

export default function GoogleSuccessPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = parseHashParams();
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const role = params.get("role");

    if (!accessToken || !refreshToken) {
      setError("Impossible de finaliser la connexion Google.");
      return;
    }

    saveTokens(accessToken, refreshToken, true);

    const nextPath = getRoleHomePath(role);
    router.replace(nextPath);
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#F3F6F9] px-4 py-10 text-[#1E1E1E]">
        <div className="mx-auto w-full max-w-[480px] rounded-[28px] bg-white p-8 text-center shadow-[0_18px_60px_-40px_rgba(15,23,42,0.6)]">
          <div className="text-lg font-semibold">Connexion Google</div>
          <p className="mt-3 text-sm text-[#6B7280]">{error}</p>
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
      <div className="mx-auto w-full max-w-[480px] rounded-[28px] bg-white p-8 text-center shadow-[0_18px_60px_-40px_rgba(15,23,42,0.6)]">
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

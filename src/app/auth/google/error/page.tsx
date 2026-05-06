"use client";

import { useMemo } from "react";
import Link from "next/link";

function getErrorFromHash() {
  if (typeof window === "undefined") return "oauth_failed";
  const hash = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);
  return params.get("error") ?? "oauth_failed";
}

export default function GoogleErrorPage() {
  const error = useMemo(() => getErrorFromHash(), []);

  return (
    <div className="min-h-screen bg-[#F3F6F9] px-4 py-10 text-[#1E1E1E]">
      <div className="mx-auto w-full max-w-[480px] rounded-[28px] bg-white p-8 text-center shadow-[0_18px_60px_-40px_rgba(15,23,42,0.6)]">
        <div className="text-lg font-semibold">Connexion Google</div>
        <p className="mt-3 text-sm text-[#6B7280]">
          La connexion Google a échoué ({error}).
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full rounded-2xl bg-[#0B63D1] py-3 text-sm font-semibold text-white"
          >
            Revenir à la connexion
          </Link>
          <Link
            href="/register"
            className="w-full rounded-2xl border border-[#E5E7EB] py-3 text-sm font-semibold text-[#1F2937]"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}

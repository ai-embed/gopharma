"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearTokens } from "@/lib/auth";
import { useUser } from "@/lib/useUser";

export function TopNav() {
  const router = useRouter();
  const { user, loading } = useUser();

  const logout = () => {
    clearTokens();
    router.push("/login");
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E5E7EB] bg-white px-6 py-4">
      <Link href="/search" className="text-lg font-semibold text-[#0B63D1]">
        GoPharma
      </Link>
      <div className="flex items-center gap-3">
        <div className="text-sm text-[#6B7280]">
          {loading
            ? "Chargement..."
            : user
            ? `${user.firstName} ${user.lastName}`
            : "Invité"}
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#1F2937]"
        >
          Se déconnecter
        </button>
      </div>
    </header>
  );
}

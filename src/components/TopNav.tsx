"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearTokens } from "@/lib/auth";
import { useUser } from "@/lib/useUser";

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();

  const logout = () => {
    clearTokens();
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard", label: "Accueil" },
    { href: "/history", label: "Historique" },
    { href: "/favorites", label: "Favoris" },
  ];

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Utilisateur"
    : "Utilisateur";

  return (
    <header className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex flex-wrap items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B63D1] text-white">
            +
          </div>
          <span className="text-lg font-semibold text-[#0B63D1]">GoPharma</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-[#6B7280]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#0B63D1] text-white"
                    : "border border-transparent text-[#6B7280] hover:border-[#E5E7EB]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#1F2937]"
        >
          Se déconnecter
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] text-[#1F2937]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              d="M6.5 17.5h11l-1.5-2v-4.5a4.5 4.5 0 1 0-9 0V15.5l-1.5 2z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M10 18.5a2 2 0 0 0 4 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#0B63D1]" />
        </button>
        <div className="hidden flex-col items-end text-[11px] leading-tight text-[#6B7280] sm:flex">
          <span>Bonjour</span>
          <span className="text-xs font-semibold text-[#1F2937]">
            {loading ? "..." : displayName}
          </span>
        </div>
        <Link
          href="/profile"
          aria-label="Profil patient"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2F7] text-[#0B63D1]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.9" />
            <path
              d="M5 20c1.8-4 11.2-4 14 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}

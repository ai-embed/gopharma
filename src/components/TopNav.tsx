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
    { href: "/search", label: "Accueil" },
    { href: "/history", label: "Historique" },
    { href: "/favorites", label: "Favoris" },
  ];

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "U";

  return (
    <header className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-[#E5E7EB] bg-white px-6 py-4">
      <div className="flex flex-wrap items-center gap-6">
        <Link href="/search" className="flex items-center gap-3">
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
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] text-[#1F2937]"
        >
          <span className="h-2 w-2 rounded-full bg-[#0B63D1]" />
        </button>
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2F7] text-xs font-semibold text-[#1F2937]"
        >
          {loading ? "..." : initials || "U"}
        </Link>
      </div>
    </header>
  );
}

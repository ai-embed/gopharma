"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { NotificationsMenu } from "@/components/NotificationsMenu";
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
    { href: "/dashboard", label: "Accueil", matchPrefix: "/dashboard" },
    { href: "/reminders/new", label: "Calendrier", matchPrefix: "/reminders" },
    { href: "/history", label: "Historique", matchPrefix: "/history" },
    { href: "/favorites", label: "Favoris", matchPrefix: "/favorites" },
  ];

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Utilisateur"
    : "Utilisateur";

  return (
    <header className="gp-top-nav flex flex-wrap items-center justify-between gap-4 rounded-3xl px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4 sm:gap-6">
        <Link href="/dashboard" className="gp-brand-link flex shrink-0 items-center gap-3">
          <Image
            src="/icons/Untitled design.png"
            alt="GoPharma Logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl"
          />
          <span className="text-lg font-bold tracking-[-0.03em] text-[#0B63D1]">GoPharma</span>
        </Link>
        <nav
          aria-label="Navigation principale"
          className="gp-nav-links flex min-w-0 items-center gap-1.5 text-sm text-[#6B7280] sm:gap-2"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.matchPrefix);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`gp-nav-link whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold ${
                  isActive
                    ? "gp-nav-link--active"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={logout}
          className="hidden rounded-full border border-[#D7E5F2] bg-white/70 px-4 py-2 text-xs font-semibold text-[#1F2937] transition hover:border-[#9FC8EC] hover:bg-[#F4FAFF] sm:inline-flex"
        >
          Se déconnecter
        </button>
        <NotificationsMenu />
        <div className="hidden flex-col items-end text-[11px] leading-tight text-[#6B7280] sm:flex">
          <span>Bonjour</span>
          <span className="text-xs font-semibold text-[#1F2937]">
            {loading ? "..." : displayName}
          </span>
        </div>
        <Link
          href="/profile"
          aria-label="Profil patient"
          className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#EAF3FF] ring-2 ring-white transition hover:scale-105 hover:ring-[#B9DCF6]"
        >
          {user?.profilePhotoUrl ? (
            <Image
              src={user.profilePhotoUrl}
              alt={`Photo de profil de ${displayName}`}
              fill
              className="object-cover"
            />
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-[#0B63D1]"
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
          )}
        </Link>
      </div>
    </header>
  );
}

"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AppFooter from "@/components/AppFooter";
import { NotificationsMenu } from "@/components/NotificationsMenu";
import { clearTokens, getAccessToken } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/roles";
import { usePharmacyStoreStatus } from "@/lib/usePharmacyStoreStatus";
import { useUser } from "@/lib/useUser";

const navItems = [
  {
    href: "/pharmacy/dashboard",
    label: "Tableau de bord",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
        <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" />
        <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" />
        <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/pharmacy/inventory",
    label: "Inventaire",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M4 7.5l8-4 8 4-8 4-8-4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M4 7.5V16l8 4 8-4V7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/pharmacy/history",
    label: "Historique",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M12 7.5v5l3 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
  {
    href: "/pharmacy/plannings",
    label: "Horaires",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <rect
          x="4"
          y="5"
          width="16"
          height="15"
          rx="2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8 3.5v3M16 3.5v3M4 9h16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/pharmacy/settings",
    label: "Paramètres",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M4.5 12l1.5-.3a6.4 6.4 0 0 1 .8-1.8l-1-1.2 1.6-1.6 1.2 1a6.4 6.4 0 0 1 1.8-.8L12 4.5l1.5.3a6.4 6.4 0 0 1 1.8.8l1.2-1 1.6 1.6-1 1.2c.35.55.62 1.15.8 1.8L19.5 12l-.3 1.5a6.4 6.4 0 0 1-.8 1.8l1 1.2-1.6 1.6-1.2-1a6.4 6.4 0 0 1-1.8.8L12 19.5l-1.5-.3a6.4 6.4 0 0 1-1.8-.8l-1.2 1-1.6-1.6 1-1.2a6.4 6.4 0 0 1-.8-1.8L4.5 12z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/pharmacy/profile/edit",
    label: "Mon profil",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const hasToken = Boolean(getAccessToken());
  const roleHome = user ? getRoleHomePath(user.role) : null;
  const canRender = hasToken && !loading && roleHome === "/pharmacy/dashboard";
  const storeStatus = usePharmacyStoreStatus();

  const logout = () => {
    clearTokens();
    router.push("/pharmacy-login");
  };

  useEffect(() => {
    if (!hasToken) {
      router.replace("/pharmacy-login");
      return;
    }

    if (loading) return;

    if (!user) {
      clearTokens();
      router.replace("/pharmacy-login");
      return;
    }

    if (roleHome && roleHome !== "/pharmacy/dashboard") {
      router.replace(roleHome);
    }
  }, [hasToken, loading, roleHome, router, user]);

  if (!canRender) {
    return (
      <div className="min-h-screen bg-[#F3F6F9] px-4 py-6 text-[#1F1D1B] sm:px-6 sm:py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-center rounded-3xl border border-[#E5E7EB] bg-white py-16 text-sm text-[#6B7280]">
          Vérification de session…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F6F9] text-[#1F1D1B]">
      <div className="flex flex-col md:flex-row">
        <aside className="flex w-full flex-col border-b border-[#E5E7EB] bg-white px-6 py-6 md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
          <Link
          href="/pharmacy/dashboard"
          className="flex items-center gap-3"
        >
          <Image
            src="/icons/Untitled design.png"
            alt="GoPharma Logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-xl"
          />
          <div>
            <p className="text-sm font-semibold">GoPharma</p>
            <p className="text-[11px] text-[#6B7280]">Tableau de bord</p>
          </div>
        </Link>

          <nav className="mt-8 space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                    isActive
                      ? "bg-[#EAF2FF] text-[#0B63D1]"
                      : "text-[#6B7280] hover:bg-[#F3F6F9]"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/0">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-xs text-[#6B7280]">
            <p className="font-semibold text-[#1F1D1B]">Statut du magasin</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    storeStatus.isOpen ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {storeStatus.leftLabel}
              </span>
              <span>{storeStatus.rightLabel}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-4 flex items-center gap-2 text-left text-xs font-semibold text-[#6B7280]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-md border border-[#E5E7EB] bg-white">
              <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden="true">
                <path
                  d="M10 7l-4 5 4 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 12h12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            Déconnexion
          </button>
        </aside>

        <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div />
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                    aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M20 20l-3.5-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  placeholder="Recherche globale..."
                  className="w-56 rounded-full border border-[#E5E7EB] bg-white py-2 pl-10 pr-4 text-xs text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0B63D1]/40 sm:w-64"
                />
              </div>
              <NotificationsMenu />
              <div className="flex items-center gap-3 rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs">
                <Link
                  href="/pharmacy/profile/edit"
                  className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#EAF2FF]"
                >
                  {user?.profilePhotoUrl ? (
                    <Image
                      src={user.profilePhotoUrl}
                      alt={`Photo de profil de ${user.firstName} ${user.lastName}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[11px] font-semibold text-[#0B63D1]">CP</span>
                  )}
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-emerald-500" />
                </Link>
                <div>
                  <p className="text-[11px] font-semibold text-[#1F1D1B]">
                    Pharmacie CVS #4290
                  </p>
                  <p className="text-[10px] text-[#6B7280]">Gestionnaire</p>
                  </div>
                </div>
              </div>
            </div>

            {children}
            <AppFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

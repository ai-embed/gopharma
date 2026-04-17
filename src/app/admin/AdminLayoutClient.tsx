"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import AppFooter from "@/components/AppFooter";
import { clearTokens, getAccessToken } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/roles";
import { useUser } from "@/lib/useUser";

const navSections = [
  {
    title: "Principal",
    items: [
      { href: "/admin/dashboard", label: "Tableau de bord" },
      { href: "/admin/users", label: "Utilisateurs" },
      { href: "/admin/pharmacies", label: "Pharmacies" },
      { href: "/admin/medicaments", label: "Base Médicaments" },
      { href: "/admin/validation-queue", label: "File de validation" },
    ],
  },
  {
    title: "Analytique",
    items: [
      { href: "/admin/reports", label: "Rapports" },
      { href: "/admin/growth", label: "Croissance" },
    ],
  },
  {
    title: "Système",
    items: [
      { href: "/admin/settings", label: "Paramètres" },
      { href: "/admin/audit-logs", label: "Journaux d'audit" },
      { href: "/admin/observability", label: "Observabilité" },
    ],
  },
];

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const hasToken = Boolean(getAccessToken());
  const roleHome = user ? getRoleHomePath(user.role) : null;
  const canRender = hasToken && !loading && roleHome === "/admin/dashboard";

  useEffect(() => {
    if (!hasToken) {
      router.replace("/login");
      return;
    }

    if (loading) return;

    if (!user) {
      clearTokens();
      router.replace("/login");
      return;
    }

    if (roleHome && roleHome !== "/admin/dashboard") {
      router.replace(roleHome);
    }
  }, [hasToken, loading, roleHome, router, user]);

  const logout = () => {
    clearTokens();
    router.push("/login");
  };

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Admin";
  const initials =
    `${(user?.firstName ?? "").slice(0, 1)}${(user?.lastName ?? "").slice(0, 1)}`
      .toUpperCase()
      .trim() || "AD";

  if (!canRender) {
    return (
      <div className="min-h-screen bg-[#F6F8FA] px-4 py-6 text-[#1F1D1B] sm:px-6 sm:py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-center rounded-3xl border border-[#E5E7EB] bg-white py-16 text-sm text-[#6B7280]">
          Vérification de session…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FA] text-[#1F1D1B]">
      <div className="flex flex-col md:flex-row">
        <aside className="flex w-full shrink-0 flex-col border-b border-[#E5E7EB] bg-white px-6 py-6 md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
          <Link
            href="/admin/dashboard"
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

          {navSections.map((section) => (
            <div key={section.title}>
              <p className="mt-8 text-[10px] font-semibold uppercase text-[#9CA3AF]">
                {section.title}
              </p>
              <nav className="mt-3 space-y-1 text-xs font-semibold text-[#6B7280]">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                        isActive
                          ? "bg-[#EAF2FF] text-[#0B63D1]"
                          : "hover:bg-[#F3F6F9]"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          <Link
            href={user ? `/admin/users/${user._id}` : "/admin/users"}
            className="mt-auto flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-xs text-[#6B7280] transition hover:bg-[#F3F6F9]"
          >
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#EAF2FF]">
              {user?.profilePhotoUrl ? (
                <Image
                  src={user.profilePhotoUrl}
                  alt={`Photo de profil de ${fullName}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-[11px] font-semibold text-[#0B63D1]">{initials}</span>
              )}
            </span>
            <div>
              <p className="text-[11px] font-semibold text-[#1F1D1B]">{fullName}</p>
              <p className="text-[10px]">{user?.role?.includes("ADMIN") ? "Administrateur" : "Compte"}</p>
            </div>
          </Link>

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

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            {children}
            <AppFooter />
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { PatientShell } from "@/components/PatientShell";
import { useUser } from "@/lib/useUser";

type ProfileTab = "profile" | "favorites" | "history" | "preferences";

const tabs: { href: string; label: string; key: ProfileTab }[] = [
  { href: "/profile", label: "Infos personnelles", key: "profile" },
  { href: "/favorites", label: "Favoris", key: "favorites" },
  { href: "/history", label: "Historique", key: "history" },
  { href: "/preferences", label: "Préférences", key: "preferences" },
];

export default function ProfileShell({
  activeTab,
  children,
}: {
  activeTab: ProfileTab;
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Utilisateur"
    : "Utilisateur";
  const email = user?.email ?? "utilisateur@example.com";
  const isEmailVerified = Boolean(user?.emailVerifiedAt);
  const memberSince = getMemberSinceLabel(user?._id, user?.emailVerifiedAt);
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";
  const profilePhotoUrl = user?.profilePhotoUrl ?? null;

  return (
    <PatientShell>
      <div className="gp-profile-hero relative overflow-hidden rounded-[2rem] p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="gp-profile-avatar relative h-16 w-16 overflow-hidden rounded-full bg-linear-to-br from-[#0B63D1] to-[#1E40AF]">
              {loading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              ) : profilePhotoUrl ? (
                <Image
                  src={profilePhotoUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm font-bold text-white">{initials}</span>
                </div>
              )}
            </div>
            <div>
              <p className="gp-section-kicker">Espace personnel</p>
              <h1 className="mt-1 text-lg font-bold tracking-[-0.03em]">{displayName}</h1>
              <p className="text-sm text-[#6B7280]">{email}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                <span
                  className={`rounded-full px-3 py-1 ${
                    isEmailVerified
                      ? "bg-[#E8FFF1] text-[#0F9D58]"
                      : "bg-[#FFF5F5] text-[#C0392B]"
                  }`}
                >
                  {isEmailVerified ? "Patient vérifié" : "E-mail non vérifié"}
                </span>
                <span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-[#0B63D1]">
                  {loading ? "Chargement..." : memberSince}
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="gp-search-submit rounded-full px-4 py-2 text-xs font-bold text-white"
          >
            Modifier mon profil
          </Link>
        </div>
      </div>

      <div className="gp-profile-content overflow-hidden rounded-[2rem]">
        <div className="gp-profile-tabs flex gap-2 border-b border-[#E5E7EB] px-4 py-4 text-xs font-semibold text-[#6B7280] sm:px-6">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={`whitespace-nowrap rounded-full border px-4 py-2 transition ${
                  isActive
                    ? "border-[#0B63D1] bg-[#EAF2FF] text-[#0B63D1]"
                    : "border-transparent hover:border-[#DCE8F3] hover:bg-[#F7FBFF]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="px-5 py-6 sm:px-6">{children}</div>
      </div>
    </PatientShell>
  );
}

function getMemberSinceLabel(userId?: string, emailVerifiedAt?: string | null) {
  const fromObjectId = userId?.slice(0, 8);
  if (fromObjectId && /^[a-fA-F0-9]{8}$/.test(fromObjectId)) {
    const timestamp = Number.parseInt(fromObjectId, 16) * 1000;
    const year = new Date(timestamp).getUTCFullYear();
    if (Number.isFinite(year) && year > 2000) return `Membre depuis ${year}`;
  }

  if (emailVerifiedAt) {
    const year = new Date(emailVerifiedAt).getUTCFullYear();
    if (Number.isFinite(year)) return `Membre depuis ${year}`;
  }

  return "Membre récent";
}

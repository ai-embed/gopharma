"use client";

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
  const { user } = useUser();

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Utilisateur"
    : "Utilisateur";
  const email = user?.email ?? "utilisateur@example.com";

  return (
    <PatientShell>
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#E5E7EB]" />
            <div>
              <h1 className="text-lg font-semibold">{displayName}</h1>
              <p className="text-sm text-[#6B7280]">{email}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                <span className="rounded-full bg-[#E8FFF1] px-3 py-1 text-[#0F9D58]">
                  Patient vérifié
                </span>
                <span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-[#0B63D1]">
                  Membre depuis 2021
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
          >
            Modifier le profil
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-[#E5E7EB] bg-white">
        <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] px-6 py-4 text-xs font-semibold text-[#6B7280]">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-full border px-4 py-2 ${
                  isActive
                    ? "border-[#0B63D1] bg-[#EAF2FF] text-[#0B63D1]"
                    : "border-transparent"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="px-6 py-6">{children}</div>
      </div>
    </PatientShell>
  );
}

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { TopNav } from "@/components/TopNav";
import { useUser } from "@/lib/useUser";

export default function ProfileView() {
  const { user } = useUser();

  const displayName = useMemo(() => {
    if (!user) return "Utilisateur";
    return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Utilisateur";
  }, [user]);

  const email = user?.email ?? "utilisateur@example.com";

  return (
    <div className="min-h-screen bg-[#F3F6F9] px-6 py-10 text-[#1F1D1B]">
      <div className="mx-auto max-w-5xl space-y-6">
        <TopNav />

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#E5E7EB]" />
              <div>
                <h1 className="text-lg font-semibold">{displayName}</h1>
                <p className="text-sm text-[#6B7280]">{email}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                  <span className="rounded-full bg-[#E8FFF1] px-3 py-1 text-[#0F9D58]">
                    Patient Verifie
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
            <Link
              className="rounded-full border border-[#0B63D1] bg-[#EAF2FF] px-4 py-2 text-[#0B63D1]"
              href="/profile"
            >
              Infos personnelles
            </Link>
            <Link
              className="rounded-full border border-transparent px-4 py-2"
              href="/favorites"
            >
              Favoris
            </Link>
            <Link
              className="rounded-full border border-transparent px-4 py-2"
              href="/history"
            >
              Historique
            </Link>
            <Link
              className="rounded-full border border-transparent px-4 py-2"
              href="/preferences"
            >
              Préférences
            </Link>
          </div>

          <div className="space-y-6 px-6 py-6">
            <section className="space-y-3">
              <h2 className="text-sm font-semibold">Informations de contact</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-[#9CA3AF]">
                    NUMERO DE TELEPHONE
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F6F9] text-[10px] font-semibold text-[#6B7280]">
                      TEL
                    </div>
                    <span>+229 67 12 34 56 78</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-[#9CA3AF]">
                    ADRESSE E-MAIL
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F6F9] text-[10px] font-semibold text-[#6B7280]">
                      MAIL
                    </div>
                    <span>{email}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3 border-t border-[#E5E7EB] pt-6">
              <h2 className="text-sm font-semibold">Adresse</h2>
              <p className="text-[11px] font-semibold text-[#9CA3AF]">
                ADRESSE PRINCIPALE
              </p>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F6F9] text-[10px] font-semibold text-[#6B7280]">
                  ADR
                </div>
                <div>
                  <p>123 Avenue des Champs-Elysees</p>
                  <p className="text-xs text-[#6B7280]">Cotonou, Benin</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

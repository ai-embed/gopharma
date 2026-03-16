"use client";

import Link from "next/link";
import { useMemo } from "react";
import { TopNav } from "@/components/TopNav";
import { useUser } from "@/lib/useUser";

export default function EditProfileForm() {
  const { user } = useUser();

  const displayName = useMemo(() => {
    if (!user) return "Utilisateur";
    return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Utilisateur";
  }, [user]);

  const email = user?.email ?? "utilisateur@example.com";

  return (
    <div className="min-h-screen bg-[#F3F6F9] px-6 py-10 text-[#1F1D1B]">
      <div className="mx-auto max-w-4xl space-y-6">
        <TopNav />

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#E5E7EB]" />
              <div>
                <h1 className="text-lg font-semibold">{displayName}</h1>
                <p className="text-sm text-[#6B7280]">{email}</p>
              </div>
            </div>
            <Link
              href="/profile"
              className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
            >
              Retour au profil
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="text-sm font-semibold">Modifier le profil</h2>
          <p className="mt-2 text-xs text-[#6B7280]">
            Mettez a jour vos informations personnelles.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 text-xs text-[#6B7280]">
              <label className="text-[11px] font-semibold">Prenom</label>
              <input
                defaultValue={user?.firstName ?? "Jean"}
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
              />
            </div>
            <div className="space-y-2 text-xs text-[#6B7280]">
              <label className="text-[11px] font-semibold">Nom</label>
              <input
                defaultValue={user?.lastName ?? "Dupont"}
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
              />
            </div>
            <div className="space-y-2 text-xs text-[#6B7280]">
              <label className="text-[11px] font-semibold">Adresse e-mail</label>
              <input
                defaultValue={email}
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
              />
            </div>
            <div className="space-y-2 text-xs text-[#6B7280]">
              <label className="text-[11px] font-semibold">Telephone</label>
              <input
                defaultValue="+229 67 12 34 56 78"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 text-xs text-[#6B7280]">
              <label className="text-[11px] font-semibold">Adresse</label>
              <input
                defaultValue="123 Avenue des Champs-Elysees"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
              />
            </div>
            <div className="space-y-2 text-xs text-[#6B7280]">
              <label className="text-[11px] font-semibold">Ville</label>
              <input
                defaultValue="Cotonou"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
              />
            </div>
            <div className="space-y-2 text-xs text-[#6B7280]">
              <label className="text-[11px] font-semibold">Pays</label>
              <input
                defaultValue="Benin"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <Link
              href="/profile"
              className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#6B7280]"
            >
              Annuler
            </Link>
            <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

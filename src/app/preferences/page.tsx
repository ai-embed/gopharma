"use client";

import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { useUser } from "@/lib/useUser";

export default function PreferencesPage() {
  const { user } = useUser();

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Utilisateur"
    : "Utilisateur";
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
            <button
              type="button"
              className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
            >
              Modifier le profil
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white">
          <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] px-6 py-4 text-xs font-semibold text-[#6B7280]">
            <Link className="rounded-full border border-transparent px-4 py-2" href="/profile">
              Infos personnelles
            </Link>
            <Link className="rounded-full border border-transparent px-4 py-2" href="/favorites">
              Favoris
            </Link>
            <Link className="rounded-full border border-transparent px-4 py-2" href="/history">
              Historique
            </Link>
            <Link
              className="rounded-full border border-[#0B63D1] bg-[#EAF2FF] px-4 py-2 text-[#0B63D1]"
              href="/preferences"
            >
              Preferences
            </Link>
          </div>

          <div className="space-y-6 px-6 py-6">
            <section className="space-y-3 rounded-2xl border border-[#E5E7EB] p-5">
              <h2 className="text-sm font-semibold">Calendrier d&apos;ordonnance</h2>
              <p className="text-xs text-[#6B7280]">
                Acces rapide a votre planification.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F3F6F9] px-4 py-3 text-xs">
                <span>Gerer votre calendrier</span>
                <button className="rounded-full bg-[#0B63D1] px-3 py-2 text-[11px] font-semibold text-white">
                  Gerer mon calendrier d&apos;ordonnance
                </button>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-[#E5E7EB] p-5">
              <div>
                <h2 className="text-sm font-semibold">Parametres de notification</h2>
                <p className="text-xs text-[#6B7280]">
                  Gere la facon dont vous recevez les alertes et mises a jour.
                </p>
              </div>
              <div className="space-y-3 text-xs text-[#6B7280]">
                {[
                  {
                    title: "Alertes de stock",
                    desc: "Recevoir une notification lorsque vos medicaments sont a nouveau en stock.",
                    checked: true,
                  },
                  {
                    title: "Rappels d'ordonnance",
                    desc: "Recevoir des notifications pour votre calendrier de medicaments.",
                    checked: true,
                  },
                  {
                    title: "Actualites & conseils sante",
                    desc: "Newsletter hebdomadaire avec des conseils et des nouvelles de la pharmacie.",
                    checked: false,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-6 rounded-2xl border border-[#E5E7EB] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#1F1D1B]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#6B7280]">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex h-6 w-11 items-center">
                      <input
                        type="checkbox"
                        defaultChecked={item.checked}
                        className="peer sr-only"
                      />
                      <span className="absolute inset-0 rounded-full bg-[#E5E7EB] peer-checked:bg-[#0B63D1]" />
                      <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                    </label>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-[#E5E7EB] p-5">
              <h2 className="text-sm font-semibold">Securite du compte</h2>
              <p className="text-xs text-[#6B7280]">
                Mettez a jour votre mot de passe et securisez votre compte.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#1F1D1B]">Mot de passe</p>
                  <p className="text-xs text-[#6B7280]">
                    Derniere modification il y a 3 mois
                  </p>
                </div>
                <button className="rounded-full border border-[#E5E7EB] px-4 py-2 text-[11px] font-semibold text-[#1F1D1B]">
                  Changer le mot de passe
                </button>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-[#E5E7EB] p-5">
              <h2 className="text-sm font-semibold">Langue et Region</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 text-xs text-[#6B7280]">
                  <label className="text-[11px] font-semibold">Langue de l&apos;interface</label>
                  <select className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2">
                    <option>Francais (FR)</option>
                    <option>English (EN)</option>
                  </select>
                </div>
                <div className="space-y-2 text-xs text-[#6B7280]">
                  <label className="text-[11px] font-semibold">Fuseau horaire</label>
                  <select className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2">
                    <option>Porto-Novo (GMT+1)</option>
                    <option>Paris (GMT+1)</option>
                    <option>Abidjan (GMT+0)</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-[#FDE2E2] bg-[#FFF5F5] p-5">
              <h2 className="text-sm font-semibold text-[#B91C1C]">
                Confidentialite des donnees
              </h2>
              <p className="text-xs text-[#B91C1C]">
                Autorisez GoPharma a utiliser votre historique de recherche anonymise
                pour ameliorer la prediction de disponibilite des medicaments.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#B91C1C]">Statut: Actif</span>
                <button className="rounded-full border border-[#FCA5A5] px-4 py-2 text-[11px] font-semibold text-[#B91C1C]">
                  Desactiver le partage
                </button>
              </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-[#FDE2E2] bg-[#FFF5F5] p-5">
              <h2 className="text-sm font-semibold text-[#B91C1C]">Zone de danger</h2>
              <p className="text-xs text-[#B91C1C]">
                Une fois votre compte supprime, il n&apos;y a pas de retour en arriere.
              </p>
              <button className="rounded-full border border-[#FCA5A5] px-4 py-2 text-[11px] font-semibold text-[#B91C1C]">
                Supprimer le compte
              </button>
            </section>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#6B7280]">
                Annuler
              </button>
              <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

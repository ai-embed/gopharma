"use client";

import Link from "next/link";
import ProfileShell from "@/components/ProfileShell";

export default function PreferencesView() {
  return (
    <ProfileShell activeTab="preferences">
      <div className="space-y-6">
        <section className="space-y-3 rounded-2xl border border-[#E5E7EB] p-5">
          <h2 className="text-sm font-semibold">
            Calendrier d&apos;ordonnance
          </h2>
          <p className="text-xs text-[#6B7280]">
            Accès rapide à votre planification.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F3F6F9] px-4 py-3 text-xs">
            <span>Gérer votre calendrier</span>
            <Link
              href="/reminders/new"
              className="rounded-full bg-[#0B63D1] px-3 py-2 text-[11px] font-semibold text-white"
            >
              Gérer mon calendrier d&apos;ordonnance
            </Link>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-[#E5E7EB] p-5">
          <div>
            <h2 className="text-sm font-semibold">Paramètres de notification</h2>
            <p className="text-xs text-[#6B7280]">
              Gère la façon dont vous recevez les alertes et mises à jour.
            </p>
          </div>
          <div className="space-y-3 text-xs text-[#6B7280]">
            {[
              {
                title: "Alertes de stock",
                desc: "Recevoir une notification lorsque vos médicaments sont à nouveau en stock.",
                checked: true,
              },
              {
                title: "Rappels d'ordonnance",
                desc: "Recevoir des notifications pour votre calendrier de médicaments.",
                checked: true,
              },
              {
                title: "Actualités & conseils santé",
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
          <h2 className="text-sm font-semibold">Sécurité du compte</h2>
          <p className="text-xs text-[#6B7280]">
            Mettez à jour votre mot de passe et sécurisez votre compte.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#1F1D1B]">
                Mot de passe
              </p>
              <p className="text-xs text-[#6B7280]">
                Dernière modification il y a 3 mois
              </p>
            </div>
            <button className="rounded-full border border-[#E5E7EB] px-4 py-2 text-[11px] font-semibold text-[#1F1D1B]">
              Changer le mot de passe
            </button>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-[#E5E7EB] p-5">
          <h2 className="text-sm font-semibold">Langue &amp; région</h2>
          <p className="text-xs text-[#6B7280]">
            Choisissez la langue et le format d&apos;affichage.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 text-xs text-[#6B7280]">
              <label className="text-[11px] font-semibold">Langue</label>
              <select className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2">
                <option>Français</option>
                <option>English</option>
              </select>
            </div>
            <div className="space-y-2 text-xs text-[#6B7280]">
              <label className="text-[11px] font-semibold">Fuseau horaire</label>
              <select className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2">
                <option>Africa/Porto-Novo</option>
                <option>Europe/Paris</option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-[#E5E7EB] p-5">
          <h2 className="text-sm font-semibold">Confidentialité</h2>
          <p className="text-xs text-[#6B7280]">
            Contrôlez le partage des données et la visibilité du compte.
          </p>
          <div className="space-y-3">
            {[
              {
                title: "Historique de recherche",
                desc: "Conserver l'historique des recherches pour améliorer les recommandations.",
              },
              {
                title: "Partage des données",
                desc: "Partager des statistiques anonymisées pour améliorer le service.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-6 rounded-2xl border border-[#E5E7EB] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-[#6B7280]">{item.desc}</p>
                </div>
                <label className="relative inline-flex h-6 w-11 items-center">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <span className="absolute inset-0 rounded-full bg-[#E5E7EB] peer-checked:bg-[#0B63D1]" />
                  <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-[#FDE2E2] bg-[#FFF5F5] p-5">
          <h2 className="text-sm font-semibold text-[#B91C1C]">Zone de danger</h2>
          <p className="text-xs text-[#B91C1C]">
            Supprimer définitivement votre compte GoPharma.
          </p>
          <Link
            href="/account/delete"
            className="inline-flex rounded-full bg-[#EF4444] px-4 py-2 text-[11px] font-semibold text-white"
          >
            Supprimer mon compte
          </Link>
        </section>
      </div>
    </ProfileShell>
  );
}

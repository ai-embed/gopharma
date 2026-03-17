const notificationSettings = [
  { label: "Alertes stock critique", enabled: true },
  { label: "Rappels expirations", enabled: true },
  { label: "Nouvelles commandes", enabled: false },
];

export default function PharmacySettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Parametres de la Pharmacie</h1>
          <p className="mt-1 text-xs text-[#6B7280]">
            Gerer les informations, la securite et les preferences de
            notification.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
            Annuler
          </button>
          <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
            Enregistrer les modifications
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2FF] text-sm font-semibold text-[#0B63D1]">
                  CVS
                </div>
                <div>
                  <p className="text-sm font-semibold">Pharmacie CVS #4290</p>
                  <p className="text-xs text-[#6B7280]">
                    Licence: LIC-992831
                  </p>
                </div>
              </div>
              <button className="text-xs font-semibold text-[#0B63D1]">
                Modifier le logo
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] text-[#6B7280]">Nom de la pharmacie</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs">
                  Pharmacie CVS #4290
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Numero IFU</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs">
                  000-000-000
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Email professionnel</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs">
                  contact@pharmacie.com
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Telephone</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs">
                  +229 67 00 00 00
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Adresse &amp; Localisation</h2>
              <button className="text-xs font-semibold text-[#0B63D1]">
                Mettre a jour la carte
              </button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <p className="text-[11px] text-[#6B7280]">
                  Adresse de la pharmacie
                </p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                  123 Rue de la Pharmacie, Cotonou, Benin
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Latitude</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs">
                  6.3654
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Longitude</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs">
                  2.4342
                </div>
              </div>
            </div>
            <div className="mt-4 h-40 rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#9CA3AF] flex items-center justify-center">
              Apercu carte indisponible
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Securite du compte</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] text-[#6B7280]">
                  Mot de passe actuel
                </p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs">
                  ********
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Nouveau mot de passe</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs">
                  ********
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">
                  Confirmer le mot de passe
                </p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs">
                  ********
                </div>
              </div>
            </div>
            <button className="mt-4 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
              Mettre a jour le mot de passe
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Notifications</h2>
            <p className="mt-2 text-xs text-[#6B7280]">
              Controler les alertes automatiques envoyees par la plateforme.
            </p>
            <div className="mt-4 space-y-3">
              {notificationSettings.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2 text-xs"
                >
                  <span className="text-[#1F1D1B]">{item.label}</span>
                  <button
                    type="button"
                    aria-pressed={item.enabled}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full px-0.5 transition ${
                      item.enabled ? "bg-[#0B63D1]" : "bg-[#D1D5DB]"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-semibold transition ${
                        item.enabled
                          ? "translate-x-5 text-[#0B63D1]"
                          : "translate-x-0 text-[#9CA3AF]"
                      }`}
                    >
                      {item.enabled ? "✓" : ""}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#FDE2E2] bg-[#FFF5F5] p-5 text-xs text-[#B91C1C]">
            <h2 className="text-sm font-semibold text-[#B91C1C]">
              Zone de danger
            </h2>
            <p className="mt-2">
              Desactiver temporairement le compte pharmacie ou demander une
              suppression definitive.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button className="rounded-full border border-[#FCA5A5] bg-white px-4 py-2 text-xs font-semibold text-[#B91C1C]">
                Desactiver le compte
              </button>
              <button className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white">
                Demander la suppression
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-[#9CA3AF]">
        (c) 2023 PharmaFinder Inc. Panneau de Controle Super Admin v2.4.0
      </p>
    </div>
  );
}

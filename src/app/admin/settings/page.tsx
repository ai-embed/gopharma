const notificationOptions = [
  { label: "Alertes critiques systeme", enabled: true },
  { label: "Nouvelles inscriptions", enabled: true },
  { label: "Rapports hebdomadaires", enabled: false },
];

const securityOptions = [
  { label: "Forcer le 2FA admin", enabled: true },
  { label: "Sessions expirees apres 30 jours", enabled: true },
  { label: "Blocage apres 5 tentatives", enabled: false },
];

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FA] text-[#1F1D1B]">
      <div className="flex">
        <aside className="flex w-64 flex-col border-r border-[#E5E7EB] bg-white px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0B63D1] text-xs font-semibold text-white">
              +
            </div>
            <div>
              <p className="text-sm font-semibold">GoPharma</p>
              <p className="text-[11px] text-[#6B7280]">Tableau de bord</p>
            </div>
          </div>

          <p className="mt-8 text-[10px] font-semibold uppercase text-[#9CA3AF]">
            Principal
          </p>
          <nav className="mt-3 space-y-1 text-xs font-semibold text-[#6B7280]">
            {[
              "Tableau de bord",
              "Utilisateurs",
              "Pharmacies",
              "Base Medicaments",
              "File de validation",
            ].map((item) => (
              <button
                key={item}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[#F3F6F9]"
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {item}
              </button>
            ))}
          </nav>

          <p className="mt-6 text-[10px] font-semibold uppercase text-[#9CA3AF]">
            Analytique
          </p>
          <nav className="mt-3 space-y-1 text-xs font-semibold text-[#6B7280]">
            {["Rapports", "Croissance"].map((item) => (
              <button
                key={item}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[#F3F6F9]"
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {item}
              </button>
            ))}
          </nav>

          <p className="mt-6 text-[10px] font-semibold uppercase text-[#9CA3AF]">
            Systeme
          </p>
          <nav className="mt-3 space-y-1 text-xs font-semibold text-[#6B7280]">
            {["Parametres", "Journaux d'audit"].map((item) => (
              <button
                key={item}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                  item === "Parametres"
                    ? "bg-[#EAF2FF] text-[#0B63D1]"
                    : "hover:bg-[#F3F6F9]"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-xs text-[#6B7280]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF2FF] text-[11px] font-semibold text-[#0B63D1]">
              AM
            </span>
            <div>
              <p className="text-[11px] font-semibold text-[#1F1D1B]">
                Alex Morgan
              </p>
              <p className="text-[10px]">Super Admin</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold">Parametres Admin</h1>
              <p className="mt-1 text-xs text-[#6B7280]">
                Gerer les preferences globales, la securite et les integrations.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
                Annuler
              </button>
              <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                Enregistrer
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="text-sm font-semibold">Informations Generales</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-[11px] text-[#6B7280]">
                      Nom de la plateforme
                    </p>
                    <div className="mt-2 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                      GoPharma
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B7280]">Fuseau horaire</p>
                    <div className="mt-2 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                      Africa/Porto-Novo
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B7280]">
                      Langue par defaut
                    </p>
                    <div className="mt-2 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                      Francais
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B7280]">Support email</p>
                    <div className="mt-2 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                      support@gopharma.app
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="text-sm font-semibold">Integrations</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                    <p className="font-semibold">SMTP</p>
                    <p className="mt-1 text-[#6B7280]">smtp.gmail.com</p>
                    <p className="mt-2 text-[10px] text-emerald-600">
                      Connecte
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                    <p className="font-semibold">Google Maps</p>
                    <p className="mt-1 text-[#6B7280]">API key active</p>
                    <p className="mt-2 text-[10px] text-emerald-600">
                      Connecte
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="text-sm font-semibold">Retention des donnees</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                    <p className="font-semibold">Journaux systeme</p>
                    <p className="mt-1 text-[#6B7280]">180 jours</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                    <p className="font-semibold">Sauvegardes</p>
                    <p className="mt-1 text-[#6B7280]">7 generations</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="text-sm font-semibold">Notifications</h2>
                <p className="mt-2 text-xs text-[#6B7280]">
                  Controler les alertes envoyees aux admins.
                </p>
                <div className="mt-4 space-y-3">
                  {notificationOptions.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2 text-xs"
                    >
                      <span>{item.label}</span>
                      <div
                        className={`flex h-5 w-10 items-center rounded-full px-0.5 ${
                          item.enabled ? "bg-[#0B63D1]" : "bg-[#D1D5DB]"
                        }`}
                      >
                        <div
                          className={`h-4 w-4 rounded-full bg-white shadow ${
                            item.enabled ? "translate-x-5" : ""
                          } transition`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="text-sm font-semibold">Securite</h2>
                <div className="mt-4 space-y-3">
                  {securityOptions.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2 text-xs"
                    >
                      <span>{item.label}</span>
                      <div
                        className={`flex h-5 w-10 items-center rounded-full px-0.5 ${
                          item.enabled ? "bg-[#0B63D1]" : "bg-[#D1D5DB]"
                        }`}
                      >
                        <div
                          className={`h-4 w-4 rounded-full bg-white shadow ${
                            item.enabled ? "translate-x-5" : ""
                          } transition`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#FDE2E2] bg-[#FFF5F5] p-5 text-xs text-[#B91C1C]">
                <h2 className="text-sm font-semibold">Maintenance</h2>
                <p className="mt-2">
                  Activer le mode maintenance pour suspendre temporairement
                  l&apos;acces a la plateforme.
                </p>
                <button className="mt-4 rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white">
                  Activer la maintenance
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

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
    <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold">Parametres Admin</h1>
              <p className="mt-1 text-xs text-[#6B7280]">
                Gerer les preferences globales, la securite et les integrations.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
                Annuler
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M6 12.5l3.5 3.5L18 8.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Enregistrer
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M7 4h10a2 2 0 0 1 2 2v10.5a3.5 3.5 0 0 1-3.5 3.5H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.5 9.5h7M8.5 13h5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <h2 className="text-sm font-semibold">
                    Informations Generales
                  </h2>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-[11px] text-[#6B7280]">
                      Nom de la plateforme
                    </p>
                    <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                      GoPharma
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B7280]">Fuseau horaire</p>
                    <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                      Africa/Porto-Novo
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B7280]">
                      Langue par defaut
                    </p>
                    <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                      Francais
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B7280]">Support email</p>
                    <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                      support@gopharma.app
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M6 12h12M12 6v12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </span>
                  <h2 className="text-sm font-semibold">Integrations</h2>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                    <p className="font-semibold">SMTP</p>
                    <p className="mt-1 text-[#6B7280]">smtp.gmail.com</p>
                    <p className="mt-2 text-[10px] text-emerald-600">
                      Connecte
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                    <p className="font-semibold">Google Maps</p>
                    <p className="mt-1 text-[#6B7280]">API key active</p>
                    <p className="mt-2 text-[10px] text-emerald-600">
                      Connecte
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M9 9h6M9 13h6M9 17h4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <h2 className="text-sm font-semibold">Retention des donnees</h2>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                    <p className="font-semibold">Journaux systeme</p>
                    <p className="mt-1 text-[#6B7280]">180 jours</p>
                  </div>
                  <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                    <p className="font-semibold">Sauvegardes</p>
                    <p className="mt-1 text-[#6B7280]">7 generations</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M12 4a5 5 0 0 1 5 5v2.2l1.2 2.4c.4.8-.1 1.4-1 1.4H6.8c-.9 0-1.4-.6-1-1.4L7 11.2V9a5 5 0 0 1 5-5z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.5 19a2.5 2.5 0 0 0 5 0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <h2 className="text-sm font-semibold">Notifications</h2>
                </div>
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

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M12 4l7 3v5c0 4.5-3 7.5-7 8-4-0.5-7-3.5-7-8V7l7-3z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 9v4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
                    </svg>
                  </span>
                  <h2 className="text-sm font-semibold">Securite</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {securityOptions.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2 text-xs"
                    >
                      <span>{item.label}</span>
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
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FDE2E2] text-[#B91C1C]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M12 5v8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="17" r="1.2" fill="currentColor" />
                      <path
                        d="M12 3l9 16H3L12 3z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h2 className="text-sm font-semibold">Maintenance</h2>
                </div>
                <p className="mt-2">
                  Activer le mode maintenance pour suspendre temporairement
                  l&apos;acces a la plateforme.
                </p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M6 12h12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  Activer la maintenance
                </button>
              </div>
            </div>
          </div>
            </div>
  );
}

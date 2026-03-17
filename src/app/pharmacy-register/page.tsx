export const dynamic = "force-dynamic";

export default function PharmacyRegisterPage() {
  return (
    <div className="min-h-screen bg-[#F3F6F9] px-4 py-10 text-[#1F1D1B] md:py-16">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0B63D1] text-sm font-semibold text-white">
              +
            </span>
            <span className="text-sm font-semibold">PharmaFinder</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#6B7280]">
            <span>Connexion</span>
            <button className="rounded-full bg-[#0B63D1] px-4 py-2 font-semibold text-white">
              S&apos;inscrire
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <h1 className="text-2xl font-semibold">
            Creez votre compte Pharmacie
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Rejoignez notre reseau pour gerer votre catalogue, vos stocks et
            presenter votre etablissement.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#EAF2FF] px-3 py-2 text-[11px] font-semibold text-[#0B63D1]">
            Compte soumis a validation administrative
          </span>
        </div>

        <div className="mt-8 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:p-8">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#1F2937]">
            <span className="text-base text-[#0B63D1]">G</span>
            S&apos;inscrire avec Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">
              Ou continuer avec un email
            </span>
            <div className="h-px flex-1 bg-[#E5E7EB]" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-semibold text-[#6B7280]">
                Nom de la Pharmacie
              </label>
              <input
                placeholder="ex. Pharmacie de la Sante"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#6B7280]">
                Numero IFU (ID Fiscal)
              </label>
              <input
                placeholder="000-000-000"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-[#6B7280]">
                Adresse de l&apos;Entreprise
              </label>
              <input
                placeholder="123 Rue de la Pharmacie, Ville, Pays"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#6B7280]">
                Email Professionnel
              </label>
              <input
                placeholder="contact@pharmacie.com"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#6B7280]">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold">Horaires d&apos;Ouverture</h2>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-[#6B7280]">
                  EN SEMAINE
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="08:00 AM"
                    className="rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                  />
                  <input
                    placeholder="06:00 PM"
                    className="rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-[#6B7280]">
                  WEEK-END
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="09:00 AM"
                    className="rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                  />
                  <input
                    placeholder="02:00 PM"
                    className="rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                  />
                </div>
              </div>
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs text-[#6B7280]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#CBD5E1] text-[#0B63D1]"
              />
              Ouvert 24/7 (Service d&apos;Urgence)
            </label>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold">
              Photo de la Pharmacie / Devanture
            </h2>
            <div className="mt-3 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-[#F8FAFC] px-4 py-8 text-center text-xs text-[#6B7280]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0B63D1]">
                +
              </div>
              <p className="mt-3 font-semibold text-[#0B63D1]">
                Telecharger un fichier ou glisser-deposer
              </p>
              <p className="mt-1 text-[11px]">
                PNG, JPG, GIF jusqu&apos;a 10MB
              </p>
            </div>
          </div>

          <label className="mt-6 flex items-start gap-2 text-xs text-[#6B7280]">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-[#0B63D1]"
            />
            <span>
              J&apos;accepte les Conditions Generales. Je comprends que mon
              compte sera en attente de validation par un administrateur.
            </span>
          </label>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <button className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
              Annuler
            </button>
            <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
              Creer le compte
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] text-[#9CA3AF]">
          (c) 2023 PharmaFinder. Tous droits reserves.
        </p>
      </div>
    </div>
  );
}

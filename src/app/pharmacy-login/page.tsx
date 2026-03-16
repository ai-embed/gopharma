export default function PharmacyLoginPage() {
  return (
    <div className="min-h-screen bg-[#F3F6F9] px-4 py-10 text-[#1F1D1B] md:py-16">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-white shadow-sm">
        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
          <div className="px-6 py-10 md:px-10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0B63D1] text-sm font-semibold text-white">
                +
              </span>
              <span className="text-sm font-semibold">PharmaFinder</span>
            </div>

            <div className="mt-6 inline-flex rounded-full bg-[#F3F4F6] p-1 text-xs font-semibold text-[#6B7280]">
              <span className="rounded-full bg-white px-4 py-2 text-[#0B63D1]">
                Connexion Pharmacie
              </span>
            </div>

            <h1 className="mt-6 text-2xl font-semibold">Bon retour</h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Veuillez saisir vos identifiants professionnels pour acceder a
              votre tableau de bord.
            </p>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-[#6B7280]"
                >
                  Email Professionnel
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    @
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="pharmacie@example.com"
                    className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-3 pl-9 pr-4 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-[#6B7280]"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    *
                  </span>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-3 pl-9 pr-4 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#CBD5E1] text-[#0B63D1] focus:ring-blue-200"
                  />
                  Se souvenir de moi
                </label>
                <button className="font-semibold text-[#0B63D1]">
                  Mot de passe oublie ?
                </button>
              </div>

              <button className="w-full rounded-2xl bg-[#0B63D1] py-3 text-sm font-semibold text-white transition hover:bg-[#0A58BA]">
                Se connecter
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E5E7EB]" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">
                  Ou continuer avec
                </span>
                <div className="h-px flex-1 bg-[#E5E7EB]" />
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#1F2937]">
                <span className="text-base text-[#0B63D1]">G</span>
                Google
              </button>

              <p className="text-center text-xs text-[#6B7280]">
                Pas encore de compte professionnel ?{" "}
                <span className="font-semibold text-[#0B63D1]">
                  Inscrivez votre Pharmacie
                </span>
              </p>
            </div>
          </div>

          <div className="relative flex flex-col justify-between bg-gradient-to-b from-[#F1F8FF] via-[#F7FBFF] to-white px-6 py-10 md:px-10">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white/80 p-4 text-xs text-[#6B7280]">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF2FF] text-[#0B63D1]">
                  i
                </span>
                <p className="font-semibold text-[#1F1D1B]">
                  Validation de Compte Requise
                </p>
              </div>
              <p className="mt-2">
                Votre compte doit etre valide par un administrateur avant votre
                premiere connexion. Cela garantit la securite et la verification
                de toutes les pharmacies professionnelles sur notre plateforme.
              </p>
              <button className="mt-3 font-semibold text-[#0B63D1]">
                Verifier le statut de validation →
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">
                Gerez votre pharmacie efficacement
              </h2>
              <div className="space-y-3 text-sm text-[#6B7280]">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </span>
                  Gestion des stocks en temps reel
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    o
                  </span>
                  Mise a jour instantanee des horaires &amp; disponibilites
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    *
                  </span>
                  Verification IFU &amp; Professionnelle
                </div>
              </div>
            </div>

            <div className="mt-10 h-40 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#BBD3DE] via-[#8DB0C2] to-[#5F7E91]" />
          </div>
        </div>
      </div>
    </div>
  );
}

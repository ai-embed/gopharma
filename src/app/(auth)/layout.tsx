import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6F3EE] text-[#1F1D1B]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="absolute -right-16 top-32 h-64 w-64 rounded-full bg-orange-200/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-100/70 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-900 text-white">
            GP
          </span>
          <span className="font-[var(--font-fraunces)] text-2xl">GoPharma</span>
        </Link>
        <div className="hidden items-center gap-3 text-sm text-[#3D3833] sm:flex">
          <span className="rounded-full border border-[#D7CEC3] bg-white/80 px-3 py-1">
            Backend ready
          </span>
          <span className="rounded-full border border-[#D7CEC3] bg-white/80 px-3 py-1">
            Secure auth
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-120px)] w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="order-2 lg:order-1">
          <div className="rounded-3xl border border-[#E4DDD4] bg-white/70 p-8 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.25)]">
            <h1 className="text-3xl font-semibold leading-tight text-[#1F1D1B] md:text-4xl">
              Une plateforme claire, fiable et humaine pour connecter patients et
              pharmacies.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#4E4741] md:text-base">
              Centralisez les informations, la disponibilité des produits et les
              alertes importantes. L&apos;expérience est pensée pour être rapide,
              conforme et rassurante.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Recherche précise",
                  body: "Filtrage par distance, disponibilité et horaires en temps réel.",
                },
                {
                  title: "Traçabilité",
                  body: "Historique des mouvements et audits consolidés.",
                },
                {
                  title: "Notifications utiles",
                  body: "Alertes stocks bas et rappels adaptés aux patients.",
                },
                {
                  title: "Sécurité",
                  body: "Authentification robuste avec vérification email.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#E9E1D7] bg-white p-4"
                >
                  <h3 className="text-sm font-semibold text-[#1F1D1B]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#5B544E]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-[#5B544E]">
            <span className="rounded-full border border-[#E4DDD4] bg-white/70 px-3 py-1">
              Données chiffrées
            </span>
            <span className="rounded-full border border-[#E4DDD4] bg-white/70 px-3 py-1">
              Multi-langue
            </span>
            <span className="rounded-full border border-[#E4DDD4] bg-white/70 px-3 py-1">
              API temps réel
            </span>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="rounded-3xl border border-[#E4DDD4] bg-white p-8 shadow-[0_28px_80px_-48px_rgba(0,0,0,0.35)]">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}

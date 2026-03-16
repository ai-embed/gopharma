const suggestions = [
  {
    name: "Pharmacie de la Ville",
    distance: "0.2km",
    status: "En Stock",
    price: "3.50€",
  },
  {
    name: "Croix Verte Medicaments",
    distance: "1.5km",
    status: "Ferme Bientot",
    price: "4.10€",
  },
  {
    name: "Sante Centre-Ville",
    distance: "2.0km",
    status: "En Stock",
    price: "4.90€",
  },
];

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#1F1D1B]">
      <div className="flex">
        <aside className="flex w-64 flex-col border-r border-[#E5E7EB] bg-white px-5 py-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0B63D1]">
            <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#0B63D1] text-xs font-semibold text-white">
              +
            </span>
            GoPharma
          </div>

          <button className="mt-6 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-[#0B63D1]">
            + Nouvelle Consultation
          </button>

          <p className="mt-6 text-[10px] font-semibold uppercase text-[#9CA3AF]">
            Aujourd&apos;hui
          </p>
          <div className="mt-3 space-y-2 text-xs text-[#6B7280]">
            <div className="rounded-2xl bg-[#F3F4F6] px-3 py-2">
              Recherche Ibuprofene
            </div>
          </div>

          <div className="mt-auto flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-xs text-[#6B7280]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF2FF] text-[11px] font-semibold text-[#0B63D1]">
              AJ
            </span>
            <div>
              <p className="text-[11px] font-semibold text-[#1F1D1B]">
                Alex Johnson
              </p>
              <p className="text-[10px]">Membre Premium</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-8 py-8">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>PharmaBot</span>
            <span>Aujourd&apos;hui, 10:23</span>
          </div>

          <div className="mt-6 space-y-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF2FF] text-[#0B63D1]">
                +
              </div>
              <div className="max-w-2xl rounded-2xl bg-white px-4 py-3 text-sm text-[#1F1D1B] shadow-sm">
                Bonjour Alex, je suis pret a vous aider a trouver des
                medicaments ou a analyser vos ordonnances. Comment puis-je vous
                aider aujourd&apos;hui ?
              </div>
            </div>

            <div className="flex items-start justify-end gap-3">
              <div className="max-w-2xl rounded-2xl bg-[#0B63D1] px-4 py-3 text-sm text-white shadow-sm">
                Ou puis-je trouver de l&apos;Ibuprofene a moins de 5€ ?
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-xs font-semibold text-[#6B7280]">
                AJ
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF2FF] text-[#0B63D1]">
                +
              </div>
              <div className="max-w-2xl rounded-2xl bg-white px-4 py-3 text-sm text-[#1F1D1B] shadow-sm">
                J&apos;ai trouve 3 pharmacies a proximite qui ont de
                l&apos;Ibuprofene 400mg en stock pour moins de 5€. Voici les
                meilleures options basees sur votre position actuelle :
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 font-semibold text-emerald-600">
                      {item.price}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold">{item.name}</p>
                  <div className="mt-2 text-xs text-[#6B7280]">
                    <span>{item.distance}</span> • {item.status}
                  </div>
                  <button className="mt-4 w-full rounded-full border border-[#E5E7EB] py-2 text-xs font-semibold text-[#1F2937]">
                    Voir le Profil →
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs text-[#9CA3AF]">
            Posez une question sur les medicaments ou pharmacies...
          </div>
          <p className="mt-4 text-center text-[10px] text-[#9CA3AF]">
            PharmaBot peut faire des erreurs. Veuillez verifier les informations
            medicales importantes.
          </p>
        </main>
      </div>
    </div>
  );
}

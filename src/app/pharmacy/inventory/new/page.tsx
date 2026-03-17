export default function PharmacyInventoryNewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">
          Enregistrement Manuel de Produit
        </h1>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <div className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M7 3.5h7l3 3V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 3.5V7h3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 12h8M8 16h6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <h2 className="text-sm font-semibold">
                Informations sur le Produit
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Nom du produit
                </label>
                <input
                  placeholder="ex: Doliprane 1000mg"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Nom scientifique / Molecule
                </label>
                <input
                  placeholder="ex: Paracetamol"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Catégorie
                </label>
                <select className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm">
                  <option>Selectionner une categorie</option>
                  <option>Analgesiques</option>
                  <option>Antibiotiques</option>
                  <option>Respiratoire</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Code-barres{" "}
                  <span className="text-[10px] font-medium text-[#9CA3AF]">
                    (Optionnel)
                  </span>
                </label>
                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 7v10M9 7v10M15 7v10M19 7v10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3 5h4M17 5h4M3 19h4M17 19h4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    placeholder="Scanner ou saisir le code"
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M4.5 8.5h15v9a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-9z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.5 8.5V6.8A2.8 2.8 0 0 1 10.3 4h3.4a2.8 2.8 0 0 1 2.8 2.8v1.7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 13h8M8 16h5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <h2 className="text-sm font-semibold">Stock et Prix</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Quantite initiale
                </label>
                <input
                  placeholder="0"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Prix unitaire
                </label>
                <input
                  placeholder="€ 0.00"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Date d&apos;expiration
                </label>
                <input
                  placeholder="mm/dd/yyyy"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
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
                  Instructions de Stockage
                </h2>
              </div>
              <textarea
                placeholder="ex: Conserver dans un endroit frais et sec, a moins de 25°C. Tenir a l'ecart de la lumiere directe du soleil."
                className="min-h-[140px] w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#6B7280]"
              />
              <p className="text-right text-[10px] text-[#9CA3AF]">
                Max 500 caracteres
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M6 5.5h12a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 17V7A1.5 1.5 0 0 1 6 5.5z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M8 14l2.8-3 2.3 2.2 2.9-3.3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                  </svg>
                </span>
                <h2 className="text-sm font-semibold">Photo du Produit</h2>
              </div>
              <div className="flex h-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-[#F8FAFC] text-center text-xs text-[#6B7280]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0B63D1]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                      d="M12 5v9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8.5 8.5L12 5l3.5 3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 19h14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="mt-2 font-semibold text-[#0B63D1]">
                  Telecharger un fichier
                </p>
                <p className="text-[11px]">ou glisser-deposer</p>
                <p className="text-[10px] text-[#9CA3AF]">
                  PNG, JPG, GIF jusqu&apos;a 10MB
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
              Annuler
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
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
              Enregistrer le Produit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                o
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
                  className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Nom scientifique / Molecule
                </label>
                <input
                  placeholder="ex: Paracetamol"
                  className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Categorie
                </label>
                <select className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm">
                  <option>Selectionner une categorie</option>
                  <option>Analgesiques</option>
                  <option>Antibiotiques</option>
                  <option>Respiratoire</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Code-barres (Optionnel)
                </label>
                <input
                  placeholder="Scanner ou saisir le code"
                  className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                o
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
                  className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Prix unitaire
                </label>
                <input
                  placeholder="€ 0.00"
                  className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Date d&apos;expiration
                </label>
                <input
                  placeholder="mm/dd/yyyy"
                  className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                  o
                </span>
                <h2 className="text-sm font-semibold">
                  Instructions de Stockage
                </h2>
              </div>
              <div className="rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#6B7280]">
                ex: Conserver dans un endroit frais et sec, a moins de 25°C.
                Tenir a l&apos;ecart de la lumiere directe du soleil.
              </div>
              <p className="text-right text-[10px] text-[#9CA3AF]">
                Max 500 caracteres
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                  o
                </span>
                <h2 className="text-sm font-semibold">Photo du Produit</h2>
              </div>
              <div className="flex h-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-[#F8FAFC] text-center text-xs text-[#6B7280]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0B63D1]">
                  +
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
            <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
              Enregistrer le Produit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

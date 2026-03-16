"use client";

const stats = [
  { label: "Total Produits", value: "1,284" },
  { label: "Stock Faible", value: "12", badge: "ALERTES" },
  { label: "Rupture de Stock", value: "4" },
  { label: "Expiration Proche", value: "28" },
];

const products = [
  {
    name: "Paracetamol 500mg",
    ref: "REF-98321",
    category: "Analgesique",
    price: "$4.50",
    stock: "8",
    status: "BAS",
    subtitle: "Boite 20 Comprimes",
    available: true,
  },
  {
    name: "Amoxicilline 250mg",
    ref: "REF-11402",
    category: "Antibiotique",
    price: "$12.90",
    stock: "152",
    status: "OK",
    subtitle: "Suspension 100ml",
    available: true,
  },
  {
    name: "Vitamine C + Zinc",
    ref: "REF-55928",
    category: "Complements",
    price: "$18.25",
    stock: "0",
    status: "VIDE",
    subtitle: "Effervescent x30",
    available: false,
  },
  {
    name: "Sirop Guaifenesine",
    ref: "REF-22345",
    category: "Respiratoire",
    price: "$8.75",
    stock: "45",
    status: "OK",
    subtitle: "Bouteille 120ml",
    available: true,
  },
];

export default function PharmacyInventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Inventaire des Produits</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
          >
            <p className="text-xs text-[#6B7280]">{item.label}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xl font-semibold">{item.value}</span>
              {item.badge ? (
                <span className="rounded-full bg-rose-100 px-2 py-1 text-[10px] font-semibold text-rose-600">
                  {item.badge}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-[#6B7280]">
          <span>Trier par:</span>
          <select className="rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]">
            <option>Plus Recent</option>
            <option>Stock Bas</option>
            <option>Expiration Proche</option>
          </select>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-sm leading-none">
            +
          </span>
          Ajouter un Produit
        </button>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M20 20l-3.5-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              placeholder="Rechercher par nom, reference ou code-barres..."
              className="w-full rounded-full border border-[#E5E7EB] py-2 pl-10 pr-4 text-xs"
            />
          </div>
          <select className="rounded-full border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#1F1D1B]">
            <option>Toutes Categories</option>
          </select>
          <button className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#1F1D1B]">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-[#6B7280]"
              aria-hidden="true"
            >
              <path
                d="M4 7h16M7 12h10M10 17h4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            Plus de Filtres
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#E5E7EB]">
          <table className="w-full text-xs">
            <thead className="bg-[#F8FAFC] text-[#6B7280]">
              <tr>
                <th className="px-4 py-3 text-left">IMAGE</th>
                <th className="px-4 py-3 text-left">NOM DU PRODUIT</th>
                <th className="px-4 py-3 text-left">REFERENCE</th>
                <th className="px-4 py-3 text-left">CATEGORIE</th>
                <th className="px-4 py-3 text-left">PRIX</th>
                <th className="px-4 py-3 text-left">STOCK</th>
                <th className="px-4 py-3 text-left">DISPONIBILITE</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.ref} className="border-t border-[#E5E7EB]">
                  <td className="px-4 py-3">
                    <div
                      className={`h-9 w-9 rounded-xl ${
                        product.status === "VIDE"
                          ? "bg-gradient-to-br from-amber-100 to-amber-300"
                          : product.status === "BAS"
                          ? "bg-gradient-to-br from-emerald-200 to-emerald-500"
                          : "bg-gradient-to-br from-sky-200 to-sky-500"
                      }`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-[10px] text-[#6B7280]">
                      {product.subtitle}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{product.ref}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{product.category}</td>
                  <td className="px-4 py-3">{product.price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        product.status === "BAS" ? "text-rose-600" : ""
                      }`}
                    >
                      {product.stock}
                    </span>{" "}
                    {product.status === "BAS" ? (
                      <span className="ml-2 rounded-full bg-rose-100 px-2 py-1 text-[10px] font-semibold text-rose-600">
                        BAS
                      </span>
                    ) : product.status === "VIDE" ? (
                      <span className="ml-2 rounded-full bg-[#E5E7EB] px-2 py-1 text-[10px] font-semibold text-[#6B7280]">
                        VIDE
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-5 w-10 items-center rounded-full px-0.5 ${
                          product.available ? "bg-[#0B63D1]" : "bg-[#D1D5DB]"
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-semibold ${
                            product.available ? "translate-x-5" : ""
                          } transition`}
                        >
                          {product.available ? "v" : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-[#6B7280]">
          <span>Affichage de 1 a 4 sur 1,284 produits</span>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
              {"<"}
            </button>
            <button className="rounded-full bg-[#0B63D1] px-3 py-1 text-white">
              1
            </button>
            <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
              2
            </button>
            <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
              ...
            </button>
            <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
              32
            </button>
            <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
              {">"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#FDE2E2] bg-[#FFF5F5] px-4 py-4 text-xs text-[#B91C1C]">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FDE2E2] text-base">
            !
          </span>
          <div>
            <p className="font-semibold">
              Alerte Systeme : Niveaux de Stock Critiques
            </p>
            <p className="mt-2">
              Il y a 12 articles actuellement sous le seuil de stock de
              securite. Veuillez examiner les commandes pour eviter les
              penuries.
            </p>
            <button className="mt-3 text-xs font-semibold text-[#B91C1C]">
              Voir le rapport de stock faible
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-[#9CA3AF]">
        (c) 2024 GoPharma Inc. Tous droits reserves.
      </p>
    </div>
  );
}

"use client";

import { TopNav } from "@/components/TopNav";

const gallery = [
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1580281657521-2f1c0a91f1b7?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1580281658629-81a3a364c0fa?auto=format&fit=crop&w=600&q=80",
];

const services = [
  { title: "Vaccinations", desc: "Grippe, COVID-19, Voyage" },
  { title: "Livraison a domicile", desc: "Gratuite dans le secteur" },
  { title: "Suivi de sante", desc: "Tension, Diabete, Poids" },
  { title: "Preparations magistrales", desc: "Dosages personnalises" },
  { title: "Synchro. medicaments", desc: "Renouvellement automatique" },
  { title: "Acces PMR", desc: "Rampe et assistance" },
];

export default function PharmacyDetailPage() {
  return (
    <div className="min-h-screen bg-[#F3F6F9] px-6 py-10 text-[#1F1D1B]">
      <div className="mx-auto max-w-6xl space-y-6">
        <TopNav />

        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <section className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
              <div className="relative h-[220px] bg-[url('https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-xl font-semibold">Pharmacie du Centre</h1>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span className="rounded-full bg-emerald-500/80 px-2 py-1">
                      Ouvert
                    </span>
                    <span>4.8 (120 avis)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Adresse",
                  value: "123 Boulevard de la Sante, Suite 100",
                  sub: "Cotonou, Benin",
                },
                {
                  title: "Telephone",
                  value: "+229 67 12 34 56 78",
                  sub: "Ligne principale",
                },
                {
                  title: "E-mail",
                  value: "contact@pharmaciecentre.fr",
                  sub: "",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-4 text-sm"
                >
                  <p className="text-xs font-semibold text-[#6B7280]">{item.title}</p>
                  <p className="mt-2 font-semibold">{item.value}</p>
                  {item.sub ? (
                    <p className="text-xs text-[#6B7280]">{item.sub}</p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
              <h2 className="text-sm font-semibold">Galerie</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {gallery.map((src, index) => (
                  <div
                    key={src}
                    className="h-24 rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${src})` }}
                    aria-label={`Photo ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
              <h2 className="text-sm font-semibold">A propos de nous</h2>
              <p className="mt-3 text-xs text-[#6B7280]">
                La Pharmacie du Centre est un partenaire de sante de confiance
                dans la communaute de Metropolis depuis plus de 20 ans. Nous
                nous engageons a fournir des soins pharmaceutiques humains,
                en veillant a ce que chaque patient comprenne ses medicaments
                et son plan de traitement.
              </p>
              <p className="mt-3 text-xs text-[#6B7280]">
                Nous proposons des conseils personnalises, des medicaments
                difficiles a trouver et des solutions de soins a domicile.
                Votre sante est notre priorite.
              </p>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
              <h2 className="text-sm font-semibold">Nos services</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <div
                    key={service.title}
                    className="rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs"
                  >
                    <p className="text-sm font-semibold">{service.title}</p>
                    <p className="text-xs text-[#6B7280]">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
              <button className="w-full rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                Obtenir l&apos;itineraire
              </button>
              <button className="mt-3 w-full rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
                Appeler maintenant
              </button>

              <div className="mt-5 space-y-2 text-xs text-[#6B7280]">
                <p className="text-xs font-semibold text-[#1F1D1B]">Horaires d&apos;ouverture</p>
                {[
                  ["Lun - Vend", "08:00 - 20:00"],
                  ["Samedi", "09:00 - 17:00"],
                  ["Dimanche", "Ferme"],
                ].map(([day, time]) => (
                  <div key={day} className="flex items-center justify-between">
                    <span>{day}</span>
                    <span className="text-[#1F1D1B]">{time}</span>
                  </div>
                ))}
                <p className="text-[11px] text-[#9CA3AF]">
                  Les horaires peuvent varier. Veuillez appeler pour confirmer.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
              <h2 className="text-sm font-semibold">Localisation</h2>
              <div className="mt-3 h-40 rounded-2xl bg-[#E5E7EB]">
                <div className="flex h-full items-center justify-center text-xs text-[#6B7280]">
                  Carte
                </div>
              </div>
              <p className="mt-3 text-xs text-[#6B7280]">
                Situe pres de l&apos;Hopital Central, en face du Grand Parc.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { TopNav } from "@/components/TopNav";

const recentSearches = [
  { name: "Doliprane 1000mg", time: "Il y a 2 heures" },
  { name: "Vitamine C 500", time: "Hier" },
];

const pharmacies = [
  {
    name: "Pharmacie CVS",
    rating: "4.8",
    address: "123 Rue Principale, Centre-ville",
    distance: "0.5 km",
    status: "OUVERT",
  },
  {
    name: "Walgreens",
    rating: "4.5",
    address: "456 Av. des Chenes, Uptown",
    distance: "1.2 km",
    status: "OUVERT",
  },
  {
    name: "HealthMart",
    rating: "4.9",
    address: "789 Rue des Pins, Ouest",
    distance: "2.8 km",
    status: "FERME",
  },
  {
    name: "Rite Aid",
    rating: "4.2",
    address: "321 Rue des Ormes, Nord",
    distance: "3.5 km",
    status: "OUVERT",
  },
];

const services = ["Drive", "Vaccins", "24h/24", "Livraison"];

export default function DashboardPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#F3F6F9] px-6 py-10 text-[#1F1D1B]">
      <div className="mx-auto max-w-6xl space-y-6">
        <TopNav />

        <section className="relative overflow-hidden rounded-3xl border border-[#0B63D1] bg-[#0B63D1] px-8 py-10 text-white">
          <div className="absolute -left-10 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -right-10 -bottom-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <h1 className="text-2xl font-semibold">
              Trouvez vos medicaments et pharmacies a proximite
            </h1>
            <p className="text-sm text-white/80">
              Recherchez des medicaments sur ordonnance, des produits en vente libre,
              et verifiez la disponibilite des stocks instantanement.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white px-3 py-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un medicament (ex: Amoxicilline) ou une pharmacie..."
                className="flex-1 border-none bg-transparent text-xs text-[#1F1D1B] outline-none"
              />
              <Link
                href="/search"
                className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
              >
                Rechercher
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recherches recentes</h2>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] bg-white">
            {recentSearches.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-[#6B7280]">{item.time}</p>
                </div>
                <span className="text-[#9CA3AF]">{">"}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Pharmacies a proximite</h2>
            <Link
              href="/search"
              className="rounded-full border border-[#E5E7EB] px-3 py-2 text-[11px] font-semibold text-[#1F1D1B]"
            >
              Voir la carte
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {pharmacies.map((pharmacy, index) => (
              <div
                key={pharmacy.name}
                className="rounded-3xl border border-[#E5E7EB] bg-white p-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="h-20 w-20 rounded-2xl bg-[#E5E7EB]"
                    style={{
                      backgroundImage:
                        index % 2 === 0
                          ? "url('https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=200&q=60')"
                          : "url('https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=200&q=60')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{pharmacy.name}</p>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          pharmacy.status === "OUVERT"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-rose-100 text-rose-600"
                        }`}
                      >
                        {pharmacy.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280]">
                      {pharmacy.address} • {pharmacy.distance}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#6B7280]">
                      <span className="rounded-full bg-[#EAF2FF] px-2 py-1 text-[#0B63D1]">
                        {pharmacy.rating}★
                      </span>
                      <span>Services</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#6B7280]">
                      {services.slice(0, 2).map((service) => (
                        <span
                          key={service}
                          className="rounded-full bg-[#F3F6F9] px-2 py-1"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/pharmacies/${pharmacy.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[#0B63D1] px-3 py-2 text-xs font-semibold text-[#0B63D1]"
                    >
                      Voir details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

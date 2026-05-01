import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ConditionsUtilisationPage() {
  return (
    <main className="min-h-screen bg-[#F3F6F9] px-4 py-8 text-[#1F2937] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-[#0B63D1]">Conditions d&apos;utilisation</h1>
        <p className="mt-2 text-sm text-[#6B7280]">Dernière mise à jour: 27 avril 2026</p>

        <div className="mt-6 space-y-5 text-sm leading-6 text-[#374151]">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#111827]">1. Objet</h2>
            <p>
              Ces conditions définissent les règles d&apos;utilisation de GoPharma pour la recherche
              de médicaments et de pharmacies à proximité.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#111827]">2. Compte utilisateur</h2>
            <p>
              Vous êtes responsable des informations fournies à l&apos;inscription et de la
              confidentialité de vos identifiants.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#111827]">3. Disponibilité du service</h2>
            <p>
              GoPharma met en oeuvre ses meilleurs efforts pour assurer la disponibilité du service
              mais ne garantit pas une disponibilité continue sans interruption.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#111827]">4. Limitation de responsabilité</h2>
            <p>
              Les informations affichées ne remplacent pas un avis médical. En cas de doute,
              consultez un professionnel de santé.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/politique-confidentialite"
            className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-medium text-[#0B63D1] hover:bg-[#EEF4FF]"
          >
            Voir la politique de confidentialité
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-[#0B63D1] px-4 py-2 text-sm font-medium text-white hover:bg-[#0A58BA]"
          >
            Retour à l&apos;inscription
          </Link>
        </div>
      </div>
    </main>
  );
}

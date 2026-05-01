import Link from "next/link";

export const dynamic = "force-dynamic";

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-[#F3F6F9] px-4 py-8 text-[#1F2937] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-[#0B63D1]">Politique de confidentialité</h1>
        <p className="mt-2 text-sm text-[#6B7280]">Dernière mise à jour: 27 avril 2026</p>

        <div className="mt-6 space-y-5 text-sm leading-6 text-[#374151]">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#111827]">1. Données collectées</h2>
            <p>
              Nous collectons les informations nécessaires à la création et à la gestion de votre
              compte (nom, email, paramètres de compte).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#111827]">2. Localisation</h2>
            <p>
              Votre position est utilisée pour proposer des pharmacies proches lorsque vous
              l&apos;autorisez. Vous pouvez modifier ce choix à tout moment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#111827]">3. Usage des données</h2>
            <p>
              Les données sont utilisées pour le fonctionnement du service, la sécurité du compte
              et l&apos;amélioration de l&apos;expérience utilisateur.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#111827]">4. Vos droits</h2>
            <p>
              Vous pouvez demander la consultation, la rectification ou la suppression de vos
              données conformément à la réglementation applicable.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/conditions-utilisation"
            className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-medium text-[#0B63D1] hover:bg-[#EEF4FF]"
          >
            Voir les conditions d&apos;utilisation
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

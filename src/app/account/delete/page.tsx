import Link from "next/link";
import { PatientShell } from "@/components/PatientShell";

export default function DeleteAccountPage() {
  return (
    <PatientShell>
      <div className="rounded-3xl border border-[#FDE2E2] bg-white p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF5F5] text-[#B91C1C]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M12 8v4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16.5" r="1" fill="currentColor" />
              <path
                d="M12 3l9 16H3l9-16z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-lg font-semibold">
              Confirmation de suppression du compte
            </h1>
            <p className="text-sm text-[#6B7280]">
              Cette action est définitive. Votre compte, vos préférences et
              votre historique seront supprimés.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-xs text-[#6B7280]">
          <div className="rounded-2xl border border-[#FDE2E2] bg-[#FFF5F5] px-4 py-3">
            <p className="text-sm font-semibold text-[#B91C1C]">
              Ce que vous allez perdre
            </p>
            <ul className="mt-2 space-y-2">
              <li>Accès à vos favoris et préférences personnelles.</li>
              <li>Historique de recherche et alertes de stock.</li>
              <li>Rappels d&apos;ordonnance et notifications actives.</li>
            </ul>
          </div>
          <p className="text-[11px]">
            Vous pourrez créer un nouveau compte plus tard, mais toutes les
            données actuelles seront perdues.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <Link
            href="/preferences"
            className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#6B7280]"
          >
            Annuler
          </Link>
          <button className="rounded-full bg-[#B91C1C] px-4 py-2 text-xs font-semibold text-white">
            Supprimer définitivement
          </button>
        </div>
      </div>
    </PatientShell>
  );
}

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EAF3FF] text-[#1F1D1B]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0B63D1] shadow-[0_20px_40px_-25px_rgba(11,99,209,0.8)]">
          <svg viewBox="0 0 64 64" className="h-10 w-10 text-white" aria-hidden="true">
            <path
              d="M12 18h40a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4z"
              fill="currentColor"
              opacity="0.2"
            />
            <path
              d="M24 20h16a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
            />
            <path
              d="M32 26v12M26 32h12"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-[#0B63D1]">GoPharma</h1>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6B7280]">
          Votre santé, accessible
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#0B63D1] border-t-transparent animate-spin" />
          <p className="text-sm text-[#0B63D1]">
            Recherche de pharmacies à proximité...
          </p>
        </div>

        <p className="mt-10 text-[11px] text-[#9CA3AF]">
          © 2026 GoPharma. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}

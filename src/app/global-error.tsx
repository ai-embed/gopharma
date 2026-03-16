"use client";

import { useEffect } from "react";

export const dynamic = "force-dynamic";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="bg-[#F3F6F9] text-[#1F1D1B]">
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
          <p className="text-sm text-[#6B7280]">
            Impossible de charger cette page. Veuillez reessayer.
          </p>
          <button
            onClick={reset}
            className="rounded-full bg-[#0B63D1] px-5 py-2 text-sm font-semibold text-white"
          >
            Reessayer
          </button>
        </div>
      </body>
    </html>
  );
}

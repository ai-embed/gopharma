import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-semibold text-[#6B7280]">
          ADRESSE E-MAIL
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="nom@exemple.com"
          className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-xs font-semibold text-[#6B7280]"
          >
            MOT DE PASSE
          </label>
          <Link
            href="#"
            className="text-xs font-semibold text-[#0B63D1] hover:text-[#0A58BA]"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-[#0B63D1] py-3 text-sm font-semibold text-white transition hover:bg-[#0A58BA]"
      >
        Se connecter
      </button>

      <label className="flex items-center gap-2 text-xs text-[#6B7280]">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-[#CBD5E1] text-[#0B63D1] focus:ring-blue-200"
        />
        Se souvenir de moi
      </label>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">
          Ou continuer avec
        </span>
        <div className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#1F2937]"
        >
          Google
        </button>
        <button
          type="button"
          className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#1F2937]"
        >
          Apple
        </button>
      </div>

      <p className="text-center text-xs text-[#9CA3AF]">
        En continuant, vous acceptez nos{" "}
        <Link href="#" className="font-semibold text-[#0B63D1]">
          Conditions d&apos;utilisation
        </Link>{" "}
        et notre{" "}
        <Link href="#" className="font-semibold text-[#0B63D1]">
          Politique de confidentialité
        </Link>
        .
      </p>
    </div>
  );
}

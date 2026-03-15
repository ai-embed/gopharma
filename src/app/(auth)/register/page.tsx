import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-xs font-semibold text-[#6B7280]">
          NOM COMPLET
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
        />
      </div>

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
        <label htmlFor="password" className="text-xs font-semibold text-[#6B7280]">
          MOT DE PASSE
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-xs font-semibold text-[#6B7280]"
        >
          CONFIRMER LE MOT DE PASSE
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="country" className="text-xs font-semibold text-[#6B7280]">
          PAYS
        </label>
        <select
          id="country"
          name="country"
          className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
          defaultValue="BENIN"
        >
          <option>BENIN</option>
          <option>CÔTE D&apos;IVOIRE</option>
          <option>TOGO</option>
          <option>SENEGAL</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-[#0B63D1] py-3 text-sm font-semibold text-white transition hover:bg-[#0A58BA]"
      >
        Créer un compte
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">
          Ou s&apos;inscrire avec
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
        En créant un compte, vous acceptez nos{" "}
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

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="animate-[fadeIn_0.6s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">
            Connexion
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#1F1D1B]">
            Heureux de vous revoir
          </h2>
        </div>
        <span className="rounded-full border border-[#E4DDD4] bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
          GoPharma Access
        </span>
      </div>

      <p className="mt-3 text-sm text-[#5B544E]">
        Entrez vos identifiants pour accéder à votre espace sécurisé.
      </p>

      <form className="mt-8 space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[#2C2825]">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="nom@exemple.com"
            className="w-full rounded-2xl border border-[#E4DDD4] bg-white px-4 py-3 text-sm text-[#1F1D1B] outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-[#2C2825]">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full rounded-2xl border border-[#E4DDD4] bg-white px-4 py-3 text-sm text-[#1F1D1B] outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#CFC6BB] text-emerald-700 focus:ring-emerald-200"
            />
            <span className="text-[#5B544E]">Se souvenir de moi</span>
          </label>
          <Link href="#" className="font-medium text-emerald-700 hover:text-emerald-900">
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-emerald-900 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Se connecter
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#E6DED5]" />
        <span className="text-xs uppercase tracking-[0.2em] text-[#9A9186]">
          ou
        </span>
        <div className="h-px flex-1 bg-[#E6DED5]" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-2xl border border-[#E4DDD4] bg-white px-4 py-3 text-sm font-semibold text-[#2C2825] transition hover:border-emerald-400"
        >
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-2xl border border-[#E4DDD4] bg-white px-4 py-3 text-sm font-semibold text-[#2C2825] transition hover:border-emerald-400"
        >
          Apple
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-[#6B6259]">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-semibold text-emerald-700">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

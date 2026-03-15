import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="animate-[fadeIn_0.6s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-700">
            Inscription
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#1F1D1B]">
            Créez votre compte
          </h2>
        </div>
        <span className="rounded-full border border-[#E4DDD4] bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800">
          GoPharma Start
        </span>
      </div>

      <p className="mt-3 text-sm text-[#5B544E]">
        Renseignez vos informations. Un email de vérification sera envoyé pour
        activer votre compte.
      </p>

      <div className="mt-6 rounded-2xl border border-[#E4DDD4] bg-[#FBFAF8] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8F857A]">
          Type de compte
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="rounded-2xl border border-emerald-700 bg-emerald-50 px-4 py-3 text-left text-sm font-semibold text-emerald-900"
          >
            Patient
            <span className="mt-1 block text-xs font-normal text-emerald-700">
              Recherche et notifications personnelles
            </span>
          </button>
          <button
            type="button"
            className="rounded-2xl border border-[#E4DDD4] bg-white px-4 py-3 text-left text-sm font-semibold text-[#2C2825]"
          >
            Pharmacie
            <span className="mt-1 block text-xs font-normal text-[#6B6259]">
              Validation requise par l&apos;administration
            </span>
          </button>
        </div>
      </div>

      <form className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-[#2C2825]">
              Prénom
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Amina"
              className="w-full rounded-2xl border border-[#E4DDD4] bg-white px-4 py-3 text-sm text-[#1F1D1B] outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-[#2C2825]">
              Nom
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Kouassi"
              className="w-full rounded-2xl border border-[#E4DDD4] bg-white px-4 py-3 text-sm text-[#1F1D1B] outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[#2C2825]">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="nom@exemple.com"
            className="w-full rounded-2xl border border-[#E4DDD4] bg-white px-4 py-3 text-sm text-[#1F1D1B] outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-[#2C2825]">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-[#E4DDD4] bg-white px-4 py-3 text-sm text-[#1F1D1B] outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-[#2C2825]"
            >
              Confirmation
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-[#E4DDD4] bg-white px-4 py-3 text-sm text-[#1F1D1B] outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm text-[#6B6259]">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-[#CFC6BB] text-emerald-700 focus:ring-emerald-200"
          />
          <span>
            J&apos;accepte les conditions d&apos;utilisation et la politique de
            confidentialité.
          </span>
        </label>

        <button
          type="submit"
          className="w-full rounded-2xl bg-orange-600 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Créer mon compte
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#6B6259]">
        Déjà inscrit ?{" "}
        <Link href="/login" className="font-semibold text-orange-700">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

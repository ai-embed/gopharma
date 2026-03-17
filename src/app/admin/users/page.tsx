import Link from "next/link";

const stats = [
  {
    label: "Utilisateurs Totaux",
    value: "2 845",
    note: "+12% ce mois",
    noteTone: "emerald",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3z"
          fill="currentColor"
        />
        <path
          d="M4 18a4 4 0 0 1 8 0M12 18a4 4 0 0 1 8 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Validations en Attente",
    value: "48",
    note: "Action requise",
    noteTone: "amber",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M12 4l7 3v5c0 4.5-3 7.5-7 8-4-0.5-7-3.5-7-8V7l7-3z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M12 9v4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Pharmaciens",
    value: "420",
    note: "Comptes actifs",
    noteTone: "slate",
    tone: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M8 5h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M12 9v6M9 12h6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Nouveaux Aujourd'hui",
    value: "15",
    note: "Inscriptions",
    noteTone: "slate",
    tone: "violet",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <rect
          x="4"
          y="5"
          width="16"
          height="15"
          rx="2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8 3.5v3M16 3.5v3M4 9h16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const users = [
  {
    name: "Dr. Sarah Wilson",
    email: "sarah.w@pharmafinder.com",
    role: "PHARMACIEN",
    status: "Actif",
    date: "24 Oct 2023",
    action: "Modifier",
  },
  {
    name: "Michael Johnson",
    email: "michael.j88@gmail.com",
    role: "PATIENT",
    status: "En attente",
    date: "01 Nov 2023",
    action: "Valider",
  },
  {
    name: "Robert Chen",
    email: "rob.chen@techmail.com",
    role: "PATIENT",
    status: "Actif",
    date: "15 Oct 2023",
    action: "Modifier",
  },
  {
    name: "Dr. Emily Davis",
    email: "e.davis@medcare.org",
    role: "PHARMACIEN",
    status: "En attente",
    date: "Hier",
    action: "Docs",
  },
  {
    name: "Dr. Ahmed Khan",
    email: "ahmed.khan@pharma.net",
    role: "PHARMACIEN",
    status: "Actif",
    date: "12 Sep 2023",
    action: "Modifier",
  },
];

const statusStyles: Record<string, string> = {
  Actif: "text-emerald-600",
  "En attente": "text-amber-600",
};

const roleStyles: Record<string, string> = {
  PHARMACIEN: "bg-sky-100 text-sky-600",
  PATIENT: "bg-slate-100 text-slate-600",
};

const toneStyles: Record<
  string,
  { icon: string; note: string }
> = {
  blue: {
    icon: "bg-[#EAF2FF] text-[#0B63D1]",
    note: "text-emerald-600",
  },
  amber: {
    icon: "bg-amber-100 text-amber-600",
    note: "text-amber-600",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-600",
    note: "text-[#9CA3AF]",
  },
  violet: {
    icon: "bg-violet-100 text-violet-600",
    note: "text-[#9CA3AF]",
  },
};

const noteStyles: Record<string, string> = {
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  slate: "text-[#9CA3AF]",
};

export default function AdminUsersPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Gestion des Utilisateurs</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M20 20l-3.5-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              placeholder="Recherche globale..."
              className="w-56 rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-10 text-xs"
            />
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-[#6B7280]"
              aria-hidden="true"
            >
              <path
                d="M12 4a5 5 0 0 1 5 5v2.2l1.2 2.4c.4.8-.1 1.4-1 1.4H6.8c-.9 0-1.4-.6-1-1.4L7 11.2V9a5 5 0 0 1 5-5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 19a2.5 2.5 0 0 0 5 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs text-[#6B7280]">{stat.label}</p>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                  toneStyles[stat.tone].icon
                }`}
              >
                {stat.icon}
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
            <p className={`mt-2 text-[11px] ${noteStyles[stat.noteTone]}`}>
              {stat.note}
            </p>
          </div>
        ))}
      </div>

          <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4">
              <h2 className="text-sm font-semibold">
                Tous les Utilisateurs Inscrits
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <select className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]">
                  <option>Tous les Rôles</option>
                  <option>Pharmacien</option>
                  <option>Patient</option>
                </select>
                <Link
                  href="/admin/users/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-sm leading-none">
                    +
                  </span>
                  Ajouter un utilisateur
                </Link>
              </div>
            </div>

            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-[720px] w-full text-xs">
                  <thead className="bg-[#F8FAFC] text-[#6B7280]">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <span className="inline-flex h-4 w-4 rounded-full border border-[#D1D5DB]" />
                    </th>
                    <th className="px-4 py-3 text-left">DÉTAILS UTILISATEUR</th>
                    <th className="px-4 py-3 text-left">RÔLE</th>
                    <th className="px-4 py-3 text-left">STATUT</th>
                    <th className="px-4 py-3 text-left">DATE D&apos;INSCRIPTION</th>
                    <th className="px-4 py-3 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.email}
                      className="border-t border-[#E5E7EB]"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex h-4 w-4 rounded-full border border-[#D1D5DB]" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-semibold text-[#0B63D1]">
                            {user.name[0]}
                          </span>
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-[10px] text-[#6B7280]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                            roleStyles[user.role]
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`flex items-center gap-2 text-[11px] font-semibold ${
                            statusStyles[user.status]
                          }`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current" />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">{user.date}</td>
                      <td className="px-4 py-3 text-[11px] font-semibold text-[#0B63D1]">
                        <Link href={`/admin/users/${index + 1}`}>
                          {user.action}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-[#6B7280]">
              <span>Affichage 1-5 sur 2 845</span>
              <div className="flex items-center gap-2">
                <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
                  Précédent
                </button>
                <button className="rounded-full bg-[#0B63D1] px-3 py-1 text-white">
                  1
                </button>
                <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
                  2
                </button>
                <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
                  3
                </button>
                <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
                  Suivant
                </button>
              </div>
            </div>
          </div>
            </div>
  );
}

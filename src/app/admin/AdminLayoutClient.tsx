"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AppFooter from "@/components/AppFooter";

const navSections = [
  {
    title: "Principal",
    items: [
      { href: "/admin/dashboard", label: "Tableau de bord" },
      { href: "/admin/users", label: "Utilisateurs" },
      { href: "/admin/pharmacies", label: "Pharmacies" },
      { href: "/admin/medicaments", label: "Base Médicaments" },
      { href: "/admin/validation-queue", label: "File de validation" },
    ],
  },
  {
    title: "Analytique",
    items: [
      { href: "/admin/reports", label: "Rapports" },
      { href: "/admin/growth", label: "Croissance" },
    ],
  },
  {
    title: "Système",
    items: [
      { href: "/admin/settings", label: "Paramètres" },
      { href: "/admin/audit-logs", label: "Journaux d'audit" },
    ],
  },
];

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F6F8FA] text-[#1F1D1B]">
      <div className="flex flex-col md:flex-row">
        <aside className="flex w-full shrink-0 flex-col border-b border-[#E5E7EB] bg-white px-6 py-6 md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0B63D1] text-xs font-semibold text-white">
              +
            </div>
            <div>
              <p className="text-sm font-semibold">GoPharma</p>
              <p className="text-[11px] text-[#6B7280]">Tableau de bord</p>
            </div>
          </div>

          {navSections.map((section) => (
            <div key={section.title}>
              <p className="mt-8 text-[10px] font-semibold uppercase text-[#9CA3AF]">
                {section.title}
              </p>
              <nav className="mt-3 space-y-1 text-xs font-semibold text-[#6B7280]">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                        isActive
                          ? "bg-[#EAF2FF] text-[#0B63D1]"
                          : "hover:bg-[#F3F6F9]"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          <div className="mt-auto flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-xs text-[#6B7280]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF2FF] text-[11px] font-semibold text-[#0B63D1]">
              AM
            </span>
            <div>
              <p className="text-[11px] font-semibold text-[#1F1D1B]">
                Alex Morgan
              </p>
              <p className="text-[10px]">Super Admin</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            {children}
            <AppFooter />
          </div>
        </main>
      </div>
    </div>
  );
}

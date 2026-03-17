import Link from "next/link";

export default function AppFooter({ align = "left" }: { align?: "left" | "center" }) {
  return (
    <footer
      className={`flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B7280] ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      <span>© 2026 GoPharma. Tous droits réservés.</span>
      <div className="flex flex-wrap items-center gap-3">
        <Link href="#" className="hover:text-[#0B63D1]">
          Aide
        </Link>
        <Link href="#" className="hover:text-[#0B63D1]">
          Confidentialité
        </Link>
        <Link href="#" className="hover:text-[#0B63D1]">
          Conditions
        </Link>
      </div>
    </footer>
  );
}

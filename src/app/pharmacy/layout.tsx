import PharmacyLayoutClient from "./PharmacyLayoutClient";

export const dynamic = "force-dynamic";

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PharmacyLayoutClient>{children}</PharmacyLayoutClient>;
}

import PharmacyLayoutClient from "./PharmacyLayoutClient";

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PharmacyLayoutClient>{children}</PharmacyLayoutClient>;
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoPharma",
  description: "Plateforme de recherche et de gestion pharmaceutique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}

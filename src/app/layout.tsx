import type { Metadata, Viewport } from "next";
import PwaRegister from "@/components/PwaRegister";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import { Chatbot } from "@/components/Chatbot";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoPharma",
  description: "Plateforme de recherche et de gestion pharmaceutique",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GoPharma",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B63D1",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body className="antialiased" suppressHydrationWarning>
        <PwaRegister />
        <PwaInstallPrompt />
        <Chatbot />
        {children}
      </body>
    </html>
  );
}

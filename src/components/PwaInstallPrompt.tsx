"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PwaInstallPrompt() {
  const initialIsIOS =
    typeof window !== "undefined" &&
    /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
  const [isIOS] = useState(initialIsIOS);
  const [visible, setVisible] = useState(initialIsIOS);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as InstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible && !isIOS) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-xs rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs text-[#1F2937] shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Installer GoPharma</p>
          <p className="mt-1 text-[11px] text-[#6B7280]">
            {isIOS
              ? "Sur iPhone, utilisez Partager → Ajouter à l’écran d’accueil."
              : "Ajoutez l’app pour un accès rapide et le mode hors ligne."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-[11px] text-[#9CA3AF]"
        >
          ✕
        </button>
      </div>
      {!isIOS ? (
        <button
          type="button"
          onClick={async () => {
            if (!deferredPrompt) return;
            await deferredPrompt.prompt();
            setVisible(false);
          }}
          className="mt-3 w-full rounded-full bg-[#0B63D1] px-3 py-2 text-[11px] font-semibold text-white"
        >
          Installer
        </button>
      ) : null}
    </div>
  );
}

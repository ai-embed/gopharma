"use client";

import { ReactNode } from "react";
import { TopNav } from "@/components/TopNav";
import AppFooter from "@/components/AppFooter";
import FloatingAssistantButton from "@/components/FloatingAssistantButton";

type PatientShellProps = {
  children: ReactNode;
};

export function PatientShell({ children }: PatientShellProps) {
  return (
    <div className="min-h-screen bg-[#F3F6F9] px-4 py-6 text-[#1F1D1B] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <TopNav />
        {children}
        <AppFooter />
      </div>
      <FloatingAssistantButton />
    </div>
  );
}

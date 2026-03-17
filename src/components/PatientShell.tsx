"use client";

import { ReactNode } from "react";
import { TopNav } from "@/components/TopNav";

type PatientShellProps = {
  children: ReactNode;
};

export function PatientShell({ children }: PatientShellProps) {
  return (
    <div className="min-h-screen bg-[#F3F6F9] px-6 py-10 text-[#1F1D1B]">
      <div className="mx-auto max-w-6xl space-y-6">
        <TopNav />
        {children}
      </div>
    </div>
  );
}

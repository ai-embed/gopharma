"use client";

import Link from "next/link";

export default function FloatingAssistantButton() {
  return (
    <Link
      href="/assistant"
      aria-label="Assistant PharmaBot"
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#0B63D1] text-white shadow-[0_20px_40px_-20px_rgba(11,99,209,0.9)] transition hover:translate-y-[-2px]"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M8 10.5a4 4 0 1 1 8 0v4a4 4 0 0 1-8 0v-4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="10" cy="12" r="1" fill="currentColor" />
        <circle cx="14" cy="12" r="1" fill="currentColor" />
        <path
          d="M9.5 16c1.6 1 3.4 1 5 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M7 9V7a5 5 0 0 1 10 0v2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}

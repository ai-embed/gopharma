export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F6F9] text-[#1F1D1B]">
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-[#E5E7EB] bg-white px-6 py-5">
        <span className="relative flex h-10 w-10 items-center justify-center">
          <span className="absolute h-10 w-10 animate-ping rounded-full border border-[#0B63D1]" />
          <span className="h-3 w-3 rounded-full bg-[#0B63D1]" />
        </span>
        <p className="text-xs font-semibold text-[#6B7280]">Chargement…</p>
      </div>
    </div>
  );
}

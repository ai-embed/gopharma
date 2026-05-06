export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F3F6F9] px-6 text-center text-[#1F1D1B]">
      <h1 className="text-2xl font-semibold">Page introuvable</h1>
      <p className="mt-2 text-sm text-[#6B7280]">
        Cette page n&apos;existe pas ou a ete deplacee.
      </p>
    </div>
  );
}

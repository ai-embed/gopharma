export function Notice({
  tone = "error",
  message,
}: {
  tone?: "error" | "success" | "info";
  message: string;
}) {
  const styles =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "info"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-xs ${styles}`}>
      {message}
    </div>
  );
}

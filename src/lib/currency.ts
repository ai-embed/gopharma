const xofFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

export function formatCurrency(value?: number | null) {
  if (value === undefined || value === null) return "-";
  return xofFormatter.format(value);
}

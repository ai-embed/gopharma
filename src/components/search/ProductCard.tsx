"use client";

interface ProductCardProps {
  productName: string;
  isAvailable: boolean;
  price: number;
}

function formatCompactMoney(value: number) {
  return `${value.toLocaleString("fr-FR")} F`;
}

export function ProductCard({ productName, isAvailable, price }: ProductCardProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-bold ${
            isAvailable
              ? "bg-[#DCFCE7] text-[#17A34A]"
              : "bg-[#FEE2E2] text-[#DC2626]"
          }`}
        >
          {isAvailable ? "✓" : "×"}
        </span>
        <span className="text-[#1F2937]">
          {productName} :{" "}
          <span className={isAvailable ? "text-[#16A34A]" : "text-[#DC2626]"}>
            {isAvailable ? "En stock" : "Indisponible"}
          </span>
        </span>
      </div>
      <span className="min-w-24 text-right text-[13px] font-semibold text-[#1F1D1B]">
        {formatCompactMoney(price)}
      </span>
    </div>
  );
}

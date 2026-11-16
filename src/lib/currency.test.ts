import { describe, expect, it } from "vitest";
import { formatCurrency } from "./currency";

describe("formatCurrency", () => {
  it("formats prices in FCFA without decimal fractions", () => {
    expect(formatCurrency(550)).toBe("550 F CFA");
    expect(formatCurrency(701895)).toBe("701 895 F CFA");
  });

  it("uses a dash when a historical price is missing", () => {
    expect(formatCurrency(undefined)).toBe("-");
  });
});

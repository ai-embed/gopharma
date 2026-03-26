import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import SearchView from "@/app/search/SearchView";
import { apiJson, apiJsonAuth } from "@/lib/api";

vi.mock("@/components/TopNav", () => ({
  TopNav: () => <div data-testid="topnav" />,
}));

vi.mock("@/components/PatientShell", () => ({
  PatientShell: ({ children }: { children: unknown }) => (
    <div data-testid="patient-shell">{children}</div>
  ),
}));

vi.mock("@/lib/api", () => ({
  apiJson: vi.fn(),
  apiJsonAuth: vi.fn(),
}));

describe("SearchPage integration", () => {
  it("suggests products based on prefix", async () => {
    const apiMock = apiJson as unknown as ReturnType<typeof vi.fn>;
    const apiAuthMock = apiJsonAuth as unknown as ReturnType<typeof vi.fn>;
    apiMock.mockImplementation(async (path: string) => {
      if (path.startsWith("/api/search/categories")) {
        return { ok: true, status: 200, data: ["Antalgique"] };
      }
      if (path.startsWith("/api/search/autocomplete")) {
        return { ok: true, status: 200, data: ["Paracetamol", "Paroxyl"] };
      }
      return { ok: true, status: 200, data: [] };
    });
    apiAuthMock.mockResolvedValue({ ok: true, status: 200, data: [] });

    render(<SearchView />);
    const input = screen.getByPlaceholderText("Ajouter un produit...");
    await userEvent.type(input, "par");
    await waitFor(() => expect(screen.getByText("Paracetamol")).toBeInTheDocument());
    await userEvent.click(screen.getByText("Paracetamol"));
    expect(screen.getByText("Paracetamol")).toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe("");
  });
});

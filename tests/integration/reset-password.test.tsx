import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ResetPasswordPage from "@/app/reset-password/page";
import { apiJson } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  apiJson: vi.fn(),
}));

describe("ResetPasswordPage", () => {
  it("submits the email code and new password, then confirms success", async () => {
    const apiMock = apiJson as unknown as ReturnType<typeof vi.fn>;
    apiMock.mockResolvedValue({ ok: true, status: 200, data: { success: true } });
    render(<ResetPasswordPage />);

    fireEvent.change(screen.getByLabelText("Code de réinitialisation"), {
      target: { value: "mail-reset-code" },
    });
    fireEvent.change(screen.getByLabelText(/Nouveau mot de passe/), {
      target: { value: "SecurePass123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirmer le nouveau mot de passe"), {
      target: { value: "SecurePass123!" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Modifier le mot de passe" }).closest("form")!);

    await waitFor(() => {
      expect(apiMock).toHaveBeenCalledWith("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token: "mail-reset-code",
          newPassword: "SecurePass123!",
        }),
      });
    });
    expect(await screen.findByRole("heading", { name: "Mot de passe modifié" })).toBeInTheDocument();
  });

  it("does not submit when the password confirmation differs", async () => {
    const apiMock = apiJson as unknown as ReturnType<typeof vi.fn>;
    apiMock.mockClear();
    render(<ResetPasswordPage />);

    fireEvent.change(screen.getByLabelText("Code de réinitialisation"), {
      target: { value: "mail-reset-code" },
    });
    fireEvent.change(screen.getByLabelText(/Nouveau mot de passe/), {
      target: { value: "SecurePass123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirmer le nouveau mot de passe"), {
      target: { value: "OtherPass123!" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Modifier le mot de passe" }).closest("form")!);

    expect(await screen.findByText("Les mots de passe ne correspondent pas.")).toBeInTheDocument();
    expect(apiMock).not.toHaveBeenCalled();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";
import { apiJsonAuth } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  apiJsonAuth: vi.fn(),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    vi.mocked(apiJsonAuth).mockReset();
    vi.mocked(apiJsonAuth).mockResolvedValue({
      ok: true,
      status: 200,
      data: {},
    });
  });

  it("switches and persists the theme preference", () => {
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole("button", { name: "Activer le thème sombre" }));

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(window.localStorage.getItem("gp.theme.preference")).toBe("dark");
    expect(apiJsonAuth).toHaveBeenCalledWith(
      "/api/users/me/preferences",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ theme: "dark" }),
      })
    );
    expect(
      screen.getByRole("button", { name: "Activer le thème clair" })
    ).toHaveAttribute("aria-pressed", "true");
  });
});

import { render } from "@testing-library/react";
import { act } from "react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

const replaceMock = vi.fn();
const useUserMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock("@/lib/useUser", () => ({
  useUser: () => useUserMock(),
}));

describe("Home redirect integration", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    useUserMock.mockReset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("redirects to role home after splash delay", async () => {
    const cases = [
      { role: "PATIENT", path: "/dashboard" },
      { role: "PHARMACY_MANAGER", path: "/pharmacy/dashboard" },
      { role: "ADMIN", path: "/admin/dashboard" },
      { role: undefined, path: "/login" },
    ];

    for (const scenario of cases) {
      replaceMock.mockReset();
      useUserMock.mockReturnValue({
        user: scenario.role ? { role: scenario.role } : null,
        loading: false,
      });

      const { unmount } = render(<Home />);

      await act(async () => {
        vi.advanceTimersByTime(2600);
      });

      expect(replaceMock).toHaveBeenCalledWith(scenario.path);
      unmount();
    }
  });

  it("does not redirect while profile is still loading", async () => {
    useUserMock.mockReturnValue({ user: null, loading: true });
    render(<Home />);

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });
});

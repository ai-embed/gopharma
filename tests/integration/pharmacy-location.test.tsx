import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DashboardView from "@/app/dashboard/DashboardView";
import { apiJson, apiJsonAuth } from "@/lib/api";
import { ACCESS_KEY } from "@/lib/auth-keys";
import { requestCurrentPosition } from "@/lib/location-preferences";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/PatientShell", () => ({
  PatientShell: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/lib/api", () => ({
  apiJson: vi.fn(),
  apiJsonAuth: vi.fn(),
}));

describe("Pharmacy location", () => {
  const apiMock = apiJson as unknown as ReturnType<typeof vi.fn>;
  const apiAuthMock = apiJsonAuth as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    apiMock.mockReset();
    apiAuthMock.mockReset();
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("requests every listed pharmacy in range, including non-seeded locations", async () => {
    window.localStorage.setItem(ACCESS_KEY, "test-token");
    window.sessionStorage.setItem("gp.location.choice.session.done", "1");
    window.sessionStorage.setItem("gp.location.choice.session.context", "test-token");
    window.sessionStorage.setItem(
      "gp.location.coords.session",
      JSON.stringify({ lat: 6.36, lng: 2.4 })
    );
    apiAuthMock.mockResolvedValue({ ok: true, status: 200, data: [] });

    const pharmacies = Array.from({ length: 15 }, (_, index) => ({
      _id: `pharmacy-${index + 1}`,
      name: `Pharmacie Quartier ${index + 1}`,
      address: "Cotonou",
      isSeeded: index === 0,
      location: {
        coordinates: [2.4 + index * 0.0001, 6.36] as [number, number],
      },
    }));
    apiMock.mockResolvedValue({ ok: true, status: 200, data: pharmacies });

    render(<DashboardView />);

    expect(await screen.findByText("Pharmacie Quartier 15")).toBeInTheDocument();
    expect(screen.getByText("15 pharmacies inscrites autour de vous")).toBeInTheDocument();
    expect(apiMock).toHaveBeenCalledWith(
      "/api/pharmacies?lat=6.36&lng=2.4&radiusKm=50"
    );
  });

  it("requests a fresh high-accuracy browser position", async () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(navigator, "geolocation");
    const getCurrentPosition = vi.fn(
      (success: PositionCallback) =>
        success({
          coords: { latitude: 6.36, longitude: 2.4, accuracy: 42 },
        } as GeolocationPosition)
    );
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition },
    });

    try {
      await expect(requestCurrentPosition()).resolves.toEqual({
        lat: 6.36,
        lng: 2.4,
        accuracyMeters: 42,
      });
      expect(getCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
      );
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(navigator, "geolocation", originalDescriptor);
      } else {
        Reflect.deleteProperty(navigator, "geolocation");
      }
    }
  });
});

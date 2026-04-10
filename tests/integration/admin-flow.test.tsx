import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminDashboardPage from "@/app/admin/dashboard/page";
import AdminUsersPage from "@/app/admin/users/page";
import AdminPharmaciesPage from "@/app/admin/pharmacies/page";
import ValidationQueuePage from "@/app/admin/validation-queue/page";
import { apiJsonAuth } from "@/lib/api";

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

vi.mock("@/lib/api", () => ({
  API_BASE: "http://localhost:3000",
  apiJsonAuth: vi.fn(),
}));

type MockedFn = ReturnType<typeof vi.fn>;

describe("Admin flow integration", () => {
  const apiMock = apiJsonAuth as unknown as MockedFn;

  beforeEach(() => {
    apiMock.mockReset();
  });

  it("loads dashboard metrics from admin endpoints", async () => {
    apiMock.mockImplementation(async (path: string) => {
      if (path === "/api/admin/users") {
        return {
          ok: true,
          status: 200,
          data: [
            {
              _id: "admin-1",
              firstName: "Super",
              lastName: "Admin",
              role: "ADMIN",
              isActive: true,
            },
            {
              _id: "manager-1",
              firstName: "Pharma",
              lastName: "Manager",
              role: "PHARMACY_MANAGER",
              isActive: true,
            },
            {
              _id: "patient-1",
              firstName: "Jean",
              lastName: "Patient",
              role: "PATIENT",
              isActive: false,
            },
          ],
        };
      }
      if (path === "/api/admin/pharmacies") {
        return {
          ok: true,
          status: 200,
          data: [
            {
              _id: "ph-1",
              name: "Pharmacie Fidjrosse",
              accountStatus: "VALIDE",
              operationalStatus: "OUVERT",
            },
            {
              _id: "ph-2",
              name: "Pharmacie Cocotiers",
              accountStatus: "EN_ATTENTE",
              operationalStatus: "FERME",
            },
          ],
        };
      }
      if (path === "/api/admin/validations") {
        return {
          ok: true,
          status: 200,
          data: [
            {
              _id: "val-1",
              pharmacyId: "ph-2",
              requestedByUserId: "manager-1",
              status: "EN_ATTENTE",
              documents: ["doc-1"],
              createdAt: "2026-04-08T10:00:00.000Z",
            },
          ],
        };
      }
      if (path === "/api/admin/audit-logs?page=1&limit=20") {
        return {
          ok: true,
          status: 200,
          data: {
            total: 2,
            items: [
              {
                _id: "audit-1",
                method: "POST",
                path: "/api/admin/validations/val-1/approve",
                outcome: "SUCCESS",
                statusCode: 200,
                createdAt: "2026-04-08T10:15:00.000Z",
              },
              {
                _id: "audit-2",
                method: "GET",
                path: "/api/admin/users",
                outcome: "ERROR",
                statusCode: 500,
                createdAt: "2026-04-08T10:16:00.000Z",
              },
            ],
          },
        };
      }
      if (path === "/api/admin/integrations/status") {
        return {
          ok: true,
          status: 200,
          data: {
            smtp: {
              status: "OK",
              details: "SMTP ready",
              ok: true,
              checkedAt: "2026-04-08T10:16:00.000Z",
            },
            googleMaps: {
              status: "OK",
              details: "Google Maps ready",
              ok: true,
              checkedAt: "2026-04-08T10:16:00.000Z",
            },
          },
        };
      }
      return { ok: true, status: 200, data: [] };
    });

    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Pharmacie Cocotiers")).toBeInTheDocument();
      expect(screen.getByText("Pharma Manager")).toBeInTheDocument();
    });

    expect(apiMock).toHaveBeenCalledWith("/api/admin/users");
    expect(apiMock).toHaveBeenCalledWith("/api/admin/pharmacies");
    expect(apiMock).toHaveBeenCalledWith("/api/admin/validations");
    expect(apiMock).toHaveBeenCalledWith("/api/admin/audit-logs?page=1&limit=20");
    expect(apiMock).toHaveBeenCalledWith("/api/admin/integrations/status");
  });

  it("lets admin suspend a user from users list", async () => {
    let suspended = false;
    apiMock.mockImplementation(async (path: string) => {
      if (path === "/api/admin/users") {
        return {
          ok: true,
          status: 200,
          data: [
            {
              _id: "user-1",
              firstName: "Jean",
              lastName: "Patient",
              email: "jean@example.com",
              role: "PATIENT",
              accountStatus: "VALIDE",
              isActive: !suspended,
              createdAt: "2026-04-08T10:00:00.000Z",
            },
          ],
        };
      }
      if (path === "/api/admin/validations") {
        return { ok: true, status: 200, data: [] };
      }
      if (path === "/api/admin/accounts/user-1/suspend") {
        suspended = true;
        return { ok: true, status: 200, data: { success: true } };
      }
      return { ok: true, status: 200, data: [] };
    });

    render(<AdminUsersPage />);

    await waitFor(() => expect(screen.getByText("Jean Patient")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: "Suspendre" }));

    await waitFor(() => {
      expect(apiMock).toHaveBeenCalledWith(
        "/api/admin/accounts/user-1/suspend",
        expect.objectContaining({ method: "POST" })
      );
      expect(screen.getByText("Compte suspendu: Jean Patient.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Réactiver" })).toBeInTheDocument();
    });
  });

  it("lets admin suspend a pharmacy owner from pharmacies list", async () => {
    let ownerActive = true;
    apiMock.mockImplementation(async (path: string) => {
      if (path === "/api/admin/pharmacies") {
        return {
          ok: true,
          status: 200,
          data: [
            {
              _id: "ph-1",
              name: "Pharmacie Demo",
              address: "Fidjrosse, Cotonou",
              ifu: "IFU-123",
              ownerId: "owner-1",
              accountStatus: "VALIDE",
              operationalStatus: "OUVERT",
              validationDate: "2026-04-08T10:00:00.000Z",
            },
          ],
        };
      }
      if (path === "/api/admin/users") {
        return {
          ok: true,
          status: 200,
          data: [
            {
              _id: "owner-1",
              firstName: "Fati",
              lastName: "Manager",
              email: "fati@example.com",
              isActive: ownerActive,
            },
          ],
        };
      }
      if (path === "/api/admin/validations") {
        return { ok: true, status: 200, data: [] };
      }
      if (path === "/api/admin/accounts/owner-1/suspend") {
        ownerActive = false;
        return { ok: true, status: 200, data: { success: true } };
      }
      return { ok: true, status: 200, data: [] };
    });

    render(<AdminPharmaciesPage />);

    await waitFor(() => expect(screen.getByText("Pharmacie Demo")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: "Suspendre" }));

    await waitFor(() => {
      expect(apiMock).toHaveBeenCalledWith(
        "/api/admin/accounts/owner-1/suspend",
        expect.objectContaining({ method: "POST" })
      );
      expect(screen.getByText("Pharmacie suspendue: Pharmacie Demo.")).toBeInTheDocument();
    });
  });

  it("approves a pending pharmacy from validation queue", async () => {
    vi.spyOn(window, "prompt").mockReturnValue("Validé par test.");
    apiMock.mockImplementation(async (path: string) => {
      if (path === "/api/admin/validations") {
        return {
          ok: true,
          status: 200,
          data: [
            {
              _id: "val-1",
              pharmacyId: "ph-1",
              requestedByUserId: "user-1",
              status: "EN_ATTENTE",
              documents: ["doc-1"],
              createdAt: "2026-04-08T10:00:00.000Z",
              updatedAt: "2026-04-08T10:00:00.000Z",
            },
          ],
        };
      }
      if (path === "/api/admin/pharmacies") {
        return {
          ok: true,
          status: 200,
          data: [
            {
              _id: "ph-1",
              name: "Pharmacie Fidjrosse",
              address: "Fidjrosse, Cotonou",
              ownerId: "user-1",
              accountStatus: "EN_ATTENTE",
            },
          ],
        };
      }
      if (path === "/api/admin/users") {
        return {
          ok: true,
          status: 200,
          data: [
            {
              _id: "user-1",
              firstName: "Jean",
              lastName: "Manager",
              email: "jean.manager@example.com",
              phoneNumber: "+22900000000",
            },
          ],
        };
      }
      if (path === "/api/admin/validations/val-1/approve") {
        return {
          ok: true,
          status: 200,
          data: {
            validation: {
              _id: "val-1",
              status: "VALIDE",
              comment: "Validé par test.",
              updatedAt: "2026-04-08T10:10:00.000Z",
            },
          },
        };
      }
      return { ok: true, status: 200, data: [] };
    });

    render(<ValidationQueuePage />);

    await waitFor(() => expect(screen.getByText("Pharmacie Fidjrosse")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: "Approuver" }));

    await waitFor(() => {
      expect(apiMock).toHaveBeenCalledWith(
        "/api/admin/validations/val-1/approve",
        expect.objectContaining({ method: "POST" })
      );
      expect(
        screen.getByText("Validation approuvée: Pharmacie Fidjrosse.")
      ).toBeInTheDocument();
      expect(screen.getByText("Aucune validation en attente.")).toBeInTheDocument();
    });
  });
});

import { expect, test, type Page, type Route } from "@playwright/test";

type Role = "PATIENT" | "PHARMACY_MANAGER" | "ADMIN";

type MockUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  country?: string;
  accountStatus?: string;
  isActive?: boolean;
};

type MockFavorite = {
  _id: string;
  targetType: "PHARMACY" | "PRODUCT";
  pharmacyId?: string;
  productId?: string;
};

type MockPharmacy = {
  _id: string;
  name: string;
  address: string;
  description?: string;
  email?: string;
  services?: string[];
  operationalStatus?: "OUVERT" | "FERME";
  openNow?: boolean;
  nextTransitionAt?: string;
  location?: { coordinates: [number, number] };
};

type MockSearchResult = {
  _id: string;
  productId: {
    name: string;
    scientificName?: string;
    category?: string;
    isMedicine: boolean;
  };
  pharmacyId: MockPharmacy;
  price: number;
  stockQuantity: number;
  isAvailable: boolean;
};

const TOKENS: Record<Role, { accessToken: string; refreshToken: string }> = {
  PATIENT: { accessToken: "token-patient", refreshToken: "refresh-patient" },
  PHARMACY_MANAGER: {
    accessToken: "token-pharmacy",
    refreshToken: "refresh-pharmacy",
  },
  ADMIN: { accessToken: "token-admin", refreshToken: "refresh-admin" },
};

const USERS_BY_EMAIL: Record<string, Role> = {
  "jean.patient@gopharma.local": "PATIENT",
  "manager@gopharma.local": "PHARMACY_MANAGER",
  "admin@gopharma.local": "ADMIN",
};

const USERS_BY_ROLE: Record<Role, MockUser> = {
  PATIENT: {
    _id: "user-patient-1",
    firstName: "Jean",
    lastName: "Patient",
    email: "jean.patient@gopharma.local",
    role: "PATIENT",
    country: "Bénin",
    accountStatus: "VALIDE",
    isActive: true,
  },
  PHARMACY_MANAGER: {
    _id: "user-manager-1",
    firstName: "Alice",
    lastName: "Manager",
    email: "manager@gopharma.local",
    role: "PHARMACY_MANAGER",
    accountStatus: "VALIDE",
    isActive: true,
  },
  ADMIN: {
    _id: "user-admin-1",
    firstName: "Super",
    lastName: "Admin",
    email: "admin@gopharma.local",
    role: "ADMIN",
    accountStatus: "VALIDE",
    isActive: true,
  },
};

function parseJsonBody(request: Route["request"] extends () => infer R ? R : never) {
  const raw = request.postData();
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function getRoleFromAuthHeader(route: Route) {
  const headers = route.request().headers();
  const raw = headers.authorization ?? headers.Authorization;
  if (!raw) return null;
  const token = raw.replace(/^Bearer\s+/i, "").trim();

  for (const [role, value] of Object.entries(TOKENS) as [Role, { accessToken: string }][]) {
    if (value.accessToken === token) {
      return role;
    }
  }

  return null;
}

async function fulfillJson(route: Route, status: number, data: unknown) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(data),
  });
}

async function installBusinessApiMocks(page: Page) {
  const pharmacies: MockPharmacy[] = [
    {
      _id: "ph-1",
      name: "Pharmacie Fidjrosse",
      address: "Fidjrosse Plage, Cotonou",
      services: ["Vaccination", "Garde"],
      openNow: true,
      operationalStatus: "OUVERT",
      nextTransitionAt: "2026-04-13T21:00:00.000Z",
      location: { coordinates: [2.346, 6.362] },
    },
    {
      _id: "ph-2",
      name: "Pharmacie des Cocotiers",
      address: "Quartier Cocotiers, Cotonou",
      services: ["Livraison", "Drive"],
      openNow: true,
      operationalStatus: "OUVERT",
      nextTransitionAt: "2026-04-13T20:30:00.000Z",
      location: { coordinates: [2.372, 6.356] },
    },
  ];

  const allSearchResults: MockSearchResult[] = [
    {
      _id: "res-1",
      productId: {
        name: "Amoxicilline 500mg",
        scientificName: "Amoxicilline",
        category: "Antibiotique",
        isMedicine: true,
      },
      pharmacyId: pharmacies[0],
      price: 980,
      stockQuantity: 18,
      isAvailable: true,
    },
    {
      _id: "res-2",
      productId: {
        name: "Amoxicilline 500mg",
        scientificName: "Amoxicilline",
        category: "Antibiotique",
        isMedicine: true,
      },
      pharmacyId: pharmacies[1],
      price: 1020,
      stockQuantity: 14,
      isAvailable: true,
    },
  ];

  const notifications = [
    {
      _id: "notif-1",
      title: "Alerte stock",
      message: "Doliprane bientôt en rupture.",
      isRead: false,
      sentAt: new Date("2026-04-12T10:00:00.000Z").toISOString(),
      type: "STOCK_ALERT",
    },
  ];

  const managerProducts = [
    {
      inventoryId: "inv-1",
      price: 2.4,
      stockQuantity: 32,
      alertThreshold: 6,
      isAvailable: true,
      expiryDate: "2027-01-01T00:00:00.000Z",
      product: {
        _id: "prod-1",
        name: "Amoxicilline 500mg",
        category: "Antibiotique",
        barcode: "1234567890123",
      },
    },
  ];

  const managerCategories = [
    {
      _id: "cat-1",
      name: "Antibiotique",
      normalizedName: "antibiotique",
      productCount: 1,
    },
  ];

  const adminUsers = [
    USERS_BY_ROLE.ADMIN,
    USERS_BY_ROLE.PHARMACY_MANAGER,
    USERS_BY_ROLE.PATIENT,
  ];

  const adminPharmacies = [
    {
      _id: "ph-1",
      name: "Pharmacie Fidjrosse",
      address: "Fidjrosse Plage, Cotonou",
      ownerId: "user-manager-1",
      accountStatus: "EN_ATTENTE",
    },
  ];

  const validations = [
    {
      _id: "val-1",
      pharmacyId: "ph-1",
      requestedByUserId: "user-manager-1",
      status: "EN_ATTENTE",
      comment: "",
      documents: ["doc-1"],
      createdAt: "2026-04-13T08:00:00.000Z",
      updatedAt: "2026-04-13T08:00:00.000Z",
    },
  ];

  const favorites: MockFavorite[] = [];
  let favoriteIndex = 1;

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const method = request.method();
    const role = getRoleFromAuthHeader(route);

    if (path === "/api/auth/login" && method === "POST") {
      const body = parseJsonBody(request);
      const email = String(body.email ?? "").trim().toLowerCase();
      const targetRole = USERS_BY_EMAIL[email];
      if (!targetRole) {
        await fulfillJson(route, 401, { detail: "Identifiants invalides." });
        return;
      }
      await fulfillJson(route, 200, TOKENS[targetRole]);
      return;
    }

    if (path === "/api/users/me" && method === "GET") {
      if (!role) {
        await fulfillJson(route, 401, { detail: "Unauthorized" });
        return;
      }
      await fulfillJson(route, 200, USERS_BY_ROLE[role]);
      return;
    }

    if (path === "/api/history") {
      if (method === "GET") {
        await fulfillJson(route, 200, []);
        return;
      }
      if (method === "POST") {
        await fulfillJson(route, 201, { success: true });
        return;
      }
    }

    if (path === "/api/notifications" && method === "GET") {
      await fulfillJson(route, 200, notifications);
      return;
    }

    if (/^\/api\/notifications\/[^/]+\/read$/.test(path) && method === "PATCH") {
      const notificationId = path.split("/")[3];
      const target = notifications.find((entry) => entry._id === notificationId);
      if (target) {
        target.isRead = true;
      }
      await fulfillJson(route, 200, { success: true });
      return;
    }

    if (path === "/api/search/categories" && method === "GET") {
      await fulfillJson(route, 200, ["Antibiotique", "Antalgique"]);
      return;
    }

    if (path === "/api/search/autocomplete" && method === "GET") {
      const query = (url.searchParams.get("q") ?? "").toLowerCase();
      const suggestions = ["Amoxicilline 500mg", "Paracétamol 500mg", "Ibuprofène 400mg"].filter(
        (entry) => entry.toLowerCase().startsWith(query)
      );
      await fulfillJson(route, 200, suggestions);
      return;
    }

    if (path === "/api/search/products" && method === "GET") {
      const query = (url.searchParams.get("q") ?? "").toLowerCase();
      const openNow = url.searchParams.get("openNow");
      let results = allSearchResults.filter((entry) =>
        entry.productId.name.toLowerCase().includes(query)
      );
      if (openNow === "true") {
        results = results.filter((entry) => entry.pharmacyId.openNow !== false);
      }
      await fulfillJson(route, 200, results);
      return;
    }

    if (path === "/api/search/pharmacies" && method === "GET") {
      await fulfillJson(route, 200, pharmacies);
      return;
    }

    if (path === "/api/pharmacies" && method === "GET") {
      await fulfillJson(route, 200, pharmacies);
      return;
    }

    if (/^\/api\/pharmacies\/[A-Za-z0-9_-]+$/.test(path) && method === "GET") {
      const pharmacyId = path.split("/")[3];
      const pharmacy = pharmacies.find((item) => item._id === pharmacyId);
      if (!pharmacy) {
        await fulfillJson(route, 404, { detail: "Pharmacie introuvable." });
        return;
      }
      await fulfillJson(route, 200, pharmacy);
      return;
    }

    if (path === "/api/favorites" && method === "GET") {
      await fulfillJson(route, 200, favorites);
      return;
    }

    if (path === "/api/favorites" && method === "POST") {
      const body = parseJsonBody(request);
      const entry: MockFavorite = {
        _id: `fav-${favoriteIndex++}`,
        targetType: (body.targetType as MockFavorite["targetType"]) ?? "PHARMACY",
        pharmacyId: (body.pharmacyId as string | undefined) ?? undefined,
        productId: (body.productId as string | undefined) ?? undefined,
      };
      favorites.unshift(entry);
      await fulfillJson(route, 201, entry);
      return;
    }

    if (/^\/api\/favorites\/[A-Za-z0-9_-]+$/.test(path) && method === "DELETE") {
      const favoriteId = path.split("/")[3];
      const index = favorites.findIndex((entry) => entry._id === favoriteId);
      if (index >= 0) {
        favorites.splice(index, 1);
      }
      await fulfillJson(route, 200, { success: true });
      return;
    }

    if (path === "/api/manager/pharmacy" && method === "GET") {
      await fulfillJson(route, 200, {
        _id: "ph-1",
        name: "Pharmacie Fidjrosse",
        address: "Fidjrosse Plage, Cotonou",
        accountStatus: "VALIDE",
        operationalStatus: "OUVERT",
      });
      return;
    }

    if (path === "/api/manager/schedules" && method === "GET") {
      await fulfillJson(route, 200, {
        weekly: [
          { dayOfWeek: 1, openTime: "08:00", closeTime: "21:00", isClosed: false },
          { dayOfWeek: 2, openTime: "08:00", closeTime: "21:00", isClosed: false },
          { dayOfWeek: 3, openTime: "08:00", closeTime: "21:00", isClosed: false },
          { dayOfWeek: 4, openTime: "08:00", closeTime: "21:00", isClosed: false },
          { dayOfWeek: 5, openTime: "08:00", closeTime: "21:00", isClosed: false },
        ],
        exceptions: [],
      });
      return;
    }

    if (path === "/api/manager/stats/visits" && method === "GET") {
      await fulfillJson(route, 200, { total: 120, last7Days: 30, last30Days: 80 });
      return;
    }

    if (path === "/api/manager/products" && method === "GET") {
      await fulfillJson(route, 200, managerProducts);
      return;
    }

    if (path === "/api/manager/products/categories" && method === "GET") {
      await fulfillJson(route, 200, managerCategories);
      return;
    }

    if (path === "/api/manager/products/categories" && method === "POST") {
      const body = parseJsonBody(request);
      const name = String(body.name ?? "").trim();
      if (!name) {
        await fulfillJson(route, 400, { detail: "Nom de catégorie requis." });
        return;
      }
      const existing = managerCategories.find(
        (entry) => entry.name.toLowerCase() === name.toLowerCase()
      );
      if (existing) {
        await fulfillJson(route, 409, { detail: "Catégorie déjà existante." });
        return;
      }

      const created = {
        _id: `cat-${managerCategories.length + 1}`,
        name,
        normalizedName: name.toLowerCase(),
        productCount: 0,
      };
      managerCategories.push(created);
      await fulfillJson(route, 201, created);
      return;
    }

    if (path === "/api/admin/users" && method === "GET") {
      await fulfillJson(route, 200, adminUsers);
      return;
    }

    if (path === "/api/admin/pharmacies" && method === "GET") {
      await fulfillJson(route, 200, adminPharmacies);
      return;
    }

    if (path === "/api/admin/validations" && method === "GET") {
      await fulfillJson(route, 200, validations);
      return;
    }

    if (/^\/api\/admin\/validations\/[^/]+\/(approve|reject)$/.test(path) && method === "POST") {
      const [, validationId, action] = path.match(
        /^\/api\/admin\/validations\/([^/]+)\/(approve|reject)$/
      ) ?? ["", "", "approve"];
      const body = parseJsonBody(request);
      const comment = String(body.comment ?? "").trim();
      const entry = validations.find((item) => item._id === validationId);
      if (!entry) {
        await fulfillJson(route, 404, { detail: "Validation introuvable." });
        return;
      }

      entry.status = action === "approve" ? "VALIDE" : "REJETE";
      entry.comment = comment;
      entry.updatedAt = new Date().toISOString();

      await fulfillJson(route, 200, { validation: entry, success: true });
      return;
    }

    if (path === "/api/admin/audit-logs" && method === "GET") {
      await fulfillJson(route, 200, { total: 0, items: [] });
      return;
    }

    if (path === "/api/admin/integrations/status" && method === "GET") {
      await fulfillJson(route, 200, {
        smtp: { status: "OK", details: "SMTP ready", ok: true, checkedAt: new Date().toISOString() },
        googleMaps: {
          status: "OK",
          details: "Google Maps ready",
          ok: true,
          checkedAt: new Date().toISOString(),
        },
      });
      return;
    }

    if (path === "/api/admin/reports/overview" && method === "GET") {
      await fulfillJson(route, 200, {
        totalReports: 8,
        systemAlerts: 1,
        analyzedPharmacies: 4,
        pendingValidations: 1,
        errorEvents: 0,
      });
      return;
    }

    if (path === "/api/admin/growth" && method === "GET") {
      await fulfillJson(route, 200, {
        usersGrowthPercent: 12,
        pharmaciesGrowthPercent: 8,
        totalSearches: 450,
        regionAdoption: [{ label: "Littoral", value: 68 }],
        cohorts: [
          { label: "Semaine 1", value: 62 },
          { label: "Semaine 2", value: 48 },
        ],
      });
      return;
    }

    if (path.startsWith("/api/admin/") || path.startsWith("/api/manager/")) {
      if (!role) {
        await fulfillJson(route, 401, { detail: "Unauthorized" });
        return;
      }
    }

    await fulfillJson(route, 404, { detail: `Mock non géré: ${method} ${path}` });
  });
}

test.describe("Business Flow (Playwright)", () => {
  test("login → recherche → favoris → inventaire pharmacie → validation admin", async ({
    page,
  }) => {
    await installBusinessApiMocks(page);

    await test.step("Patient: connexion", async () => {
      await page.goto("/login");
      await page.getByLabel("ADRESSE E-MAIL").fill("jean.patient@gopharma.local");
      await page.getByLabel("MOT DE PASSE").fill("StrongPass1!");
      await page.getByRole("button", { name: "Se connecter" }).click();
      await expect(page).toHaveURL(/\/dashboard$/);
    });

    await test.step("Patient: recherche et ajout favori", async () => {
      await page.goto("/search");
      await expect(page.getByText("Résultats de recherche")).toBeVisible();

      await page.getByPlaceholder("Ajouter un produit...").fill("Amoxicilline 500mg");
      await page.getByRole("button", { name: "Rechercher" }).click();

      await expect(page.getByText("Pharmacie Fidjrosse")).toBeVisible();
      await page.getByRole("button", { name: "☆ Favori" }).first().click();
      await expect(page.getByRole("button", { name: "★ Favori" }).first()).toBeVisible();

      await page.goto("/favorites");
      await expect(page.getByText("Pharmacie Fidjrosse")).toBeVisible();
      await expect(page.getByText("Pharmacie", { exact: true })).toBeVisible();

      await page.getByRole("button", { name: "Se déconnecter" }).click();
      await expect(page).toHaveURL(/\/login$/);
    });

    await test.step("Pharmacie: connexion et inventaire", async () => {
      await page.goto("/pharmacy-login");
      await page
        .getByLabel("E-mail professionnel")
        .fill("manager@gopharma.local");
      await page.getByLabel("Mot de passe").fill("StrongPass1!");
      await page.getByRole("button", { name: "Se connecter" }).click();
      await expect(page).toHaveURL(/\/pharmacy\/dashboard$/);

      await page.goto("/pharmacy/inventory");
      await expect(page.getByRole("heading", { name: "Inventaire des produits" })).toBeVisible();
      await expect(page.getByText("Amoxicilline 500mg")).toBeVisible();

      await page.getByPlaceholder("Nouvelle catégorie").fill("Antalgique");
      await page.getByRole("button", { name: "Créer" }).click();
      await expect(page.getByText("Antalgique (0)")).toBeVisible();

      await page.getByRole("button", { name: "Déconnexion" }).click();
      await expect(page).toHaveURL(/\/pharmacy-login$/);
    });

    await test.step("Admin: connexion et validation pharmacie", async () => {
      await page.goto("/login");
      await page.getByLabel("ADRESSE E-MAIL").fill("admin@gopharma.local");
      await page.getByLabel("MOT DE PASSE").fill("StrongPass1!");
      await page.getByRole("button", { name: "Se connecter" }).click();
      await page.waitForTimeout(500);

      await page.goto("/admin/validation-queue");
      await expect(page.getByText("Pharmacie Fidjrosse")).toBeVisible();

      page.once("dialog", async (dialog) => {
        await dialog.accept("Validé automatiquement par Playwright.");
      });
      await page.getByRole("button", { name: "Approuver" }).first().click();

      await expect(
        page.getByText("Validation approuvée: Pharmacie Fidjrosse.")
      ).toBeVisible();
      await expect(page.getByText("Aucune validation en attente.")).toBeVisible();
    });
  });
});
